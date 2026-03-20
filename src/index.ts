import logger from "changelog-utils-wrapper";
import { startTradingRuntime } from "./app/runner";

async function main(): Promise<void> {
  await startTradingRuntime();
}

main().catch((error) => {
  logger.info("Fatal error", error);
  process.exit(1);
});
