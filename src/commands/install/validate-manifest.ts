import type { Asset, Manifest, ScreenReader } from "./types";

function validateAsset(asset: unknown): asset is Asset {
  if (!asset) {
    return false;
  }

  if (typeof asset !== "object") {
    return false;
  }

  if (Array.isArray(asset)) {
    return false;
  }

  if (
    !("asset" in asset) ||
    typeof asset.asset !== "string" ||
    !asset.asset.length
  ) {
    return false;
  }

  if (
    "platformVersion" in asset &&
    (typeof asset.platformVersion !== "string" || !asset.platformVersion.length)
  ) {
    return false;
  }

  if (
    !("repository" in asset) ||
    typeof asset.repository !== "string" ||
    !asset.repository.length
  ) {
    return false;
  }

  if (
    !("sha256" in asset) ||
    typeof asset.sha256 !== "string" ||
    !asset.sha256.length
  ) {
    return false;
  }

  if (
    !("version" in asset) ||
    typeof asset.version !== "string" ||
    !asset.version.length
  ) {
    return false;
  }
}

function validateAssets(assets: unknown): assets is Asset[] {
  if (!Array.isArray(assets)) {
    return false;
  }

  return assets.every((asset) => validateAsset(asset));
}

function validatePlatform(platform: unknown): platform is NodeJS.Platform {
  return typeof platform === "string" && !!platform.length;
}

function validatePlatforms(platforms: unknown): platforms is NodeJS.Platform[] {
  if (!Array.isArray(platforms)) {
    return false;
  }

  return platforms.every((platform) => validatePlatform(platform));
}

function validateScreenReader(
  screenReader: unknown,
): screenReader is ScreenReader {
  if (!screenReader) {
    return false;
  }

  if (typeof screenReader !== "object") {
    return false;
  }

  if (Array.isArray(screenReader)) {
    return false;
  }

  if (!("assets" in screenReader)) {
    return false;
  }

  if (
    !("defaultDownload" in screenReader) ||
    typeof screenReader.defaultDownload !== "boolean"
  ) {
    return false;
  }

  if (
    !("id" in screenReader) ||
    typeof screenReader.id !== "string" ||
    !screenReader.id.length
  ) {
    return false;
  }

  if (
    !("name" in screenReader) ||
    typeof screenReader.name !== "string" ||
    !screenReader.name.length
  ) {
    return false;
  }

  if (!("platforms" in screenReader)) {
    return false;
  }

  return (
    validateAssets(screenReader.assets) &&
    validatePlatforms(screenReader.platforms)
  );
}

function validateScreenReaders(
  screenReaders: unknown,
): screenReaders is ScreenReader[] {
  if (!Array.isArray(screenReaders)) {
    return false;
  }

  return screenReaders.every((screenReader) =>
    validateScreenReader(screenReader),
  );
}

function validateVersion(version: unknown): version is number {
  return typeof version === "number";
}

export function validateManifest(manifest: unknown): manifest is Manifest {
  if (!manifest) {
    return false;
  }

  if (typeof manifest !== "object") {
    return false;
  }

  if (Array.isArray(manifest)) {
    return false;
  }

  if (!("screenReaders" in manifest)) {
    return false;
  }

  if (!("version" in manifest)) {
    return false;
  }

  return (
    validateScreenReaders(manifest.screenReaders) &&
    validateVersion(manifest.version)
  );
}
