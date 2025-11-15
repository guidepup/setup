import { execSync } from "child_process";
import { getPlatformVersionMajor } from "../getPlatformVersionMajor";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults read com.apple.VoiceOver4/default SCREnableAppleScript";

const VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL =
  "plutil -extract SCREnableAppleScript raw -o - ~/Library/Group\\ Containers/group.com.apple.VoiceOver/Library/Preferences/com.apple.VoiceOver4/default.plist";

export function enabledDefaults(): boolean {
  const platformMajor = getPlatformVersionMajor();

  // For MacOS 14 Sonoma (Darwin 23) and earlier VoiceOver preferences are set via system defaults.
  if (platformMajor < 24) {
    try {
      const result = execSync(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS, {
        encoding: "utf8",
      });

      return result.trim() === "1";
    } catch {
      return false;
    }
  }

  // From MacOS 15 Sequoia (Darwin 24) VoiceOver preferences are sandboxed.
  try {
    const result = execSync(VOICE_OVER_APPLESCRIPT_ENABLED_PLUTIL, {
      encoding: "utf8",
    });

    return result.trim() === "true";
  } catch {
    return false;
  }
}
