import { execSync } from "child_process";
import { ERR_SETUP_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../../../errors";

export function disableDictationInputAutoEnable(): void {
  try {
    execSync(
      "defaults write com.apple.HIToolbox AppleDictationAutoEnable -bool false",
      { encoding: "utf8" },
    );
  } catch (cause) {
    throw new Error(ERR_SETUP_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS, { cause });
  }
}
