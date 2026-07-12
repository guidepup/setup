import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../../../errors";

export function enableAppleScriptControlSystemDefaults(): void {
  try {
    execSync(
      "defaults write com.apple.VoiceOver4/default SCREnableAppleScript -bool true",
      { encoding: "utf8" },
    );

    return;
  } catch (cause) {
    throw new Error(ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS, { cause });
  }
}
