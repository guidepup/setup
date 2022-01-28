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

export async function setup(): Promise<void> {
  checkVersion();
  enableAppleScriptControlSystemDefaults();
  disableSplashScreenSystemDefaults();

  if (!isSipEnabled()) {
    writeDatabaseFile();
    updateUserTccDb();
    updateSystemTccDb();

    return;
  }

  if (await isAppleScriptControlEnabled()) {
    return;
  }

  const credentials = await askUserToControlUi();
  await setVoiceOverEnabledViaUi(credentials);
}
