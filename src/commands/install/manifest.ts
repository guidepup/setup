import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { platform } from "node:os";
import {
  ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID,
  ERR_INSTALL_GUIDEPUP_MANIFEST_UNSUPPORTED_SCHEMA,
  ERR_INSTALL_GUIDEPUP_PACKAGE_NOT_FOUND,
  ERR_INSTALL_GUIDEPUP_SCREEN_READER_UNAVAILABLE,
} from "../../errors";

const SUPPORTED_SCHEMA_VERSIONS = [1];

interface ManifestScreenReader {
  id?: string;
  name?: string;
  platforms?: string[];
  defaultDownload?: boolean;
  assets?: unknown[];
  [key: string]: unknown;
}

export interface InstallTarget {
  name: string;
  data: ManifestScreenReader;
}

function isCompatibleWithCurrentPlatform(
  screenReader: ManifestScreenReader,
): boolean {
  const compatiblePlatforms = screenReader.platforms;

  if (!compatiblePlatforms || compatiblePlatforms.length === 0) {
    return true;
  }

  const currentPlatform = platform();

  console.log({ currentPlatform });

  return compatiblePlatforms.some((candidate) => {
    if (typeof candidate !== "string") {
      return false;
    }

    return candidate.toLowerCase() === currentPlatform;
  });
}

function getScreenReaders(
  manifest: Record<string, unknown>,
): Record<string, ManifestScreenReader> {
  const screenReaders = manifest.screenReaders;

  if (!Array.isArray(screenReaders) || screenReaders.length === 0) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  return screenReaders.reduce<Record<string, ManifestScreenReader>>(
    (accumulator, screenReader) => {
      if (!screenReader || typeof screenReader !== "object") {
        return accumulator;
      }

      const screenReaderRecord = screenReader as Record<string, unknown>;
      const id = screenReaderRecord.id;

      if (typeof id === "string" && id.length > 0) {
        accumulator[id] = screenReaderRecord as ManifestScreenReader;
      }

      return accumulator;
    },
    {},
  );
}

export function resolveGuidepupManifest(): Record<string, unknown> {
  let packageJsonPath: string;

  try {
    packageJsonPath = require.resolve("@guidepup/guidepup/package.json", {
      paths: [process.cwd()],
    });
  } catch {
    throw new Error(ERR_INSTALL_GUIDEPUP_PACKAGE_NOT_FOUND);
  }

  const manifestPath = path.join(
    path.dirname(packageJsonPath),
    "manifest.json",
  );

  if (!existsSync(manifestPath)) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  let manifest: unknown;

  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  const manifestRecord = manifest as Record<string, unknown>;
  const schemaVersion = manifestRecord.version;

  if (
    typeof schemaVersion !== "number" ||
    !SUPPORTED_SCHEMA_VERSIONS.includes(schemaVersion)
  ) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_UNSUPPORTED_SCHEMA);
  }

  return manifestRecord;
}

export function selectInstallTargets(
  manifest: Record<string, unknown>,
  requestedScreenReader?: string,
): InstallTarget[] {
  const screenReaders = getScreenReaders(manifest);

  console.log({ screenReaders });

  const selectedNames = requestedScreenReader
    ? [requestedScreenReader]
    : Object.keys(screenReaders).filter((name) => {
        const screenReader = screenReaders[name];

        return (
          screenReader?.defaultDownload === true &&
          isCompatibleWithCurrentPlatform(screenReader)
        );
      });

  console.log({ selectedNames });

  const targets = selectedNames
    .map((name) => ({
      name,
      data: screenReaders[name],
    }))
    .filter((target) => {
      if (!target.data) {
        return false;
      }

      return isCompatibleWithCurrentPlatform(target.data);
    });

  console.log({ targets });

  if (requestedScreenReader && targets.length === 0) {
    throw new Error(
      `${ERR_INSTALL_GUIDEPUP_SCREEN_READER_UNAVAILABLE}: ${requestedScreenReader}`,
    );
  }

  return targets;
}
