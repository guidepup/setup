/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const { guidepupNvdaVersion } = require("../../package.json");

export const GUIDEPUP_NVDA_VERSION = guidepupNvdaVersion;
export const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";
export const VERSIONED_KEY = `guidepup_nvda_${GUIDEPUP_NVDA_VERSION}`;

export const SUB_KEY_CONTROL_PANEL_DESKTOP = "HKCU\\Control Panel\\Desktop";
export const FOREGROUND_LOCK_TIMEOUT_KEY = "ForegroundLockTimeout";
export const FOREGROUND_FLASH_COUNT_KEY = "ForegroundFlashCount";
