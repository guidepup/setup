import { platform, release } from "node:os";
import { checkVersion } from "./checkVersion";
import { enableAppleScriptControlSystemDefaults } from "./enableAppleScriptControlSystemDefaults";
import { disableSplashScreenSystemDefaults } from "./disableSplashScreenSystemDefaults";
import { disableDictationInputAutoEnable } from "./disableDictationInputAutoEnable";
import { isSipEnabled } from "./isSipEnabled";
import { writeDatabaseFile } from "./writeDatabaseFile";
import { SYSTEM_PATH, USER_PATH, updateTccDb } from "./updateTccDb";
import { isAppleScriptControlEnabled } from "./isAppleScriptControlEnabled";
import { handleSetupManualRequired, handleWarning } from "../../../logging";
import { ERR_SETUP_MACOS_REQUIRES_MANUAL_USER_INTERACTION } from "../../../errors";
import { enableDoNotDisturb } from "./enableDoNotDisturb";
import { enabledDbFile } from "./isAppleScriptControlEnabled/enabledDbFile";
import { ensureLocalPreferencesExist } from "./ensureLocalPreferencesExist";

interface MacOSSetupOptions {
  ci?: boolean;
  macosIgnoreTccDb?: boolean;
  macosRecord?: boolean;
}

export async function setup({
  ci = false,
  macosIgnoreTccDb = false,
  macosRecord = false,
}: MacOSSetupOptions = {}): Promise<void> {
  if (!macosIgnoreTccDb) {
    try {
      updateTccDb(USER_PATH);
    } catch (e) {
      if (ci) {
        throw e;
      }
    }

    try {
      updateTccDb(SYSTEM_PATH);
    } catch {
      // Swallow error - most CI don't allow system configuration
    }
  } else {
    handleWarning(
      "Ignoring TCC database updates",
      "If the necessary permissions have not been granted by other means, using this flag may result in your environment not being set up for reliable screen reader automation.",
    );
  }

  const osName = platform();
  const osVersion = release();

  let stopRecording: () => void = () => null;

  if (macosRecord) {
    try {
      const { macOSRecord } = await import("@guidepup/record");

      stopRecording = macOSRecord(
        `./recordings/macos-guidepup-setup-${osName}-${osVersion}-${+new Date()}.mov`,
      );
    } catch {
      handleWarning(
        "@guidepup/record not available",
        "Recording will be skipped. This is expected on platforms without ffmpeg support.",
      );
    }
  }

  try {
    checkVersion();
    enableAppleScriptControlSystemDefaults();
    disableSplashScreenSystemDefaults();
    disableDictationInputAutoEnable();
    await ensureLocalPreferencesExist();

    if (ci) {
      await enableDoNotDisturb();
    }

    if (!isSipEnabled() && !(await enabledDbFile())) {
      writeDatabaseFile();

      return;
    }

    if (await isAppleScriptControlEnabled()) {
      return;
    }

    if (ci) {
      throw new Error(ERR_SETUP_MACOS_REQUIRES_MANUAL_USER_INTERACTION);
    }

    handleSetupManualRequired();
  } finally {
    stopRecording();
  }
}
