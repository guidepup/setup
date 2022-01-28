import { updateTccDb } from "./updateTccDb";
import { ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB } from "../errors";

export function updateUserTccDb(): void {
  try {
    updateTccDb("$HOME/Library/Application Support/com.apple.TCC/TCC.db");
  } catch (e) {
    throw new Error(ERR_MACOS_UNABLE_TO_WRITE_USER_TCC_DB)
  }
}
