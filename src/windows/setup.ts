import { existsSync, readdirSync } from "fs";
import { promisified as regedit } from "regedit";
import {
  ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY,
  ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY,
} from "../errors";
import { installNvda } from "./installNvda";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";
const VERSIONED_KEY = `guidepup_nvda_${version}`;

function isInstalled({ exists, values }) {
  if (!exists) {
    return false;
  }

  const path = values[VERSIONED_KEY]?.value;

  if (!path) {
    return false;
  }

  return existsSync(path);
}

export async function setup(): Promise<void> {
  let exists, values;

  try {
    ({
      [SUB_KEY_GUIDEPUP_NVDA]: { exists, values },
    } = await regedit.list([SUB_KEY_GUIDEPUP_NVDA]));
  } catch {
    throw new Error(ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY);
  }

  if (isInstalled({ exists, values })) {
    return;
  }

  if (!exists) {
    try {
      await regedit.createKey([SUB_KEY_GUIDEPUP_NVDA]);
    } catch {
      throw new Error(ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY);
    }
  }

  const nvdaDirectory = await installNvda();

  try {
    await regedit.putValue({
      [SUB_KEY_GUIDEPUP_NVDA]: {
        [VERSIONED_KEY]: {
          value: nvdaDirectory,
          type: "REG_SZ",
        },
      },
    });
  } catch {
    throw new Error(ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY);
  }
}
