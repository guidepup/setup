import { writeFileSync } from "fs";
import { ERR_SETUP_MACOS_UNABLE_TO_WRITE_DATABASE_FILE } from "../../../errors";

export function writeDatabaseFile(): void {
  try {
    writeFileSync(
      "/private/var/db/Accessibility/.VoiceOverAppleScriptEnabled",
      "a",
    );
  } catch (cause) {
    throw new Error(ERR_SETUP_MACOS_UNABLE_TO_WRITE_DATABASE_FILE, { cause });
  }
}
