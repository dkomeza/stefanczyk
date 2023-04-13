import { expect, test, describe } from "vitest";

import "../build/server";

describe("server", () => {
  test("should send server status", async () => {
    const res = await fetch("https://dev.dawidkomeza.pl/api/status");
    const data = await res.json();
    expect(data).toEqual({ status: "ok" });
  });
});

// Path: tests/server.test.ts
