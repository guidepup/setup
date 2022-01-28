import type { Credentials } from "./Credentials";
import { ERR_MACOS_UNABLE_TO_UPDATE_UI_PREFERENCES } from "../errors";
import { runAppleScript } from "./runAppleScript";

export async function setVoiceOverEnabledViaUi(credentials: Credentials) {
  const script = `
-- Startup delay to reduce chance of "Application isn't running (-600)" errors
delay 1

set timeoutSeconds to 5.000000

-- Open VoiceOver Utility
tell application "VoiceOver Utility" to activate

tell application "System Events"
	set endDate to (current date) + timeoutSeconds
	repeat until (exists window 1 of application process "VoiceOver Utility")
		if ((current date) > endDate) then
			exit repeat
		end if
		
		delay 0.1
	end repeat

	tell application process "VoiceOver Utility"
		-- Enable AppleScript control
		set endDate to (current date) + timeoutSeconds
		repeat until (exists checkbox 2 of splitter group 1 of window 1)
			if ((current date) > endDate) then
				exit repeat
			end if

			delay 0.1
		end repeat

		-- Check if AppleScript control already enabled
		set appleScriptControlCheckbox to checkbox 2 of splitter group 1 of window 1
		set appleScriptControlCheckboxStatus to value of appleScriptControlCheckbox as boolean

		tell appleScriptControlCheckbox
			if appleScriptControlCheckboxStatus is false then
				click appleScriptControlCheckbox
			else
				-- Exit early
				tell application "VoiceOver Utility" to quit
				return
			end if
		end tell
	end tell

	-- Wait for SecurityAgent dialog to open
	set endDate to (current date) + timeoutSeconds
	repeat until (exists window 1 of application process "SecurityAgent")
		if ((current date) > endDate) then
			exit repeat
		end if

		delay 0.1
	end repeat

	-- Enter credentials
	key code 48 using shift down
	delay 0.1
	keystroke "${credentials.username}"
	delay 0.1
	key code 48
	delay 0.1
	keystroke "${credentials.password}" & return

	-- Wait for SecurityAgent dialog to close
	set endDate to (current date) + timeoutSeconds
	repeat while (exists window 1 of application process "SecurityAgent")
		if ((current date) > endDate) then
			exit repeat
		end if

		delay 0.1
	end repeat

	tell application process "VoiceOver Utility"
		-- Wait for checkbox to be checked
		set endDate to (current date) + timeoutSeconds
		repeat while ((value of (checkbox 2 of splitter group 1 of window 1) as boolean) is false)
			if ((current date) > endDate) then
				exit repeat
			end if

			delay 0.1
		end repeat
	end tell
end tell

tell application "VoiceOver Utility" to quit
`;

  try {
    await runAppleScript(script);
  } catch (_) {
    throw new Error(ERR_MACOS_UNABLE_TO_UPDATE_UI_PREFERENCES);
  }
}
