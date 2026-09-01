import { getLinuxDistribution } from "./getLinuxDistribution";
import { installPackages } from "./installPackages";
import { validateLinuxDistribution } from "./validateLinuxDistribution";

export async function setup(): Promise<void> {
  const distribution = await getLinuxDistribution();

  validateLinuxDistribution(distribution);

  await installPackages();
}
