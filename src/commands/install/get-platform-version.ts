import { Asset } from "./types";

export function getPlatformVersion(asset: Asset) {
  return asset.platformVersion ?? "all";
}
