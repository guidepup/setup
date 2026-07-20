import { execFileSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { retryOnError } from "./retryOnError";
import { runAppleScript } from "./runAppleScript";
import { platformMajorVersion } from "../../../platform-major-version";
import {
  ERR_SETUP_MACOS_UNABLE_TO_FIND_VOICEOVER_PREFERENCES,
  ERR_SETUP_MACOS_UNABLE_TO_START_VOICEOVER,
  ERR_SETUP_MACOS_UNABLE_TO_STOP_VOICEOVER,
} from "../../../errors";

function getPreferencesDirectory(): string {
  const osVersion = platformMajorVersion();

  if (osVersion >= 24) {
    return join(
      homedir(),
      "Library",
      "Group Containers",
      "group.com.apple.VoiceOver",
      "Library",
      "Preferences",
    );
  }

  return join(homedir(), "Library", "Preferences");
}

async function startVoiceOver(): Promise<void> {
  execSync(
    "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter &",
    { stdio: "ignore", timeout: 2000 },
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function isRunning(): boolean {
  try {
    return (
      execFileSync("pgrep", ["-f", "VoiceOver launchd -s"], {
        encoding: "utf8",
        timeout: 2000,
      }).length > 0
    );
  } catch {
    return false;
  }
}

const stopVoiceOverApplescript = `
tell application "System Events"
  key code 96 using {command down}
end tell`;

async function stopVoiceOver(): Promise<void> {
  try {
    await runAppleScript(stopVoiceOverApplescript);
  } catch {
    // Swallow
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    execFileSync(
      "pkill",
      ["-15", "-f", "VoiceOver.app/Contents/MacOS/VoiceOver launchd -s"],
      {
        stdio: "ignore",
        timeout: 2000,
      },
    );
  } catch {
    // Swallow
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (isRunning()) {
    throw new Error(ERR_SETUP_MACOS_UNABLE_TO_STOP_VOICEOVER);
  }
}

function preferencesExist(localPlist: string): void {
  if (existsSync(localPlist)) {
    return;
  }

  throw new Error(ERR_SETUP_MACOS_UNABLE_TO_FIND_VOICEOVER_PREFERENCES);
}

export async function ensureLocalPreferencesExist(): Promise<void> {
  const localPlist = join(
    getPreferencesDirectory(),
    "com.apple.VoiceOver4.local.plist",
  );

  if (existsSync(localPlist)) {
    return;
  }

  await startVoiceOver();

  await retryOnError(
    () => {
      if (!isRunning()) {
        throw new Error(ERR_SETUP_MACOS_UNABLE_TO_START_VOICEOVER);
      }
    },
    { retries: 10, delay: 100 },
  );

  await retryOnError(() => preferencesExist(localPlist), {
    retries: 20,
    delay: 100,
  });

  await retryOnError(() => stopVoiceOver(), { retries: 10, delay: 100 });
}
