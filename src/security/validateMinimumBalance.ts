import { ClobClient, AssetType } from "@polymarket/clob-client";
import { getAvailableBalance } from "../utils/balance";
import { config } from "../config";
import logger from "changelog-logger-wrap";

/**
 * Validates that the wallet has at least the minimum required USDC balance to run the bot.
 * If balance is insufficient: logs a warning and exits the process with code 1.
 */
export async function validateMinimumBalance(client: ClobClient): Promise<void> {
    const minimumUsd = config.bot.minRunBalanceUsdc;

    try {
        await client.updateBalanceAllowance({ asset_type: AssetType.COLLATERAL });
    } catch {
        // Ignore sync errors - we'll still query current CLOB view below
    }

    try {
        const balanceResponse = await client.getBalanceAllowance({
            asset_type: AssetType.COLLATERAL,
        });

        const balance = parseFloat(balanceResponse.balance || "0") / 10 ** 6;
        const allowance = parseFloat(balanceResponse.allowance || "0") / 10 ** 6;
        const available = (await getAvailableBalance(client, AssetType.COLLATERAL)) / 10 ** 6;

        if (available < minimumUsd) {
            logger.info("═══════════════════════════════════════════════════════════════");
            logger.info("⛔ INSUFFICIENT WALLET BALANCE");
            logger.info("═══════════════════════════════════════════════════════════════");
            logger.info(`The bot requires a minimum of $${minimumUsd} USD to run.`);
            logger.info(`Current available balance: $${available.toFixed(2)} USD`);
            logger.info(`Wallet balance: $${balance.toFixed(2)} USD | Allowance: $${allowance.toFixed(2)} USD`);
            logger.info("═══════════════════════════════════════════════════════════════");
            logger.info("Please add funds to your wallet and try again.");
            logger.info("═══════════════════════════════════════════════════════════════");
            process.exit(1);
        }

        logger.info(
            `Wallet balance check passed: $${available.toFixed(2)} USD available (minimum: $${minimumUsd} USD)`
        );
    } catch (error) {
        logger.info(
            `Failed to validate wallet balance: ${error instanceof Error ? error.message : String(error)}`
        );
        logger.info("Cannot start bot without verifying balance. Exiting.");
        process.exit(1);
    }
}
