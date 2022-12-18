import { existsSync } from "fs";
import { VERSIONED_KEY } from "./constants";

export function isNvdaInstalled({ exists, values }) {
  if (!exists) {
    return false;
  }

  const path = values[VERSIONED_KEY]?.value;

  if (!path) {
    return false;
  }

  return existsSync(path);
}
