import { setup as setupMacOS } from "./macOS/setup";
import { setup as setupWindows } from "./windows/setup";
import { handleError, handleComplete } from "./logging";
import { ERR_UNSUPPORTED_OS } from "./errors";

async function run(): Promise<void> {
  try {
    switch (process.platform) {
      case "darwin": {
        await setupMacOS();
        break;
      }
      case "win32": {
        await setupWindows();
        break;
      }
      default: {
        throw new Error(ERR_UNSUPPORTED_OS);
      }
    }
  } catch (e) {
    handleError(e);
  }

  handleComplete();
}

run();
