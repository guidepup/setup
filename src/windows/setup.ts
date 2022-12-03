import { promisified as regedit } from "regedit";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../../package.json");

const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";

export async function setup(): Promise<void> {
  // TODO: Check if have Guidepup's Portable NVDA installed
  const {
    [SUB_KEY_GUIDEPUP_NVDA]: { exists, values, keys },
  } = await regedit.list([SUB_KEY_GUIDEPUP_NVDA]);

  console.log({ exists, values, keys });

  if (!exists) {
    console.log("creating key");
    await regedit.createKey([SUB_KEY_GUIDEPUP_NVDA]);
  }

  // TODO: Fetch Guidepup's Portable NVDA installed

  // TODO: Create / update registry with Guidepup's Portable NVDA installation location
  const versionedKey = `guidepup_nvda_${version}`;
  console.log({ versionedKey });

  await regedit.putValue({
    [SUB_KEY_GUIDEPUP_NVDA]: {
      [versionedKey]: {
        value: "path\\to\\nvda.exe",
        type: "REG_SZ",
      },
    },
  });

  console.log(await regedit.list([SUB_KEY_GUIDEPUP_NVDA]));
}
