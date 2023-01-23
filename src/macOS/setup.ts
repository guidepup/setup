import { checkVersion } from "./checkVersion";
import { enableAppleScriptControlSystemDefaults } from "./enableAppleScriptControlSystemDefaults";
import { disableSplashScreenSystemDefaults } from "./disableSplashScreenSystemDefaults";
import { disableDictationInputAutoEnable } from "./disableDictationInputAutoEnable";
import { isSipEnabled } from "./isSipEnabled";
import { writeDatabaseFile } from "./writeDatabaseFile";
import { updateTccDb } from "./updateTccDb";
import { isAppleScriptControlEnabled } from "./isAppleScriptControlEnabled";
import { askUserToControlUi } from "./askUserToControlUi";
import { setVoiceOverEnabledViaUi } from "./setVoiceOverEnabledViaUi";
import { logInfo } from "../logging";
import { ERR_MACOS_REQUIRES_MANUAL_USER_INTERACTION } from "../errors";
import { enableDoNotDisturb } from "./enableDoNotDisturb";
import { record } from "./record";

const isCi = process.argv.includes("--ci");
const isRecorded = process.argv.includes("--record");

export async function setup(): Promise<void> {
  try {
    updateTccDb();
  } catch (e) {
    if (isCi) {
      throw e;
    }
  }

  const stopRecording = isRecorded
    ? record(`./recordings/macos-setup-${+new Date()}.mov`)
    : () => null;

  try {
    checkVersion();
    enableAppleScriptControlSystemDefaults();
    disableSplashScreenSystemDefaults();
    disableDictationInputAutoEnable();

    if (isCi) {
      await enableDoNotDisturb();
    }

    if (!isSipEnabled()) {
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
