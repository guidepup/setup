import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  ERR_SETUP_LINUX_INSTALL_PACKAGES,
  ERR_SETUP_LINUX_UPDATE_PACKAGES,
} from "../../../errors";

const execFileAsync = promisify(execFile);

const LINUX_PACKAGES = [
  "orca",
  "xvfb",
  "dbus-x11",
  "libglib2.0-bin",
  "pulseaudio",
] as const;

function getAptCommand(): {
  command: string;
  args: string[];
} {
  if (process.getuid?.() === 0) {
    return {
      command: "apt-get",
      args: [],
    };
  }

  return {
    command: "sudo",
    args: ["apt-get"],
  };
}

export async function installPackages(): Promise<void> {
  const { command, args } = getAptCommand();

  try {
    await execFileAsync(command, [...args, "update"]);
  } catch (cause) {
    throw new Error(ERR_SETUP_LINUX_UPDATE_PACKAGES, { cause });
  }

  try {
    await execFileAsync(command, [...args, "install", "-y", ...LINUX_PACKAGES]);
  } catch (cause) {
    throw new Error(ERR_SETUP_LINUX_INSTALL_PACKAGES, { cause });
  }
}
