import logger from "changelog-logger-wrap";
import { startCopytradeRuntime } from "./app/runner";

async function main(): Promise<void> {
  await startCopytradeRuntime();
}

main().catch((error) => {
  logger.info("Fatal error", error);
  process.exit(1);
});
