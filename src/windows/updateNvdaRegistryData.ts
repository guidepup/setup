import { promisified as regedit } from "regedit";
import { SUB_KEY_GUIDEPUP_NVDA, VERSIONED_KEY } from "./constants";
import { ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY } from "../errors";

export async function updateNvdaRegistryData({ nvdaDirectory }) {
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
