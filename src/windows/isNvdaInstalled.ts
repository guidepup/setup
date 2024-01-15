import { existsSync } from "fs";
import { VERSIONED_KEY } from "./constants";
import { RegistryItemValue } from "regedit";

export function isNvdaInstalled({
  exists,
  userProvidedInstallDirectory,
  values,
}: {
  exists: boolean;
  userProvidedInstallDirectory: string | null;
  values: {
    [name: string]: RegistryItemValue;
  };
}) {
  if (!exists) {
    return false;
  }

  const path = values[VERSIONED_KEY]?.value as string;

  if (!path) {
    return false;
  }

  if (userProvidedInstallDirectory !== path) {
    return false;
  }

  return existsSync(path);
}
