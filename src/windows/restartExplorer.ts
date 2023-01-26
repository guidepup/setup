import { ERR_WINDOWS_FAILED_TO_RESTART_EXPLORER } from "../errors";
import { runVbsScript } from "./runVbsScript";

export async function restartExplorer() {
  const script = `
SET objWMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!" & chr(92) & chr(92) & "." & chr(92) & "root" & chr(92) & "cimv2")
SET colProcesses = objWMIService.ExecQuery("Select * from Win32_Process where Name = 'explorer.exe'")

FOR EACH objProcess in colProcesses
  objProcess.Terminate(1)
NEXT

SET objWMIService = Nothing
SET colProcesses = Nothing

SET WshShell = CreateObject("WScript.Shell")
WshShell.Run "explorer.exe"
SET WshShell = Nothing
`;

  try {
    await runVbsScript(script);
  } catch (e) {
    throw new Error(`${ERR_WINDOWS_FAILED_TO_RESTART_EXPLORER}\n${e.message}`);
  }
}
