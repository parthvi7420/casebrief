import { PrismaClient } from "@prisma/client";
import { loadSyntheticPhishingBenchmark } from "../src/services/caseService.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CaseBrief database with benchmark forensic cases...");

  try {
    const demoIncident = await loadSyntheticPhishingBenchmark();
    console.log(`✅ Seeded Case ${demoIncident.id}: ${demoIncident.title}`);
  } catch (error) {
    console.error("⚠️ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
