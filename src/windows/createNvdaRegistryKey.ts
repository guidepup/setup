import { promisified as regedit } from "regedit";
import { SUB_KEY_GUIDEPUP_NVDA } from "./constants";
import { ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY } from "../errors";

export async function createNvdaRegistryKey() {
  try {
    await regedit.createKey([SUB_KEY_GUIDEPUP_NVDA]);
  } catch (e) {
    throw new Error(`${ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY}\n\n${e.message}`);
  }
}
