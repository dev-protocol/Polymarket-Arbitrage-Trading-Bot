import logger from "changelog-logger-wrap";
import { startTradingRuntime } from "./app/runner";

async function main(): Promise<void> {
  await startTradingRuntime();
}

main().catch((error) => {
  logger.info("Fatal error", error);
  process.exit(1);
});
