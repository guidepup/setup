import { execSync } from "child_process";
import { getPlatformVersionMajor } from "./getPlatformVersionMajor";
import { ERR_MACOS_UNABLE_UPDATE_VOICE_OVER_SANDBOXED_DEFAULTS } from "../errors";

const VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL =
  "plutil -replace SCREnableAppleScript -bool true ~/Library/Group\\ Containers/group.com.apple.VoiceOver/Library/Preferences/com.apple.VoiceOver4/default.plist";

export function enableAppleScriptControlSandboxedDefaults(): void {
  const platformMajor = getPlatformVersionMajor();

  // For MacOS 14 Sonoma (Darwin 23) and earlier VoiceOver preferences are set via system defaults.
  if (platformMajor < 24) {
    return;
  }

  // From MacOS 15 Sequoia (Darwin 24) VoiceOver preferences are sandboxed.
  try {
    execSync(VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL, { encoding: "utf8" });

    return;
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_UNABLE_UPDATE_VOICE_OVER_SANDBOXED_DEFAULTS}\n\n${e.message}`
    );
  }
}