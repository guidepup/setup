import { platform } from "node:os";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";
import type { Asset, ScreenReader } from "./types";
import { verifyCachedAssetChecksum } from "./verify-cached-asset-checksum";
import { downloadAsset } from "./download-asset";
import { verifyAssetChecksum } from "./verify-asset-checksum";
import { extractZip } from "./extract-zip";
import {
  ERR_INSTALL_SCREEN_READER_ASSET_UNAVAILABLE,
  ERR_INSTALL_UNABLE_TO_CREATE_GUIDEPUP_CACHE_ASSET_PATH,
} from "../../errors";
import { handleInfoWithPath } from "../../logging";
import { getPlatformVersion } from "./get-platform-version";
import { platformMajorVersion } from "../../platform-major-version";
import { extractTarGz } from "./extract-tar-gz";

function selectAsset(screenReader: ScreenReader): Asset {
  const currentPlatform = platform();
  const currentPlatformVersion = platformMajorVersion();

  const asset = screenReader.assets.find(
    (asset) =>
      !asset.platformVersion ||
      asset.platformVersion === `${currentPlatformVersion}`,
  );

  if (!asset) {
    throw new Error(
      `${ERR_INSTALL_SCREEN_READER_ASSET_UNAVAILABLE}: ${screenReader.name} on ${currentPlatform} ${currentPlatformVersion}`,
    );
  }

  return asset;
}

async function downloadScreenReader(
  cachePath: string,
  screenReader: ScreenReader,
): Promise<void> {
  const asset = selectAsset(screenReader);

  const downloadDestination = join(
    cachePath,
    screenReader.id,
    getPlatformVersion(asset),
    asset.version,
    asset.asset,
  );

  const currentPlatform = platform();
  const versionMessage = `${asset.version}${asset.platformVersion ? ` - ${currentPlatform} ${asset.platformVersion}` : ""}`;

  if (await verifyCachedAssetChecksum(downloadDestination, asset.sha256)) {
    handleInfoWithPath(
      `${screenReader.name} (${versionMessage}) already in cache at`,
      downloadDestination,
    );

    return;
  }

  const downloadDestinationDirectory = dirname(downloadDestination);

  try {
    mkdirSync(downloadDestinationDirectory, { recursive: true });
  } catch (cause) {
    throw new Error(ERR_INSTALL_UNABLE_TO_CREATE_GUIDEPUP_CACHE_ASSET_PATH, {
      cause,
    });
  }

  const source = `https://github.com/${asset.repository}/releases/download/${asset.version}/${asset.asset}`;

  handleInfoWithPath(
    `Downloading ${screenReader.name} (${versionMessage}) from`,
    source,
  );

  await downloadAsset(asset, source, downloadDestination);

  handleInfoWithPath(
    `${screenReader.name} (${versionMessage}) successfully downloaded to`,
    downloadDestination,
  );

  await verifyAssetChecksum(downloadDestination, asset.sha256);

  if (asset.asset.endsWith(".zip")) {
    const unzipDestination = join(
      cachePath,
      screenReader.id,
      getPlatformVersion(asset),
      asset.version,
      "extracted",
    );

    handleInfoWithPath(
      `Extracting ${screenReader.name} (${versionMessage}) from`,
      downloadDestination,
    );

    await extractZip(asset, downloadDestination, unzipDestination);

    handleInfoWithPath(
      `${screenReader.name} (${versionMessage}) successfully extracted to`,
      unzipDestination,
    );
  } else if (asset.asset.endsWith(".tar.gz")) {
    const unzipDestination = join(
      cachePath,
      screenReader.id,
      getPlatformVersion(asset),
      asset.version,
      "extracted",
    );

    handleInfoWithPath(
      `Extracting ${screenReader.name} (${versionMessage}) from`,
      downloadDestination,
    );

    await extractTarGz(asset, downloadDestination, unzipDestination);

    handleInfoWithPath(
      `${screenReader.name} (${versionMessage}) successfully extracted to`,
      unzipDestination,
    );
  }
}

export async function downloadAssets(
  cachePath: string,
  screenReaders: ScreenReader[],
): Promise<void> {
  await Promise.all(
    screenReaders.map((screenReader) =>
      downloadScreenReader(cachePath, screenReader),
    ),
  );
}
