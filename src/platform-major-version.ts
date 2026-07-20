import { release } from "node:os";

export function platformMajorVersion(): number {
  return parseInt(release().split(".", 1)[0], 10);
}
