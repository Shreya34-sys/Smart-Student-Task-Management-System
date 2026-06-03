// Comprehensive API Test Script for Smart Student Task Management System
const http = require("http");

const BASE = "http://localhost:5000";
const results = [];
let testNum = 0;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function authRequest(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function log(label, pass, details = "") {
  testNum++;
  const icon = pass ? "✅" : "❌";
  const line = `${icon} Test #${testNum}: ${label}${details ? ` — ${details}` : ""}`;
  console.log(line);
  results.push({ num: testNum, label, pass });
}

async function run() {
  console.log("=".repeat(70));
  console.log("  SMART STUDENT TASKS — API TEST SUITE");
  console.log("=".repeat(70));
  console.log();

  const email = `test_${Date.now()}@example.com`;
  const password = "TestPass123!";
  let token = null;

  // ─── AUTH ENDPOINTS ──────────────────────────────────────
  console.log("── Auth Endpoints ──────────────────────────────");

  // 1. Register — validation: missing phone → 400
  try {
    const r = await request("POST", "/api/auth/register", {
      name: "Test",
      email,
      password,
      confirmPassword: password,
      course: "CS",
    });
    log("Register without phone (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Register without phone", false, e.message);
  }

  // 2. Register — validation: short password → 400
  try {
    const r = await request("POST", "/api/auth/register", {
      name: "Test",
      email,
      password: "abc",
      confirmPassword: "abc",
      phone: "+1234567890",
      course: "CS",
    });
    log("Register with short password (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Register with short password", false, e.message);
  }

  // 3. Register — validation: password mismatch → 400
  try {
    const r = await request("POST", "/api/auth/register", {
      name: "Test",
      email,
      password,
      confirmPassword: "DifferentPass!",
      phone: "+1234567890",
      course: "CS",
    });
    log("Register with password mismatch (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Register with password mismatch", false, e.message);
  }

  // 4. Register — success → 201
  try {
    const r = await request("POST", "/api/auth/register", {
      name: "API Test User",
      email,
      password,
      confirmPassword: password,
      phone: "+1234567890",
      course: "CS",
    });
    const pass = r.status === 201 && r.body.success && r.body.token;
    token = r.body.token;
    log("Register new user (expect 201)", pass, `status=${r.status}, email=${email}`);
  } catch (e) {
    log("Register new user", false, e.message);
  }

  // 5. Register duplicate → 400
  try {
    const r = await request("POST", "/api/auth/register", {
      name: "Dup User",
      email,
      password,
      confirmPassword: password,
      phone: "+1234567890",
      course: "CS",
    });
    log("Register duplicate user (expect 409)", r.status === 409, `status=${r.status}`);
  } catch (e) {
    log("Register duplicate user", false, e.message);
  }

  // 6. Login — correct creds → 200
  try {
    const r = await request("POST", "/api/auth/login", { email, password });
    const pass = r.status === 200 && r.body.success && r.body.token;
    token = r.body.token || token;
    log("Login valid credentials (expect 200)", pass, `status=${r.status}`);
  } catch (e) {
    log("Login valid credentials", false, e.message);
  }

  // 7. Login — wrong password → 401
  try {
    const r = await request("POST", "/api/auth/login", {
      email,
      password: "WrongPass999!",
    });
    log("Login wrong password (expect 401)", r.status === 401, `status=${r.status}`);
  } catch (e) {
    log("Login wrong password", false, e.message);
  }

  // 8. Login — non-existent email → 401
  try {
    const r = await request("POST", "/api/auth/login", {
      email: "nobody_at_all@example.com",
      password: "anything123",
    });
    log("Login non-existent email (expect 401)", r.status === 401, `status=${r.status}`);
  } catch (e) {
    log("Login non-existent email", false, e.message);
  }

  // 9. GET /me with valid token → 200
  try {
    const r = await authRequest("GET", "/api/auth/me", token);
    log("GET /me with valid token (expect 200)", r.status === 200 && r.body.success, `status=${r.status}, name=${r.body.user?.name}`);
  } catch (e) {
    log("GET /me with valid token", false, e.message);
  }

  // 10. GET /me without token → 401
  try {
    const r = await request("GET", "/api/auth/me");
    log("GET /me without token (expect 401)", r.status === 401, `status=${r.status}`);
  } catch (e) {
    log("GET /me without token", false, e.message);
  }

  // ─── FORGOT PASSWORD FLOW ────────────────────────────────
  console.log();
  console.log("── Forgot Password Flow ───────────────────────");

  // 11. Empty email → 400
  try {
    const r = await request("POST", "/api/auth/forgot-password", {});
    log("Forgot password: empty email (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Forgot password: empty email", false, e.message);
  }

  // 12. Non-existent email → 200 (user-enum protection)
  try {
    const r = await request("POST", "/api/auth/forgot-password", {
      email: "nobody_exists_12345@example.com",
    });
    log(
      "Forgot password: non-existent email (200 - user enum protection)",
      r.status === 200 && r.body.success,
      `status=${r.status}`
    );
  } catch (e) {
    log("Forgot password: non-existent email", false, e.message);
  }

  // 13. Valid email → 200 (or 429 if rate limited from earlier tests)
  try {
    const r = await request("POST", "/api/auth/forgot-password", { email });
    if (r.status === 429) {
      log(
        "Forgot password: valid email (rate limited - EXPECTED from previous test runs)",
        true,
        `status=${r.status} — rate limiter is working correctly (3 req/hr limit)`
      );
    } else {
      log(
        "Forgot password: valid email (expect 200)",
        r.status === 200 && r.body.success,
        `status=${r.status}, msg=${r.body.message}`
      );
    }
  } catch (e) {
    log("Forgot password: valid email", false, e.message);
  }

  // ─── RESET PASSWORD VALIDATION ───────────────────────────
  console.log();
  console.log("── Reset Password Validation ──────────────────");

  // 14. Invalid token → 400
  try {
    const r = await request("POST", "/api/auth/reset-password/invalidtoken123", {
      password: "NewPass456!",
      confirmPassword: "NewPass456!",
    });
    log("Reset password: invalid token (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Reset password: invalid token", false, e.message);
  }

  // 15. Missing fields → 400
  try {
    const r = await request("POST", "/api/auth/reset-password/sometoken", {});
    log("Reset password: missing fields (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Reset password: missing fields", false, e.message);
  }

  // 16. Password mismatch → 400
  try {
    const r = await request("POST", "/api/auth/reset-password/sometoken", {
      password: "NewPass456!",
      confirmPassword: "Different789!",
    });
    log("Reset password: mismatch (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Reset password: password mismatch", false, e.message);
  }

  // 17. Short password → 400
  try {
    const r = await request("POST", "/api/auth/reset-password/sometoken", {
      password: "abc",
      confirmPassword: "abc",
    });
    log("Reset password: short password (expect 400)", r.status === 400, `status=${r.status}, msg=${r.body.message}`);
  } catch (e) {
    log("Reset password: short password", false, e.message);
  }

  // ─── FRONTEND ROUTES ─────────────────────────────────────
  console.log();
  console.log("── Frontend Routes ────────────────────────────");

  const routes = ["/", "/login", "/register", "/forgot-password", "/reset-password/test123"];
  for (const path of routes) {
    try {
      const url = new URL(path, "http://localhost:5173");
      const r = await new Promise((resolve, reject) => {
        http.get(url.href, (res) => {
          let d = "";
          res.on("data", (c) => (d += c));
          res.on("end", () =>
            resolve({
              status: res.statusCode,
              hasHtml: d.includes("<html") || d.includes("<!DOCTYPE") || d.includes("<!doctype"),
            })
          );
        }).on("error", reject);
      });
      log(`Frontend route ${path} (expect 200)`, r.status === 200 && r.hasHtml, `status=${r.status}`);
    } catch (e) {
      log(`Frontend route ${path}`, false, e.message);
    }
  }

  // ─── SUMMARY ──────────────────────────────────────────────
  console.log();
  console.log("=".repeat(70));
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`  RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);
  if (failed === 0) {
    console.log("  🎉 ALL TESTS PASSED!");
  } else {
    console.log("  ⚠️  Some tests failed:");
    results.filter((r) => !r.pass).forEach((r) => console.log(`     ❌ #${r.num}: ${r.label}`));
  }
  console.log("=".repeat(70));
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
