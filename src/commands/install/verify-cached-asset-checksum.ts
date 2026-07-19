import type { Stats } from "node:fs";
import { rm, stat } from "node:fs/promises";
import { sha256 } from "./sha256";

export async function verifyCachedAssetChecksum(
  assetPath: string,
  expectedSha256: string,
): Promise<boolean> {
  let file: Stats;

  try {
    file = await stat(assetPath);
  } catch {
    return false;
  }

  if (!file.isFile()) {
    return false;
  }

  const actualSha256 = await sha256(assetPath);

  if (actualSha256 === expectedSha256) {
    return true;
  }

  try {
    await rm(assetPath, { force: true });
  } catch {
    // Swallow
  }

  return false;
}
