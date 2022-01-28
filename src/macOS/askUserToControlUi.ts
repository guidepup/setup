import type { Credentials } from "./Credentials";
import { prompt } from "inquirer";
import {
  ERR_MACOS_UI_PROMPT_FAILURE,
  ERR_MACOS_UI_CONTROL_NOT_CONSENTED,
} from "../errors";

const consent = [
  {
    name: "confirm",
    type: "confirm",
    message: "Consent to temporary UI control?",
  },
];

const credentials = [
  {
    name: "username",
    type: "input",
    message: "Admin username",
  },
  {
    name: "password",
    type: "password",
    message: "Admin password",
  },
];

export async function askUserToControlUi(): Promise<Credentials> {
  let consentStatus;

  try {
    consentStatus = await prompt(consent);
  } catch (_) {
    throw new Error(ERR_MACOS_UI_PROMPT_FAILURE)
  }

  if (!consentStatus.confirm) {
    throw new Error(ERR_MACOS_UI_CONTROL_NOT_CONSENTED);
  }

  try {
    return await prompt(credentials);
  } catch (_) {
    throw new Error(ERR_MACOS_UI_PROMPT_FAILURE)
  }
}
