import { updateTccDb } from "./updateTccDb";
import { ERR_MACOS_UNABLE_TO_WRITE_SYSTEM_TCC_DB } from "../errors";

export function updateSystemTccDb(): void {
  try {
    updateTccDb("/Library/Application Support/com.apple.TCC/TCC.db");
  } catch (e) {
    throw new Error(ERR_MACOS_UNABLE_TO_WRITE_SYSTEM_TCC_DB)
  }
}
