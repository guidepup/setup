import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../errors";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults write com.apple.VoiceOver4/default SCREnableAppleScript -bool true";

export function enableAppleScriptControlSystemDefaults(): void {
  try {
    execSync(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS, { encoding: "utf8" });

    return;
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS}\n\n${e.message}`,
    );
  }
}
