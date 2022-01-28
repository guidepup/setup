import { checkVersion } from "./checkVersion";
import { enableAppleScriptControlSystemDefaults } from "./enableAppleScriptControlSystemDefaults";
import { disableSplashScreenSystemDefaults } from "./disableSplashScreenSystemDefaults";
import { isSipEnabled } from "./isSipEnabled";
import { writeDatabaseFile } from "./writeDatabaseFile";
import { updateUserTccDb } from "./updateUserTccDb";
import { updateSystemTccDb } from "./updateSystemTccDb";
import { isAppleScriptControlEnabled } from "./isAppleScriptControlEnabled";
import { askUserToControlUi } from "./askUserToControlUi";
import { setVoiceOverEnabledViaUi } from "./setVoiceOverEnabledViaUi";
import { logInfo } from "../logging";
import { ERR_MACOS_REQUIRES_MANUAL_USER_INTERACTION } from "../errors";

export async function setup(): Promise<void> {
  checkVersion();
  enableAppleScriptControlSystemDefaults();
  disableSplashScreenSystemDefaults();

  try {
    updateUserTccDb();
  } catch (_) {
    // ignore
  }

  if (!isSipEnabled()) {
    writeDatabaseFile();
    updateSystemTccDb();

    return;
  }

  if (await isAppleScriptControlEnabled()) {
    return;
  }

  if (process.argv.includes("--ci")) {
    throw new Error(ERR_MACOS_REQUIRES_MANUAL_USER_INTERACTION);
  }

  const credentials = await askUserToControlUi();

  logInfo("");
  logInfo("Starting UI control...");
  logInfo("Please refrain from interaction until the script has completed");

  await setVoiceOverEnabledViaUi(credentials);
}
