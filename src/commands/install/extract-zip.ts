import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import unzipper from "unzipper";
import {
  ERR_INSTALL_EMPTY_EXTRACTED_ASSET,
  ERR_INSTALL_FAILED_TO_EXTRACT_ASSET,
} from "../../errors";
import { handleInfoWithPath } from "../../logging";
import type { Asset } from "./types";
import { deleteAsset } from "./delete-asset";

async function deleteAssets(...assets: string[]) {
  for (const asset of assets) {
    await deleteAsset(asset);
  }
}

export async function extractZip(
  asset: Asset,
  source: string,
  destination: string,
): Promise<void> {
  let files: string[];

  try {
    await createReadStream(source)
      .pipe(unzipper.Extract({ path: destination }))
      .promise();

    files = await readdir(destination);
  } catch (cause) {
    handleInfoWithPath("Unable to extract from", source);

    await deleteAssets(source, destination);

    throw new Error(`${ERR_INSTALL_FAILED_TO_EXTRACT_ASSET}: ${asset.asset}`, {
      cause,
    });
  }

  if (!files.length) {
    handleInfoWithPath("Extracted asset is empty at", destination);

    await deleteAssets(source, destination);

    throw new Error(`${ERR_INSTALL_EMPTY_EXTRACTED_ASSET}: ${asset.asset}`);
  }
}
