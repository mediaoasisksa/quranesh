import { Server as SocketServer } from "socket.io";
import type { Server } from "http";
import { db } from "./db";
import { chatMessages } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

const CHAT_ROOMS = [
  { id: "english", name: "English Quran Circle", lang: "English", flag: "🇬🇧", code: "en" },
  { id: "french", name: "Cercle Coranique Français", lang: "French", flag: "🇫🇷", code: "fr" },
  { id: "indonesian", name: "Lingkaran Al-Quran Indonesia", lang: "Indonesian", flag: "🇮🇩", code: "id" },
  { id: "urdu", name: "اردو قرآنی حلقہ", lang: "Urdu", flag: "🇵🇰", code: "ur" },
  { id: "turkish", name: "Türkçe Kur'an Halkası", lang: "Turkish", flag: "🇹🇷", code: "tr" },
  { id: "russian", name: "Коранический Круг", lang: "Russian", flag: "🇷🇺", code: "ru" },
  { id: "spanish", name: "Círculo Coránico Español", lang: "Spanish", flag: "🇪🇸", code: "es" },
  { id: "bengali", name: "বাংলা কুরআন চক্র", lang: "Bengali", flag: "🇧🇩", code: "bn" },
  { id: "hindi", name: "हिंदी कुरान मंडल", lang: "Hindi", flag: "🇮🇳", code: "hi" },
  { id: "german", name: "Deutscher Koran-Kreis", lang: "German", flag: "🇩🇪", code: "de" },
  { id: "swahili", name: "Duara la Quran Kiswahili", lang: "Swahili", flag: "🇹🇿", code: "sw" },
];

export { CHAT_ROOMS };

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

function isArabicText(text: string): boolean {
  const stripped = text.replace(/\s/g, "");
  if (stripped.length === 0) return false;
  const arabicChars = (text.match(new RegExp(ARABIC_REGEX.source, "g")) || []).length;
  return arabicChars / stripped.length > 0.5;
}

async function translateMessage(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return text;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following text to ${targetLang}. If the text contains Quranic terms or Islamic vocabulary, preserve their proper meaning and transliterate key Arabic terms in parentheses when helpful. Return ONLY the translated text, nothing else.\n\nText: ${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) return text;

    const data = await response.json() as any;
    const translated = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return translated || text;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}

export function setupChatSocket(server: Server) {
  const io = new SocketServer(server, {
    cors: { origin: "*" },
    path: "/socket.io",
  });

  const roomUsers = new Map<string, Set<string>>();

  io.on("connection", (socket) => {
    let currentRoom: string | null = null;
    let userName: string = "Guest";
    let userId: string = "";

    socket.on("join_room", async (data: { roomId: string; userName: string; userId: string }) => {
      if (currentRoom) {
        socket.leave(currentRoom);
        const users = roomUsers.get(currentRoom);
        if (users) {
          users.delete(socket.id);
          io.to(currentRoom).emit("user_count", { roomId: currentRoom, count: users.size });
        }
      }

      currentRoom = data.roomId;
      userName = data.userName || "Guest";
      userId = data.userId || "";

      socket.join(currentRoom);

      if (!roomUsers.has(currentRoom)) {
        roomUsers.set(currentRoom, new Set());
      }
      roomUsers.get(currentRoom)!.add(socket.id);

      io.to(currentRoom).emit("user_count", {
        roomId: currentRoom,
        count: roomUsers.get(currentRoom)!.size,
      });

      try {
        const history = await db
          .select()
          .from(chatMessages)
          .where(eq(chatMessages.roomId, currentRoom))
          .orderBy(desc(chatMessages.createdAt))
          .limit(50);

        socket.emit("message_history", history.reverse());
      } catch {
        socket.emit("message_history", []);
      }
    });

    socket.on("send_message", async (data: { text: string }) => {
      if (!currentRoom || !data.text?.trim()) return;

      const room = CHAT_ROOMS.find((r) => r.id === currentRoom);
      if (!room) return;

      const text = data.text.trim();
      const isArabic = isArabicText(text);
      const targetLang = isArabic ? room.lang : "Arabic";
      const originalLang = isArabic ? "Arabic" : room.lang;

      let translatedText = "";
      try {
        translatedText = await translateMessage(text, targetLang);
      } catch {
        translatedText = "";
      }

      const messageData = {
        roomId: currentRoom,
        userId,
        userName,
        originalText: text,
        translatedText: translatedText || null,
        originalLang,
        targetLang,
      };

      try {
        const [saved] = await db.insert(chatMessages).values(messageData).returning();
        io.to(currentRoom).emit("new_message", saved);
      } catch {
        io.to(currentRoom).emit("new_message", {
          ...messageData,
          id: `temp-${Date.now()}`,
          createdAt: new Date(),
        });
      }
    });

    socket.on("disconnect", () => {
      if (currentRoom) {
        const users = roomUsers.get(currentRoom);
        if (users) {
          users.delete(socket.id);
          io.to(currentRoom).emit("user_count", { roomId: currentRoom, count: users.size });
        }
      }
    });
  });

  return io;
}
