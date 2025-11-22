/*
  Pyodide worker: loads Python runtime (WebAssembly) and executes code safely.
  - Loads from CDN: https://cdn.jsdelivr.net/pyodide/v0.26.1/full/
  - Exposes messages:
    { type: 'init' }
    { type: 'run', code: string, timeout_ms?: number }
    { type: 'install', packages: string[] }
  - Returns:
    { type: 'ready' }
    { type: 'result', ok: true, stdout: string }
    { type: 'result', ok: false, error: string }
    { type: 'install_result', ok: boolean, message?: string, error?: string }
*/

/* eslint-disable */
self.importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");

let pyodide = null;

async function init() {
  if (pyodide) return;
  try {
    pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/" });
    // Define a helper to execute arbitrary code and capture stdout/stderr
    await pyodide.runPython(`
import io, sys, traceback

def __run_code(src: str) -> str:
    sio = io.StringIO()
    oldout, olderr = sys.stdout, sys.stderr
    sys.stdout, sys.stderr = sio, sio
    ns = {}
    try:
        exec(src, ns, ns)
    except Exception:
        traceback.print_exc()
    finally:
        sys.stdout, sys.stderr = oldout, olderr
    return sio.getvalue()
`);
    self.postMessage({ type: "ready" });
  } catch (err) {
    self.postMessage({ type: "error", error: String(err && err.message ? err.message : err) });
  }
}

self.onmessage = async (e) => {
  const data = e?.data || {};
  const { type, code, timeout_ms, packages } = data;
  if (type === "init") {
    await init();
    return;
  }
  if (type === "run") {
    try {
      await init();
      // Use runPythonAsync for non-blocking execution
      const result = await pyodide.runPythonAsync(`__run_code(${JSON.stringify(code || "")})`);
      self.postMessage({ type: "result", ok: true, stdout: String(result || "") });
    } catch (err) {
      self.postMessage({
        type: "result",
        ok: false,
        error: String(err && err.message ? err.message : err),
      });
    }
    return;
  }
  if (type === "install") {
    try {
      await init();
      // Ensure micropip is available
      await pyodide.loadPackage("micropip");
      const pkgs = Array.isArray(packages) ? packages : [];
      for (let i = 0; i < pkgs.length; i++) {
        const pkg = String(pkgs[i] || "").trim();
        if (!pkg) continue;
        // Install one by one; this supports versions like "package==1.2.3"
        await pyodide.runPythonAsync(
          `import micropip\nimport asyncio\nasync def __do_install():\n    await micropip.install('${pkg}')\nasyncio.run(__do_install())`
        );
      }
      self.postMessage({
        type: "install_result",
        ok: true,
        message: `Installed: ${pkgs.join(", ")}`,
      });
    } catch (err) {
      self.postMessage({
        type: "install_result",
        ok: false,
        error: String(err && err.message ? err.message : err),
      });
    }
    return;
  }
};