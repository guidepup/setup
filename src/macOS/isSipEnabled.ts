import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_TO_VERIFY_SIP } from "../errors";

export function isSipEnabled(): boolean {
  let commandResult: string;

  try {
    commandResult = execSync("csrutil status", { encoding: "utf8" });
  } catch (e) {
    throw new Error(`${ERR_MACOS_UNABLE_TO_VERIFY_SIP}\n\n${e.message}`);
  }

  return commandResult.includes("enabled");
}
