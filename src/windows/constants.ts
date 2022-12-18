// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

export const VERSIONED_KEY = `guidepup_nvda_${version}`;
export const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";
