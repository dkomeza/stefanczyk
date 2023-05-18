import { expect, test, describe, afterAll } from "vitest";
import supertest from "supertest";

describe("image operations", () => {
  // test("should upload image", async () => {
  //   const res = await supertest("https://dev.dawidkomeza.pl/")
  //     .post  api/images")
  //     .field("album", "test")
  //     .attach("image", "./tests/misc/mount-fuji.png");
  //   expect(res.body).toStrictEqual({ status: "ok" });
  // }, 10000);

  test("should delete all images", async () => {
    const res = await supertest("https://dev.dawidkomeza.pl/")
      .delete("/api/images")
      .send();
    expect(res.body).toStrictEqual({ status: "ok" });
  });
});

// Path: tests/server.test.ts
