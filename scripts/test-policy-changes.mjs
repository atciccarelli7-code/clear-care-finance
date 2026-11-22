import { spawn } from "node:child_process";
import { preview } from "vite";

// Own the server directly: Windows npm process trees can stall Playwright teardown.
// An ephemeral port also prevents testing a different worktree's preview by mistake.
const server = await preview({ preview: { host: "127.0.0.1", port: 0, strictPort: true } });
const address = server.httpServer.address();
if (!address || typeof address === "string") throw new Error("Policy preview did not bind a TCP port.");
let exitCode = 1;
try {
  exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", "--config=playwright.policy.config.ts"], {
      stdio: "inherit",
      env: { ...process.env, CAF_POLICY_PREVIEW_URL: `http://127.0.0.1:${address.port}` },
    });
    child.once("error", reject);
    child.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  server.httpServer.closeAllConnections();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
process.exit(exitCode);
