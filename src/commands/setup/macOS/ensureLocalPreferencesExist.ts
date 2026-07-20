import { execSync } from "node:child_process";
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

function startVoiceOver(): void {
  try {
    execSync(
      "/System/Library/CoreServices/VoiceOver.app/Contents/MacOS/VoiceOverStarter &",
      { stdio: "ignore" },
    );
  } catch (cause) {
    throw new Error(ERR_SETUP_MACOS_UNABLE_TO_START_VOICEOVER, { cause });
  }
}

function isRunning(): void {
  try {
    const stdout = execSync('ps aux | egrep "[V]oiceOver"', {
      encoding: "utf-8",
    });

    if (stdout !== "") {
      return;
    }
  } catch {
    // Swallow
  }

  throw new Error(ERR_SETUP_MACOS_UNABLE_TO_START_VOICEOVER);
}

function isNotRunning(): Promise<boolean> {
  try {
    const stdout = execSync('ps aux | egrep "[V]oiceOver"', {
      encoding: "utf-8",
    });

    if (stdout === "") {
      return;
    }
  } catch (cause) {
    if (cause?.stderr === "") {
      return;
    }
  }

  throw new Error(ERR_SETUP_MACOS_UNABLE_TO_STOP_VOICEOVER);
}

const stopVoiceOverApplescript = `
tell application "VoiceOver"
  with transaction
    quit
  end transaction
end tell`;

async function stopVoiceOver(): Promise<void> {
  await retryOnError(() => runAppleScript(stopVoiceOverApplescript));

  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    execSync(
      `kill -15 $(ps aux | egrep "[V]oiceOver.app/Contents/MacOS/VoiceOver launchd -s" | awk '{print $2}')`,
    );
  } catch {
    // Swallow
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  await retryOnError(() => isNotRunning(), { retries: 10, delay: 100 });
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

  startVoiceOver();

  await retryOnError(() => isRunning(), { retries: 10, delay: 100 });

  await retryOnError(() => preferencesExist(localPlist), {
    retries: 10,
    delay: 100,
  });

  await stopVoiceOver();
}
