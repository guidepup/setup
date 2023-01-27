import { writeFileSync } from "fs";
import { ERR_MACOS_UNABLE_TO_WRITE_DATABASE_FILE } from "../errors";

export function writeDatabaseFile(): void {
  try {
    writeFileSync(
      "/private/var/db/Accessibility/.VoiceOverAppleScriptEnabled",
      "a"
    );
  } catch (e) {
    throw new Error(`${ERR_MACOS_UNABLE_TO_WRITE_DATABASE_FILE}\n\n${e.message}`);
  }
}
