import { execFile } from "child_process";

export const DEFAULT_TIMEOUT = 10000;
export const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

export async function runAppleScript<T = string | void>(
  script: string,
  { timeout = DEFAULT_TIMEOUT } = { timeout: DEFAULT_TIMEOUT }
): Promise<T> {
  const scriptWithTimeout = `
with timeout of ${timeout} seconds
  ${script}
end timeout

on withTimeout(uiScript, timeoutSeconds)
	set endDate to (current date) + timeoutSeconds
	repeat
		try
			run script "tell application \\"System Events\\"
" & uiScript & "
end tell"
			exit repeat
		on error errorMessage
			if ((current date) > endDate) then
				error errorMessage & "\n\nFor script: " & uiScript
			end if
		end try
		
		delay 0.2
	end repeat
end doWithTimeout
`;

  return (await new Promise<string | void>((resolve, reject) => {
    const child = execFile(
      "/usr/bin/osascript",
      [],
      {
        maxBuffer: DEFAULT_MAX_BUFFER,
      },
      (e, stdout) => {
        if (e) {
          return reject(e);
        }

        if (!stdout) {
          return resolve();
        } else {
          return resolve(stdout.trim());
        }
      }
    );

    child.stdin.write(scriptWithTimeout);
    child.stdin.end();
  })) as unknown as T;
}
