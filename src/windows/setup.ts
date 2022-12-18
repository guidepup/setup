import { getNvdaRegistryData } from "./getNvdaRegistryData";
import { isNvdaInstalled } from "./isNvdaInstalled";
import { createNvdaRegistryKey } from "./createNvdaRegistryKey";
import { installNvda } from "./installNvda";
import { updateNvdaRegistryData } from "./updateNvdaRegistryData";

export async function setup(): Promise<void> {
  const { exists, values } = await getNvdaRegistryData();

  if (isNvdaInstalled({ exists, values })) {
    return;
  }

  if (!exists) {
    await createNvdaRegistryKey();
  }

  const nvdaDirectory = await installNvda();

  await updateNvdaRegistryData({ nvdaDirectory });
}
