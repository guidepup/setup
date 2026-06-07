import { execSync } from "child_process";

const VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS =
  "defaults read com.apple.VoiceOver4/default SCREnableAppleScript";

export function enabledDefaults(): boolean {
  try {
    const result = execSync(VOICE_OVER_APPLESCRIPT_ENABLED_DEFAULTS, {
      encoding: "utf8",
    });

    return result.trim() === "1";
  } catch {
    return false;
  }
}
