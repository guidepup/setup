import { promisified as regedit } from "regedit";
import {
  SUB_KEY_CONTROL_PANEL_DESKTOP,
  FOREGROUND_LOCK_TIMEOUT_KEY,
  FOREGROUND_FLASH_COUNT_KEY,
} from "./constants";
import { ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY } from "../errors";

export async function removeForegroundLock() {
  try {
    await regedit.putValue({
      [SUB_KEY_CONTROL_PANEL_DESKTOP]: {
        [FOREGROUND_LOCK_TIMEOUT_KEY]: {
          value: 0,
          type: "REG_DWORD",
        },
      },
    });
    await regedit.putValue({
      [SUB_KEY_CONTROL_PANEL_DESKTOP]: {
        [FOREGROUND_FLASH_COUNT_KEY]: {
          value: 0,
          type: "REG_DWORD",
        },
      },
    });
  } catch (e) {
    throw new Error(`${ERR_WINDOWS_UNABLE_TO_UPDATE_REGISTRY}\n\n${e.message}`);
  }
}
