import { exec } from "child_process";
import { promisify } from "util";
import { ERR_MACOS_FAILED_TO_ENABLE_DO_NOT_DISTURB } from "../errors";
import { runAppleScript } from "./runAppleScript";
import { retryOnError } from "./retryOnError";
import { getPlatformVersionMajor } from "./getPlatformVersionMajor";

// REF: https://github.com/sindresorhus/do-not-disturb/issues/9
const enableFocusModeShellscript = `defaults write com.apple.ncprefs.plist dnd_prefs -data 62706C6973743030D60102030405060708080A08085B646E644D6972726F7265645F100F646E64446973706C6179536C6565705F101E72657065617465644661636574696D6543616C6C73427265616B73444E445875736572507265665E646E64446973706C61794C6F636B5F10136661636574696D6543616E427265616B444E44090808D30B0C0D070F1057656E61626C6564546461746556726561736F6E093341C2B41C4FC9D3891001080808152133545D6C828384858C9499A0A1AAACAD00000000000001010000000000000013000000000000000000000000000000AE && killall usernoted && killall ControlCenter`;

const getLocale = `defaults read -g AppleLocale`;

const enableFocusModeAppleScript = `
-- Startup delay to reduce chance of "Application isn't running (-600)" errors
delay 1

set timeoutSeconds to 30.0

set command to "
  do shell script \\"open 'x-apple.systempreferences:com.apple.preference.notifications?focus'\\"

  delay 5.0
  
  tell application \\"System Preferences\\" to activate

  delay 1.0

  set doNotDisturbToggle to checkbox 1 of group 1 of tab group 1 of window \\"Notifications & Focus\\" of application process \\"System Preferences\\"

  tell doNotDisturbToggle
    if not (its value as boolean) then click doNotDisturbToggle
  end tell

  tell application \\"System Preferences\\" to quit
"

my withTimeout(command, timeoutSeconds)
`;

const enableFocusModeVenturaAppleScript = (locale: string) => {
  // TODO: attempt to rewrite scripts without any locale specific instructions
  // so this setup can be used regardless of user locale preferences.
  const center = locale.trim() === "en_GB" ? "Centre" : "Center";

  return `-- Startup delay to reduce chance of "Application isn't running (-600)" errors
delay 1

set timeoutSeconds to 30.0

set command to "
  -- Open Control Center drop down
  tell application \\"System Events\\"
    key down 63
    key down \\"c\\"
    delay 0.5
    key up \\"c\\"
    key up 63
  end tell

  tell application \\"System Events\\"
    tell its application process \\"Control ${center}\\"
      tell its window 1
        -- Check if Do Not Disturb already enabled
        set doNotDisturbCheckbox to checkbox 2 of group 1
        set doNotDisturbCheckboxStatus to value of doNotDisturbCheckbox as boolean

        tell doNotDisturbCheckbox
          if doNotDisturbCheckboxStatus is false then
            perform action 1 of doNotDisturbCheckbox
          end if
        end tell
      end tell
    end tell
  end tell

  -- Close Control Center drop down
  tell application \\"System Events\\"
    key down 63
    key down \\"c\\"
    delay 0.5
    key up \\"c\\"
    key up 63
  end tell
"

my withTimeout(command, timeoutSeconds)
`;
};

export async function enableDoNotDisturb() {
  const platformMajor = getPlatformVersionMajor();

  try {
    if (platformMajor <= 20) {
      await promisify(exec)(enableFocusModeShellscript);

      return;
    } else if (platformMajor === 21) {
      // From MacOS 12 Monterey (Darwin 21) there is no known way to enable DND via system defaults
      await retryOnError(() => runAppleScript(enableFocusModeAppleScript));

      return;
    }

    // From MacOS 13 Ventura (Darwin 22) there is no known way to enable DND via system settings
    const { stdout: locale } = await promisify(exec)(getLocale);

    await retryOnError(() =>
      runAppleScript(enableFocusModeVenturaAppleScript(locale))
    );
  } catch (e) {
    throw new Error(
      `${ERR_MACOS_FAILED_TO_ENABLE_DO_NOT_DISTURB}\n\n${e.message}`
    );
  }
}
