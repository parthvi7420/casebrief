import { app } from "./app.js";
import { env } from "./config/env.js";
import { checkDatabaseConnection } from "./config/database.js";
import { loadSyntheticPhishingBenchmark } from "./services/caseService.js";

const PORT = env.PORT || 5000;

async function startServer() {
  console.log("🚀 Starting CaseBrief Cyber Forensics Backend Engine...");

  // 1. Check Database connection
  const dbConnected = await checkDatabaseConnection();
  if (dbConnected) {
    console.log("✅ PostgreSQL Database connected successfully via Prisma.");
  } else {
    console.log("ℹ️ Running in memory-buffered offline mode. Database sync will retry automatically.");
  }

  // 2. Pre-seed the benchmark case in memory
  try {
    await loadSyntheticPhishingBenchmark();
    console.log("🛡️ Benchmark Case #CB-2026-001 (KYC Phishing 4-Event Sequence) pre-loaded.");
  } catch (err) {
    console.warn("⚠️ Warning: Failed to pre-seed benchmark case:", err);
  }

  // 3. Start Express HTTP Server
  const server = app.listen(PORT, () => {
    console.log(`🌐 CaseBrief REST API Server active on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Demo Phishing Endpoint: POST http://localhost:${PORT}/api/demo/phishing`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log("\n🛑 Gracefully shutting down CaseBrief server...");
    server.close(() => {
      console.log("🔌 HTTP Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("❌ Fatal error during server startup:", error);
  process.exit(1);
});
