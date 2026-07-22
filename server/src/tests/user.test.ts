import { describe, test, expect } from "bun:test";

const BASE = "http://localhost:3000/api/v1/users";
const uid = Date.now();
const email = (name: string) => `${name}+${uid}@example.com`;

type JsonBody = Record<string, unknown>;

const getToken = (body: JsonBody) =>
  (body.accessToken as string | undefined) ?? (body.token as string | undefined);

async function post(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return {
    status: res.status,
    body: (await res.json()) as JsonBody,
    headers: res.headers,
  };
}

async function get(path: string, token?: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return {
    status: res.status,
    body: (await res.json()) as JsonBody,
  };
}

function extractCookie(headers: Headers, name: string): string | undefined {
  const setCookie = headers.get("set-cookie");
  if (!setCookie) return undefined;
  const match = setCookie.match(new RegExp(`${name}=([^;]+)`));
  return match ? `${name}=${match[1]}` : undefined;
}

async function postWithCookie(path: string, cookie?: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: cookie ? { Cookie: cookie } : {},
  });
  return {
    status: res.status,
    body: (await res.json()) as JsonBody,
    headers: res.headers,
  };
}

async function loginAndGetCookie(name: string) {
  const userEmail = email(name);
  await post("/register", { email: userEmail, password: "pass123" });

  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: userEmail, password: "pass123" }),
  });

  const cookie = extractCookie(res.headers, "refreshToken");
  const body = (await res.json()) as JsonBody;
  return { cookie, token: getToken(body) };
}

describe("POST /register", () => {
  test("registers a new user", async () => {
    const { status, body } = await post("/register", {
      email: email("alice"),
      password: "pass123",
    });
    expect(status).toBe(201);
    expect(body.success).toBe(true);
  });

  test("rejects duplicate email", async () => {
    const dup = email("duplicate");
    await post("/register", { email: dup, password: "pass123" });

    const { status, body } = await post("/register", { email: dup, password: "pass123" });
    expect(status).toBe(409);
    expect(body.success).toBe(false);
  });

  test("rejects invalid email", async () => {
    const { status, body } = await post("/register", { email: "notanemail", password: "pass123" });
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });

  test("rejects short password", async () => {
    const { status, body } = await post("/register", { email: email("short"), password: "abc" });
    expect(status).toBe(400);
    expect(body.success).toBe(false);
  });
});

describe("POST /login", () => {
  test("logs in with correct credentials", async () => {
    const userEmail = email("bob");
    await post("/register", { email: userEmail, password: "pass123" });

    const { status, body } = await post("/login", { email: userEmail, password: "pass123" });
    expect(status).toBe(200);
    expect(getToken(body)).toBeDefined();
    expect(body.success).toBe(true);
  });

  test("rejects wrong password", async () => {
    const userEmail = email("carol");
    await post("/register", { email: userEmail, password: "pass123" });

    const { status, body } = await post("/login", { email: userEmail, password: "wrongpass" });
    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  test("rejects unknown email", async () => {
    const { status, body } = await post("/login", {
      email: email("ghost"),
      password: "pass123",
    });
    expect(status).toBe(404);
    expect(body.success).toBe(false);
  });
});

describe("GET /me", () => {
  test("returns user for valid token", async () => {
    const userEmail = email("dave");
    await post("/register", { email: userEmail, password: "pass123" });
    const { body: loginBody } = await post("/login", { email: userEmail, password: "pass123" });

    const { status, body } = await get("/me", getToken(loginBody));
    expect(status).toBe(200);
    expect(body.user).toBeDefined();
    expect(body.success).toBe(true);
  });

  test("rejects request with no token", async () => {
    const { status } = await get("/me");
    expect(status).toBe(401);
  });

  test("rejects invalid token", async () => {
    const { status } = await get("/me", "invalidtoken");
    expect(status).toBe(401);
  });
});

describe("POST /refresh", () => {
  test("returns new access token and rotates refresh cookie", async () => {
    const { cookie } = await loginAndGetCookie("refresh1");
    const { status, body, headers } = await postWithCookie("/refresh", cookie);

    expect(status).toBe(200);
    expect(getToken(body)).toBeDefined();
    expect(body.success).toBe(true);
    expect(extractCookie(headers, "refreshToken")).toBeDefined();
  });

  test("rejects with no cookie", async () => {
    const { status, body } = await postWithCookie("/refresh");
    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  test("rejects with invalid cookie value", async () => {
    const { status, body } = await postWithCookie("/refresh", "refreshToken=badtoken");
    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });

  test("new access token from refresh works on /me", async () => {
    const { cookie } = await loginAndGetCookie("refresh2");
    const { body: refreshBody } = await postWithCookie("/refresh", cookie);

    const { status } = await get("/me", getToken(refreshBody));
    expect(status).toBe(200);
  });
});

describe("POST /logout", () => {
  test("clears the refresh cookie", async () => {
    const { cookie } = await loginAndGetCookie("logout1");

    const res = await fetch(`${BASE}/logout`, {
      method: "POST",
      headers: cookie ? { Cookie: cookie } : {},
    });

    const setCookie = res.headers.get("set-cookie") ?? "";
    expect(res.status).toBe(200);
    expect(setCookie).toMatch(/Max-Age=0|expires=.*1970/i);
  });

  test("refresh without cookie after logout returns 401", async () => {
    const { cookie } = await loginAndGetCookie("logout2");

    await fetch(`${BASE}/logout`, {
      method: "POST",
      headers: cookie ? { Cookie: cookie } : {},
    });

    const { status, body } = await postWithCookie("/refresh");
    expect(status).toBe(401);
    expect(body.success).toBe(false);
  });
});
