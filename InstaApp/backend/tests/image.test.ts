import { expect, test, describe, afterAll } from "vitest";

describe("image operations", () => {
    test("should upload image", async () => {
      const formData = new FormData();
      formData.append("image", new Blob([""], { type: "image/png" }));
      formData.append("name", "test");
      const res = await fetch("https://dev.dawidkomeza.pl/api/images", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await res.json();
      expect(data).toEqual({ status: "ok" });
    });
});

// Path: tests/server.test.ts
