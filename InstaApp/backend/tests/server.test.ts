import { expect, test, describe, afterAll } from "vitest";

describe("server", () => {
  test("should send server status", async () => {
    const res = await fetch("https://dev.dawidkomeza.pl/api/status");
    const data = await res.json();
    expect(data).toEqual({ status: "ok" });
  });

  test("should send 404 on unknown route", async () => {
    const res = await fetch("https://dev.dawidkomeza.pl/api/unknown");
    expect(res.status).toBe(404);
  });
});

// Path: tests/server.test.ts
