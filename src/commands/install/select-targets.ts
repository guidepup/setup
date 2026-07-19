import { platform } from "node:os";
import { ERR_INSTALL_SCREEN_READER_UNAVAILABLE } from "../../errors";
import type { ScreenReader, Manifest } from "./types";

function isScreenReaderCompatibleWithCurrentPlatform(
  screenReader: ScreenReader,
): boolean {
  const currentPlatform = platform();

  return screenReader.platforms.includes(currentPlatform);
}

function getRequestedTargets(
  manifest: Manifest,
  requestedScreenReadersIds: string[],
): ScreenReader[] {
  const targets = [];

  for (const requestedScreenReaderId of requestedScreenReadersIds) {
    const targetScreenReader = manifest.screenReaders.find(
      (screenReader) =>
        (screenReader.id === requestedScreenReaderId ||
          screenReader.name === requestedScreenReaderId) &&
        isScreenReaderCompatibleWithCurrentPlatform(screenReader),
    );

    if (!targetScreenReader) {
      throw new Error(
        `${ERR_INSTALL_SCREEN_READER_UNAVAILABLE}: ${requestedScreenReaderId}`,
      );
    }

    targets.push(targetScreenReader);
  }

  return targets;
}

function getDefaultTargets(manifest: Manifest): ScreenReader[] {
  return manifest.screenReaders.filter(
    (screenReader) =>
      screenReader.defaultDownload &&
      isScreenReaderCompatibleWithCurrentPlatform(screenReader),
  );
}

export function selectTargets(
  manifest: Manifest,
  requestedScreenReadersIds?: string[],
): ScreenReader[] {
  return requestedScreenReadersIds.length
    ? getRequestedTargets(manifest, requestedScreenReadersIds)
    : getDefaultTargets(manifest);
}
