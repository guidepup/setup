import { execSync } from "child_process";
import { ERR_MACOS_UNABLE_DISABLE_NOTIFICATION_CENTER } from "../errors";

export function disableNotificationCenter(): void {
  try {
    execSync("killall NotificationCenter", { encoding: "utf8" });
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_UNABLE_DISABLE_NOTIFICATION_CENTER}\n\n${e.message}`,
    );
  }
}
