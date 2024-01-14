import { getNvdaRegistryData } from "./getNvdaRegistryData";
import { isNvdaInstalled } from "./isNvdaInstalled";
import { createNvdaRegistryKey } from "./createNvdaRegistryKey";
import { installNvda } from "./installNvda";
import { updateNvdaRegistryData } from "./updateNvdaRegistryData";
import { removeForegroundLock } from "./removeForegroundLock";
import { restartExplorer } from "./restartExplorer";
import { resolve } from "path";

export async function setup(): Promise<void> {
  const userProvidedInstallDirectoryFlagIndex =
    process.argv.indexOf("--nvda-install-dir");
  const userProvidedInstallDirectoryRaw =
    userProvidedInstallDirectoryFlagIndex > -1
      ? process.argv.at(userProvidedInstallDirectoryFlagIndex + 1) ?? null
      : null;
  const userProvidedInstallDirectory = userProvidedInstallDirectoryRaw
    ? resolve(userProvidedInstallDirectoryRaw)
    : null;

  const { exists, values } = await getNvdaRegistryData();

  if (isNvdaInstalled({ exists, userProvidedInstallDirectory, values })) {
    return;
  }

  if (!exists) {
    await createNvdaRegistryKey();
  }

  const nvdaDirectory = await installNvda({ userProvidedInstallDirectory });

  await updateNvdaRegistryData({ nvdaDirectory });
  await removeForegroundLock();
  await restartExplorer();
}
