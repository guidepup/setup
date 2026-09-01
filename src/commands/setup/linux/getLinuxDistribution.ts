import { readFile } from "node:fs/promises";
import { ERR_SETUP_LINUX_GET_DISTRIBUTION } from "../../../errors";

export interface LinuxDistribution {
  id: string;
  versionId: string;
}

export async function getLinuxDistribution(): Promise<LinuxDistribution> {
  try {
    const osRelease = await readFile("/etc/os-release", "utf8");

    const values = Object.fromEntries(
      osRelease
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => {
          const separatorIndex = line.indexOf("=");

          return [
            line.slice(0, separatorIndex),
            line.slice(separatorIndex + 1).replace(/^"|"$/g, ""),
          ];
        }),
    );

    if (!values.ID) {
      throw new Error("Missing required `ID` field in /etc/os-release.");
    }

    if (!values.VERSION_ID) {
      throw new Error(
        "Missing required `VERSION_ID` fields in /etc/os-release.",
      );
    }

    return {
      id: values.ID,
      versionId: values.VERSION_ID,
    };
  } catch (cause) {
    throw new Error(ERR_SETUP_LINUX_GET_DISTRIBUTION, { cause });
  }
}
