import { promisified as regedit } from "regedit";

const SUB_KEY_GUIDEPUP_NVDA = "HKCU\\Software\\Guidepup\\Nvda";

export async function setup(): Promise<void> {
  // Check if have Guidepup's Portable NVDA installed
  const listResult = await regedit.list([SUB_KEY_GUIDEPUP_NVDA]);
  console.log(listResult);

  // Fetch Guidepup's Portable NVDA installed

  // Create / update registry with Guidepup's Portable NVDA installation location
}
