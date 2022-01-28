import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS } from "../errors";

export function disableSplashScreenSystemDefaults(): void {
  try {
    execSync(
      "defaults write com.apple.VoiceOverTraining doNotShowSplashScreen -bool true"
    );
  } catch (_) {
    throw new Error(ERR_MACOS_UNABLE_UPDATE_SYSTEM_DEFAULTS)
  }
}
