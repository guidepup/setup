import { platform, release } from "node:os";
import { checkVersion } from "./checkVersion";
import { enableAppleScriptControlSystemDefaults } from "./enableAppleScriptControlSystemDefaults";
import { disableSplashScreenSystemDefaults } from "./disableSplashScreenSystemDefaults";
import { disableDictationInputAutoEnable } from "./disableDictationInputAutoEnable";
import { isSipEnabled } from "./isSipEnabled";
import { writeDatabaseFile } from "./writeDatabaseFile";
import { SYSTEM_PATH, USER_PATH, updateTccDb } from "./updateTccDb";
import { isAppleScriptControlEnabled } from "./isAppleScriptControlEnabled";
import {
  handleNote,
  handleSetupManualRequired,
  handleWarning,
} from "../../../logging";
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
      await updateTccDb(USER_PATH);
    } catch (e) {
      if (ci) {
        throw e;
      } else {
        handleNote(
          "Unable to configure automation permissions",
          "This can be expected when running the Guidepup setup locally if macOS does not grant the required permissions automatically.\nPlease accept any system dialogs requesting automation permissions while using Guidepup.\nIf you are running Guidepup in CI, use the `--ci` option to skip interactive permission setup.\nAlternatively, please refer to https://www.guidepup.dev/docs/guides/manual-voiceover-setup for instructions on manually configuring VoiceOver permissions.",
        );
      }
    }

    try {
      await updateTccDb(SYSTEM_PATH);
    } catch {
      // Swallow error - most CI don't allow system configuration
    }
  } else {
    handleWarning(
      "Skipping automation permission setup",
      "If the necessary permissions have not been granted by other means, this may result in an environment that is not reliably configured for screen reader automation.\n\nPlease refer to https://www.guidepup.dev/docs/guides/manual-voiceover-setup for instructions on manually configuring VoiceOver permissions.",
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
    enableAppleScriptControlSystemDefaults();

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
