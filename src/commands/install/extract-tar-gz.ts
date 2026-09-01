import { execFile } from "node:child_process";
import { mkdir, readdir } from "node:fs/promises";
import { promisify } from "node:util";
import {
  ERR_INSTALL_EMPTY_EXTRACTED_ASSET,
  ERR_INSTALL_FAILED_TO_EXTRACT_ASSET,
} from "../../errors";
import { handleInfoWithPath } from "../../logging";
import type { Asset } from "./types";
import { deleteAsset } from "./delete-asset";

const execFileAsync = promisify(execFile);

export async function extractTarGz(
  asset: Asset,
  source: string,
  destination: string,
): Promise<void> {
  let files: string[];

  try {
    await mkdir(destination, { recursive: true });

    await execFileAsync("tar", ["-xzf", source, "-C", destination]);

    files = await readdir(destination);
  } catch (cause) {
    handleInfoWithPath("Unable to extract from", source);

    await deleteAsset(source);
    await deleteAsset(destination);

    throw new Error(`${ERR_INSTALL_FAILED_TO_EXTRACT_ASSET}: ${asset.asset}`, {
      cause,
    });
  }

  if (!files.length) {
    handleInfoWithPath("Extracted asset is empty at", destination);

    await deleteAsset(source);
    await deleteAsset(destination);

    throw new Error(`${ERR_INSTALL_EMPTY_EXTRACTED_ASSET}: ${asset.asset}`);
  }
}
