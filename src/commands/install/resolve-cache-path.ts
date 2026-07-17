import { mkdirSync } from "node:fs";
import { homedir, platform } from "node:os";
import { join, resolve } from "node:path";
import { ERR_INSTALL_UNABLE_TO_RESOLVE_OR_CREATE_GUIDEPUP_CACHE_PATH } from "../../errors";

const defaultCacheLocationMap = {
  darwin: resolve(homedir(), "Library", "Caches", "guidepup"),
  win32: resolve(
    process.env.LOCALAPPDATA ?? join(homedir(), "AppData", "Local"),
    "guidepup",
  ),
};

const defaultCacheLocation = resolve(homedir(), ".cache", "guidepup");

export function resolveCachePath() {
  const cacheLocationOverride =
    process.env.GUIDEPUP_SCREEN_READERS_PATH?.trim();

  if (cacheLocationOverride) {
    const resolvedCacheLocation = resolve(cacheLocationOverride);

    try {
      mkdirSync(resolvedCacheLocation, { recursive: true });
    } catch (cause) {
      throw new Error(
        ERR_INSTALL_UNABLE_TO_RESOLVE_OR_CREATE_GUIDEPUP_CACHE_PATH,
        cause,
      );
    }

    return resolvedCacheLocation;
  }

  const currentPlatform = platform();

  const resolvedCacheLocation =
    defaultCacheLocationMap[currentPlatform] ?? defaultCacheLocation;

  try {
    mkdirSync(resolvedCacheLocation, { recursive: true });
  } catch (cause) {
    throw new Error(
      ERR_INSTALL_UNABLE_TO_RESOLVE_OR_CREATE_GUIDEPUP_CACHE_PATH,
      cause,
    );
  }

  return resolvedCacheLocation;
}
