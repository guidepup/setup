import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../errors";

export function disableDictationInputAutoEnable(): void {
  try {
    execSync(
      "defaults write com.apple.HIToolbox AppleDictationAutoEnable -bool false"
    );
  } catch (_) {
    throw new Error(ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS);
  }
}
