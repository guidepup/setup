import { platform } from "node:os";
import { Command } from "commander";
import { setup as setupMacOS } from "./macOS/setup";
import { ERR_UNSUPPORTED_OS } from "../../errors";
import { handleError, handleSetupComplete } from "../../logging";

interface SetupCommandOptions {
  ci: boolean;
  macosIgnoreTccDb: boolean;
  macosRecord: boolean;
}

async function setup(options: SetupCommandOptions): Promise<void> {
  const currentPlatform = platform();

  try {
    switch (currentPlatform) {
      case "win32": {
        break;
      }
      case "darwin": {
        await setupMacOS(options);

        break;
      }
      default: {
        throw new Error(ERR_UNSUPPORTED_OS);
      }
    }
  } catch (e) {
    handleError(e);
  }

  handleSetupComplete();
}

export function setupCommand() {
  return new Command("setup")
    .description(
      "Configure the local environment for screen reader automation.",
    )
    .option("--ci", "Enable CI-specific behavior during setup.")
    .option("--macos-ignore-tcc-db", "Skip macOS TCC database updates.")
    .option("--macos-record", "Screen record the macOS setup.")
    .action(setup);
}
