import { exec } from "child_process";
import * as os from "os";
import { ERR_MACOS_FAILED_TO_ENABLE_DO_NOT_DISTURB } from "../errors";
import { runAppleScript } from "./runAppleScript";
import { promisify } from "util";

// REF: https://github.com/sindresorhus/do-not-disturb/issues/9
const enableFocusModeShellscript = `
defaults write com.apple.ncprefs.plist dnd_prefs -data 62706C6973743030D60102030405060708080A08085B646E644D6972726F7265645F100F646E64446973706C6179536C6565705F101E72657065617465644661636574696D6543616C6C73427265616B73444E445875736572507265665E646E64446973706C61794C6F636B5F10136661636574696D6543616E427265616B444E44090808D30B0C0D070F1057656E61626C6564546461746556726561736F6E093341C2B41C4FC9D3891001080808152133545D6C828384858C9499A0A1AAACAD00000000000001010000000000000013000000000000000000000000000000AE && 
killall usernoted && killall ControlCenter
`;

const enableFocusModeAppleScript = `
set timeoutSeconds to 5.0

set openSystemPreferences to "tell application \\"System Preferences\\" to activate"

set clickNotificationAndFocusButton to "click UI Element 9 of scroll area 1 of window \\"System Preferences\\" of application process \\"System Preferences\\""

set clickFocusTab to "click radio button \\"Focus\\" of tab group 1 of window \\"Notifications & Focus\\" of application process \\"System Preferences\\""

set enableDoNotDisturb to "
set doNotDisturbToggle to checkbox 1 of group 1 of tab group 1 of window \\"Notifications & Focus\\" of application process \\"System Preferences\\"

tell doNotDisturbToggle
  if not (its value as boolean) then click doNotDisturbToggle
end tell"

set closeSystemPreferences to "tell application \\"System Preferences\\" to quit"

my withTimeout(openSystemPreferences, timeoutSeconds)
my withTimeout(clickNotificationAndFocusButton, timeoutSeconds)
my withTimeout(clickFocusTab, timeoutSeconds)
my withTimeout(enableDoNotDisturb, timeoutSeconds)
my withTimeout(closeSystemPreferences, timeoutSeconds)
`;

export async function enableDoNotDisturb() {
  const platformMajor = Number(os.version().split("Version ")[1].split(".")[0]);

  try {
    if (platformMajor <= 20) {
      await promisify(exec)(enableFocusModeShellscript);
    } else {
      // From MacOS 12 Monterey (Darwin 21) there is no known way to enable DND via system defaults
      await runAppleScript(enableFocusModeAppleScript);
    }
  } catch {
    throw new Error(ERR_MACOS_FAILED_TO_ENABLE_DO_NOT_DISTURB);
  }
}
