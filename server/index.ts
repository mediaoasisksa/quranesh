import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { startScheduler } from "./scheduler";
import { setupChatSocket } from "./chat";
import { BUILD_INFO } from "./build-info";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// No-cache headers for all API responses — prevents stale data from being served
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  setupChatSocket(server);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {

    // ── RELEASE FINGERPRINT LOG (emitted on every startup) ─────────────
    // This is the canonical startup proof. It tells you exactly what is
    // running, which commit, which environment, and which feature flags.
    // If two environments emit different blocks, they are NOT in parity.
    log(`serving on port ${port}`);
    log("════════════════════════════════════════════════════════");
    log(`RELEASE FINGERPRINT`);
    log(`  buildId    : ${BUILD_INFO.buildId}`);
    log(`  commit     : ${BUILD_INFO.commit}  (full: ${BUILD_INFO.commitFull.substring(0, 12)}…)`);
    log(`  commitDate : ${BUILD_INFO.commitDate}`);
    log(`  builtAt    : ${BUILD_INFO.builtAt}`);
    log(`  env        : ${BUILD_INFO.env}`);
    log(`  appVersion : ${BUILD_INFO.appVersion}`);
    log(`  node       : ${BUILD_INFO.nodeVersion}`);
    log(`FEATURE FLAGS`);
    for (const [k, v] of Object.entries(BUILD_INFO.featureFlags)) {
      log(`  ${k.padEnd(40)} = ${v ? "✅ SET" : "❌ MISSING"}`);
    }
    log("════════════════════════════════════════════════════════");
    log("To verify parity: curl <domain>/api/version | jq");
    log("Smoke test: npx tsx scripts/smoke-test.ts <domain>");
    log("════════════════════════════════════════════════════════");

    // Start the daily Quranic elements scheduler (runs at 8 AM Riyadh time)
    startScheduler();
  });
})();
