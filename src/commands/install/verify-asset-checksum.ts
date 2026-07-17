import type { Stats } from "node:fs";
import { rm, stat } from "node:fs/promises";
import { sha256 } from "./sha256";
import {
  ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET,
  ERR_INSTALL_FAILED_TO_VERIFY_CHECKSUM,
  ERR_INSTALL_INVALID_CHECKSUM,
} from "../../errors";

async function deleteAsset(assetPath: string): Promise<void> {
  try {
    await rm(assetPath, { force: true });
  } catch {
    // Ignore cleanup failures, preferring to expose the error that triggered
    // cleanup.
  }
}

export async function verifyAssetChecksum(
  assetPath: string,
  expectedSha256: string,
): Promise<void> {
  let file: Stats;

  try {
    file = await stat(assetPath);
  } catch (cause) {
    throw new Error(ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET, { cause });
  }

  if (!file.isFile()) {
    throw new Error(ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET);
  }

  let actualSha256: string;

  try {
    actualSha256 = await sha256(assetPath);
  } catch (cause) {
    await deleteAsset(assetPath);

    throw new Error(ERR_INSTALL_FAILED_TO_VERIFY_CHECKSUM, { cause });
  }

  if (actualSha256 === expectedSha256) {
    return;
  }

  await deleteAsset(assetPath);

  throw new Error(
    `${ERR_INSTALL_INVALID_CHECKSUM}: "${assetPath}"\n\n\t- Expected ${expectedSha256}\n\t- Received ${actualSha256}`,
  );
}
