import { runDailyQuranicElementsJob } from "./daily-quranic-elements-job";

const RIYADH_OFFSET = 3;

function getRiyadhHour(): number {
  const now = new Date();
  const utcHour = now.getUTCHours();
  return (utcHour + RIYADH_OFFSET) % 24;
}

function getRiyadhMinute(): number {
  return new Date().getUTCMinutes();
}

function getNextRunTime(): Date {
  const now = new Date();
  const riyadhHour = getRiyadhHour();
  
  const next = new Date(now);
  
  if (riyadhHour >= 8) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  
  next.setUTCHours(8 - RIYADH_OFFSET, 0, 0, 0);
  
  return next;
}

function getTimeUntilNext(): number {
  const next = getNextRunTime();
  const now = new Date();
  return next.getTime() - now.getTime();
}

let schedulerInterval: NodeJS.Timeout | null = null;
let isRunning = false;

async function checkAndRun() {
  const riyadhHour = getRiyadhHour();
  const riyadhMinute = getRiyadhMinute();
  
  if (riyadhHour === 8 && riyadhMinute < 5 && !isRunning) {
    isRunning = true;
    console.log("🕐 8:00 AM Riyadh time - Starting daily job...");
    
    try {
      const result = await runDailyQuranicElementsJob();
      console.log("📊 Job result:", result);
    } catch (error) {
      console.error("❌ Job error:", error);
    }
    
    setTimeout(() => {
      isRunning = false;
    }, 5 * 60 * 1000);
  }
}

export function startScheduler() {
  console.log("🚀 Starting Quranic Elements Scheduler...");
  console.log(`📍 Current Riyadh time: ${getRiyadhHour()}:${getRiyadhMinute().toString().padStart(2, '0')}`);
  console.log(`⏰ Next run at 8:00 AM Riyadh time`);
  
  const msUntilNext = getTimeUntilNext();
  const hoursUntil = Math.floor(msUntilNext / (1000 * 60 * 60));
  const minutesUntil = Math.floor((msUntilNext % (1000 * 60 * 60)) / (1000 * 60));
  console.log(`⏳ Time until next run: ${hoursUntil}h ${minutesUntil}m`);
  
  schedulerInterval = setInterval(checkAndRun, 60 * 1000);
  
  checkAndRun();
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("⏹️ Scheduler stopped");
  }
}

export async function runJobManually(): Promise<{ success: boolean; count: number; message: string }> {
  console.log("🔧 Running job manually...");
  return await runDailyQuranicElementsJob();
}

export function getSchedulerStatus(): { 
  isRunning: boolean; 
  currentRiyadhTime: string;
  nextRun: string;
  timeUntilNext: string;
} {
  const riyadhHour = getRiyadhHour();
  const riyadhMinute = getRiyadhMinute();
  const msUntilNext = getTimeUntilNext();
  const hoursUntil = Math.floor(msUntilNext / (1000 * 60 * 60));
  const minutesUntil = Math.floor((msUntilNext % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    isRunning: schedulerInterval !== null,
    currentRiyadhTime: `${riyadhHour}:${riyadhMinute.toString().padStart(2, '0')}`,
    nextRun: "8:00 AM Riyadh",
    timeUntilNext: `${hoursUntil}h ${minutesUntil}m`
  };
}
