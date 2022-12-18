import { existsSync, readdirSync } from "fs";
import { promisified as regedit } from "regedit";
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
  const {
    [SUB_KEY_GUIDEPUP_NVDA]: { exists, values },
  } = await regedit.list([SUB_KEY_GUIDEPUP_NVDA]);

  if (isInstalled({ exists, values })) {
    return;
  }

  if (!exists) {
    await regedit.createKey([SUB_KEY_GUIDEPUP_NVDA]);
  }

  const nvdaDirectory = await installNvda();

  await regedit.putValue({
    [SUB_KEY_GUIDEPUP_NVDA]: {
      [VERSIONED_KEY]: {
        value: nvdaDirectory,
        type: "REG_SZ",
      },
    },
  });

  const { [SUB_KEY_GUIDEPUP_NVDA]: results } = await regedit.list([
    SUB_KEY_GUIDEPUP_NVDA,
  ]);

  console.log(JSON.stringify(results, undefined, 2));

  const files = readdirSync(nvdaDirectory);
  console.log(files);
}
