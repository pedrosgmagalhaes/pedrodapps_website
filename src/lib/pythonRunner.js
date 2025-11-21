// Lightweight client to manage the Pyodide worker lifecycle and run code

let worker = null;
let ready = false;
const waiters = [];

function ensureWorker() {
  if (worker) return;
  // Use classic worker since we importScripts inside the worker
  worker = new Worker(new URL("../workers/pythonWorker.js", import.meta.url), { type: "classic" });
  worker.onmessage = (e) => {
    const msg = e?.data || {};
    if (msg.type === "ready") {
      ready = true;
      while (waiters.length) {
        const resolve = waiters.shift();
        try {
          resolve();
        } catch {
          void 0;
        }
      }
      return;
    }
    if (msg.type === "error") {
      // propagate init errors to waiters
      while (waiters.length) {
        const reject = waiters.shift();
        try {
          reject(new Error(msg.error || "Worker init error"));
        } catch {
          void 0;
        }
      }
      return;
    }
  };
  worker.postMessage({ type: "init" });
}

export function initPy() {
  ensureWorker();
  if (ready) return Promise.resolve();
  return new Promise((resolve, reject) => {
    waiters.push(resolve);
    // optional timeout to avoid hanging
    setTimeout(() => {
      if (!ready) {
        try {
          reject(new Error("Pyodide init timeout"));
        } catch {
          void 0;
        }
      }
    }, 8000);
  });
}

export async function runPython(code, timeoutMs = 5000) {
  ensureWorker();
  if (!ready) await initPy();
  return new Promise((resolve) => {
    let done = false;
    const onMsg = (e) => {
      const msg = e?.data || {};
      if (msg.type === "result") {
        done = true;
        worker.removeEventListener("message", onMsg);
        if (msg.ok) {
          resolve({ ok: true, stdout: String(msg.stdout || "") });
        } else {
          resolve({ ok: false, error: String(msg.error || "Unknown error") });
        }
      }
    };
    worker.addEventListener("message", onMsg);
    // Send run request
    worker.postMessage({ type: "run", code, timeout_ms: timeoutMs });
    // Soft timeout; cannot truly abort WASM, but notify caller
    setTimeout(() => {
      if (!done) {
        worker.removeEventListener("message", onMsg);
        resolve({ ok: false, error: "Execution timeout" });
      }
    }, timeoutMs);
  });
}

export async function installPackages(packages = [], timeoutMs = 15000) {
  ensureWorker();
  if (!ready) await initPy();
  return new Promise((resolve) => {
    let done = false;
    const onMsg = (e) => {
      const msg = e?.data || {};
      if (msg.type === "install_result") {
        done = true;
        worker.removeEventListener("message", onMsg);
        if (msg.ok) {
          resolve({ ok: true, message: String(msg.message || "") });
        } else {
          resolve({ ok: false, error: String(msg.error || "Unknown error") });
        }
      }
    };
    worker.addEventListener("message", onMsg);
    worker.postMessage({ type: "install", packages });
    setTimeout(() => {
      if (!done) {
        worker.removeEventListener("message", onMsg);
        resolve({ ok: false, error: "Install timeout" });
      }
    }, timeoutMs);
  });
}
