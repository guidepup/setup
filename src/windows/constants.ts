// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

export const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";
export const VERSIONED_KEY = `guidepup_nvda_${version}`;

export const SUB_KEY_CONTROL_PANEL_DESKTOP = "HKCU\\Control Panel\\Desktop";
export const FOREGROUND_LOCK_TIMEOUT_KEY = "ForegroundLockTimeout";
export const FOREGROUND_FLASH_COUNT_KEY = "ForegroundFlashCount";
