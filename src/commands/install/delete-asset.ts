import { rm } from "node:fs/promises";
import { handleInfoWithPath } from "../../logging";

export async function deleteAsset(assetPath: string): Promise<void> {
  handleInfoWithPath("Removing", assetPath);

  try {
    await rm(assetPath, { force: true, recursive: true });
  } catch {
    // Ignore cleanup failures, preferring to expose the error that triggered
    // cleanup.
  }
}
