import { enabledDefaults } from "./enabledDefaults";
import { enabledDbFile } from "./enabledDbFile";

export async function isAppleScriptControlEnabled(): Promise<boolean> {
  const results = await Promise.all([enabledDefaults(), enabledDbFile()]);

  return results.every((value) => value);
}
