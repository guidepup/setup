import { promisified as regedit } from "regedit";
import { SUB_KEY_GUIDEPUP_NVDA } from "./constants";
import { ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY } from "../errors";

export async function getNvdaRegistryData() {
  try {
    const {
      [SUB_KEY_GUIDEPUP_NVDA]: { exists, values },
    } = await regedit.list([SUB_KEY_GUIDEPUP_NVDA]);

    return { exists, values };
  } catch {
    throw new Error(ERR_WINDOWS_UNABLE_TO_ACCESS_REGISTRY);
  }
}