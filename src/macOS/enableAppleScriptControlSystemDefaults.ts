import { execSync } from "child_process";
import { getPlatformVersionMajor } from "./getPlatformVersionMajor";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../errors";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults write com.apple.VoiceOver4/default SCREnableAppleScript -bool true";

const VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL =
  "plutil -replace SCREnableAppleScript -bool true ~/Library/Group\\ Containers/group.com.apple.VoiceOver/Library/Preferences/com.apple.VoiceOver4/default.plist";

export function enableAppleScriptControlSystemDefaults(): void {
  const platformMajor = getPlatformVersionMajor();

  // For MacOS 14 Sonoma (Darwin 23) and earlier VoiceOver preferences are set via system defaults.
  if (platformMajor < 24) {
    try {
      execSync(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS);

      return;
    } catch (e) {
      throw new Error(
        `${ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS}\n\n${e.message}`
      );
    }
  }

  // From MacOS 15 Sequoia (Darwin 24) VoiceOver preferences are sandboxed.
  try {
    execSync(VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL);

    return;
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS}\n\n${e.message}`
    );
  }
}
