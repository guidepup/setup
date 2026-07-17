import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
  ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID,
  ERR_INSTALL_GUIDEPUP_MANIFEST_UNSUPPORTED_SCHEMA,
  ERR_INSTALL_GUIDEPUP_PACKAGE_NOT_FOUND,
} from "../../errors";
import { Manifest } from "./types";
import { validateManifest } from "./validate-manifest";

const SUPPORTED_SCHEMA_VERSIONS = [1];

function getLocalManifestPath() {
  let packageJsonPath: string;

  try {
    packageJsonPath = require.resolve("@guidepup/guidepup/package.json", {
      paths: [process.cwd()],
    });
  } catch (cause) {
    throw new Error(ERR_INSTALL_GUIDEPUP_PACKAGE_NOT_FOUND, { cause });
  }

  return join(dirname(packageJsonPath), "manifest.json");
}

export function resolveManifest(targetManifestPath?: string): {
  manifestPath: string;
  manifest: Manifest;
} {
  const manifestPath = targetManifestPath ?? getLocalManifestPath();

  if (!existsSync(manifestPath)) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  let manifest: unknown;

  try {
    const rawManifest = readFileSync(manifestPath, "utf8");

    manifest = JSON.parse(rawManifest);
  } catch (cause) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID, { cause });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!SUPPORTED_SCHEMA_VERSIONS.includes((manifest as any)?.version)) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_UNSUPPORTED_SCHEMA);
  }

  if (!validateManifest(manifest)) {
    throw new Error(ERR_INSTALL_GUIDEPUP_MANIFEST_INVALID);
  }

  return { manifestPath, manifest };
}
