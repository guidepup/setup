export interface Asset {
  asset: string;
  platformVersion?: string;
  repository: string;
  sha256: string;
  version: string;
}

export interface ScreenReader {
  assets: [Asset, ...Asset[]];
  defaultDownload: boolean;
  id: string;
  name: string;
  platforms: [NodeJS.Platform, ...NodeJS.Platform[]];
}

export interface Manifest {
  screenReaders: [ScreenReader, ...ScreenReader[]];
  version: number;
}
