import { execFile } from "node:child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import {
  ERR_SETUP_MACOS_APPLESCRIPT_CONTROL_ENABLE_TIMEOUT,
  ERR_SETUP_MACOS_UNABLE_TO_OPEN_VOICEOVER_UTILITY,
} from "../../../errors";
import { handleNote, handleSetupManualRequired } from "../../../logging";
import { enabledDbFile } from "./isAppleScriptControlEnabled/enabledDbFile";

const open = promisify(execFile);
const ENABLE_TIMEOUT_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 1000;

export async function waitForAppleScriptControl(): Promise<void> {
  try {
    await open("/usr/bin/open", ["-a", "VoiceOver Utility"]);
  } catch (cause) {
    handleSetupManualRequired();
    throw new Error(ERR_SETUP_MACOS_UNABLE_TO_OPEN_VOICEOVER_UTILITY, {
      cause,
    });
  }

  handleNote(
    "Interaction required",
    `Opening ${chalk.bold("VoiceOver Utility")} for a manual user step.\n\nIn the ${chalk.bold("General")} tab, please tick the checkbox for ${chalk.bold("Allow VoiceOver to be controlled with AppleScript")}.\n\nWaiting for user to apply the change...`,
  );

  const deadline = Date.now() + ENABLE_TIMEOUT_MS;

  while (Date.now() < deadline) {
    if (await enabledDbFile()) {
      return;
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL_INTERVAL_MS);
    });
  }

  handleSetupManualRequired();
  throw new Error(ERR_SETUP_MACOS_APPLESCRIPT_CONTROL_ENABLE_TIMEOUT);
}
