import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import type { Asset } from "./types";
import { ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET } from "../../errors";

export async function downloadReleaseAsset(
  asset: Asset,
  source: string,
  destination: string,
): Promise<void> {
  const response = await fetch(source);

  if (!response.ok || !response.body) {
    throw new Error(
      `${ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET}: ${asset.asset} (${response.status} ${response.statusText})`,
    );
  }

  try {
    await pipeline(response.body, createWriteStream(destination));
  } catch (cause) {
    throw new Error(
      `${ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET}: ${asset.asset} (${response.status} ${response.statusText})`,
      { cause },
    );
  }
}
