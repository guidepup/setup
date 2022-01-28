// Derived from https://github.com/sindresorhus/macos-version
// MIT License Copyright (c) Sindre Sorhus

import { readFileSync } from "fs";
import { satisfies } from "semver";
import {
  ERR_MACOS_UNABLE_TO_VERIFY_VERSION,
  ERR_MACOS_UNSUPPORTED_VERSION,
} from "../errors";

function clean(version: string): string {
  const { length } = version.split(".");

  if (length === 1) {
    return `${version}.0.0`;
  } else if (length === 2) {
    return `${version}.0`;
  }

  return version;
}

export function checkVersion(): void {
  const plist = readFileSync(
    "/System/Library/CoreServices/SystemVersion.plist",
    "utf8"
  );
  const matches =
    /<key>ProductVersion<\/key>\s*<string>([\d.]+)<\/string>/.exec(plist);

  if (!matches) {
    throw new Error(ERR_MACOS_UNABLE_TO_VERIFY_VERSION);
  }

  const version = clean(matches[1].replace("10.16", "11"));

  if (!satisfies(version, ">=11.0.0")) {
    throw new Error(ERR_MACOS_UNSUPPORTED_VERSION);
  }
}
