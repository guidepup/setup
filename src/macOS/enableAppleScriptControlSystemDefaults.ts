import { execSync } from "child_process";
import { getPlatformVersionMajor } from "./getPlatformVersionMajor";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../errors";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults write com.apple.VoiceOver4/default SCREnableAppleScript -bool true";

export function enableAppleScriptControlSystemDefaults(): void {
  const platformMajor = getPlatformVersionMajor();

  // From MacOS 15 Sequoia (Darwin 24) VoiceOver preferences are sandboxed.
  if (platformMajor >= 24) {
    return;
  }

  // For MacOS 14 Sonoma (Darwin 23) and earlier VoiceOver preferences are set via system defaults.
  try {
    execSync(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS, { encoding: "utf8" });

    return;
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS}\n\n${e.message}`
    );
  }
}
