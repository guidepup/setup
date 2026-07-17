import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { deleteAsset } from "./delete-asset";
import { resolveManifest } from "./resolve-manifest";

export async function pruneCache(cachePath: string): Promise<void> {
  const required = new Set<string>();
  const linksPath = join(cachePath, ".links");

  let links: string[];

  try {
    links = await readdir(linksPath);
  } catch {
    return;
  }

  for (const link of links) {
    const linkPath = join(linksPath, link);

    let manifestPath: string;

    try {
      manifestPath = await readFile(linkPath, "utf8");
    } catch {
      await deleteAsset(linkPath);

      continue;
    }

    try {
      const { manifest } = resolveManifest(manifestPath);

      for (const screenReader of manifest.screenReaders) {
        for (const asset of screenReader.assets) {
          required.add(
            join(screenReader.id, asset.platformVersion ?? "*", asset.version),
          );
        }
      }
    } catch {
      await deleteAsset(linkPath);
    }
  }

  let screenReaders: string[];

  try {
    screenReaders = await readdir(cachePath);
  } catch {
    return;
  }

  for (const screenReaderId of screenReaders) {
    if (screenReaderId === ".links") {
      continue;
    }

    const screenReaderPath = join(cachePath, screenReaderId);

    let platformVersions: string[];

    try {
      platformVersions = await readdir(screenReaderPath);
    } catch {
      continue;
    }

    for (const platformVersion of platformVersions) {
      const platformPath = join(screenReaderPath, platformVersion);

      let versions: string[];

      try {
        versions = await readdir(platformPath);
      } catch {
        continue;
      }

      for (const version of versions) {
        const relativePath = join(screenReaderId, platformVersion, version);

        if (!required.has(relativePath)) {
          await deleteAsset(join(cachePath, relativePath));
        }
      }
    }
  }
}
