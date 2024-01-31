import { platform, release } from "os";
import { macOSRecord } from "@guidepup/guidepup";
import { checkVersion } from "./checkVersion";
import { enableAppleScriptControlSystemDefaults } from "./enableAppleScriptControlSystemDefaults";
import { disableSplashScreenSystemDefaults } from "./disableSplashScreenSystemDefaults";
import { disableDictationInputAutoEnable } from "./disableDictationInputAutoEnable";
import { isSipEnabled } from "./isSipEnabled";
import { writeDatabaseFile } from "./writeDatabaseFile";
import { SYSTEM_PATH, USER_PATH, updateTccDb } from "./updateTccDb";
import { isAppleScriptControlEnabled } from "./isAppleScriptControlEnabled";
import { askUserToControlUi } from "./askUserToControlUi";
import { setVoiceOverEnabledViaUi } from "./setVoiceOverEnabledViaUi";
import { logInfo } from "../logging";
import { ERR_MACOS_REQUIRES_MANUAL_USER_INTERACTION } from "../errors";
import { enableDoNotDisturb } from "./enableDoNotDisturb";
import { enabledDbFile } from "./isAppleScriptControlEnabled/enabledDbFile";

const isCi = process.argv.includes("--ci");
const ignoreTccDb = process.argv.includes("--ignore-tcc-db");
const isRecorded = process.argv.includes("--record");

export async function setup(): Promise<void> {
  if (!ignoreTccDb) {
    try {
      updateTccDb(USER_PATH);
    } catch (e) {
      if (isCi) {
        throw e;
      }
    }

    try {
      updateTccDb(SYSTEM_PATH);
    } catch {
      // Swallow error - most CI don't allow system configuration
    }
  }

  const osName = platform();
  const osVersion = release();

  const stopRecording = isRecorded
    ? macOSRecord(
        `./recordings/macos-guidepup-setup-${osName}-${osVersion}-${+new Date()}.mov`
      )
    : () => null;

  try {
    checkVersion();
    enableAppleScriptControlSystemDefaults();
    disableSplashScreenSystemDefaults();
    disableDictationInputAutoEnable();

    if (isCi) {
      await enableDoNotDisturb();
    }

    if (!isSipEnabled() && !(await enabledDbFile())) {
      writeDatabaseFile();

      return;
    }

    if (await isAppleScriptControlEnabled()) {
      return;
    }

    if (isCi) {
      throw new Error(ERR_MACOS_REQUIRES_MANUAL_USER_INTERACTION);
    }

    const credentials = await askUserToControlUi();

    logInfo("");
    logInfo("Starting UI control...");
    logInfo("Please refrain from interaction until the script has completed");

    await setVoiceOverEnabledViaUi(credentials);
  } finally {
    stopRecording();
  }
}
