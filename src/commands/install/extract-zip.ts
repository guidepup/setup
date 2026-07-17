import decompress from "decompress";
import {
  ERR_INSTALL_EMPTY_EXTRACTED_ASSET,
  ERR_INSTALL_FAILED_TO_EXTRACT_ASSET,
} from "../../errors";
import type { Asset } from "./types";
import { deleteAsset } from "./delete-asset";
import { handleInfoWithPath } from "../../logging";

export async function extractZip(
  asset: Asset,
  source: string,
  destination: string,
): Promise<void> {
  let files: never[];

  try {
    files = await decompress(source, destination);
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
