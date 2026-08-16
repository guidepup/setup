import { createWriteStream, rmSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { EnvHttpProxyAgent, fetch } from "undici";
import type { Asset } from "./types";
import { ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET } from "../../errors";

const dispatcher = new EnvHttpProxyAgent();

const DOWNLOAD_BACKOFFS = [500, 1000, 2000, 5000, 8000];

function isRetryableDownloadError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = "code" in error ? error.code : undefined;

  return [
    "ECONNRESET",
    "ECONNREFUSED",
    "ECONNABORTED",
    "ETIMEDOUT",
    "EAI_AGAIN",
  ].includes(code as string);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function downloadAsset(
  asset: Asset,
  source: string,
  destination: string,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= DOWNLOAD_BACKOFFS.length; attempt++) {
    try {
      const response = await fetch(source, {
        dispatcher,
      });

      if (!response.ok || !response.body) {
        if (response.status >= 500 && attempt < DOWNLOAD_BACKOFFS.length) {
          await delay(DOWNLOAD_BACKOFFS[attempt]);

          continue;
        }

        throw new Error(
          `${ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET}: ${asset.asset} (${response.status} ${response.statusText})`,
        );
      }

      await pipeline(response.body, createWriteStream(destination));

      return;
    } catch (cause) {
      lastError = cause;

      rmSync(destination, { force: true });

      if (
        !isRetryableDownloadError(cause) ||
        attempt >= DOWNLOAD_BACKOFFS.length
      ) {
        break;
      }

      await delay(DOWNLOAD_BACKOFFS[attempt]);
    }
  }

  throw new Error(`${ERR_INSTALL_FAILED_TO_DOWNLOAD_ASSET}: ${asset.asset}`, {
    cause: lastError,
  });
}
