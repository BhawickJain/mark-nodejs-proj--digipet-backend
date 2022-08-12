import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for ignoreing a digipet.
 *
 * It is intended to test two behaviours:
 *  1. ignoring a digipet leads to increasing happiness
 *  2. ignoring a digipet leads to decreasing nutrition
 *
 * These have been mostly separated out into two different E2E tests to try to make the tests more robust - it is possible that we might want a change in one but not the other, and it would be annoying to have to fix tests on increasing happiness when there's a change in intended nutrition behaviour.
 */

describe("When a user ignores a digipet repeatedly, its happiness decreases by 5 each time until it eventually holds out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 15,
      nutrition: 80,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 15);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows increase happiness", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 10);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 5);
  });

  test("3rd GET /digipet/ignore shows happiness hitting a ceiling of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });

  test("4th GET /digipet/ignore shows no further increase in happiness", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("happiness", 0);
  });
});

describe("When a user ignores a digipet repeatedly, its nutrition decreases by 5 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 40,
      nutrition: 15,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 15);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows decreased nutrition for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 10);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 5);
  });

  test("3rd GET /digipet/ignore shows nutrition hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
  });

  test("4th GET /digipet/ignore shows no further decrease in nutrition", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
  });
});

describe("When a user ignores a digipet repeatedly, its discipline decreases by 5 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 40,
      nutrition: 50,
      discipline: 15,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 15);
  });

  test("1st GET /digipet/ignore informs them about the ignore and shows decreased discipline for digipet", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 10);
  });

  test("2nd GET /digipet/ignore shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 5);
  });

  test("3rd GET /digipet/ignore shows discipline hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });

  test("4th GET /digipet/ignore shows no further decrease in discipline", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
  });
});

describe("When a digipet happiness in the bin, it is still possible to ignore it and decrease its discipline and nutrition", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 0,
      nutrition: 15,
      discipline: 15,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("discipline", 15);
    expect(response.body.digipet).toHaveProperty("nutrition", 15);
  });

  test("GET /digipet/ignore shows that happiness remains at 0 but discipline and nutrition has decreased", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 10);
    expect(response.body.digipet).toHaveProperty("nutrition", 10);
  });
  test("GET /digipet/ignore shows that happiness remains at 0 but discipline and nutrition has decreased", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 5);
    expect(response.body.digipet).toHaveProperty("nutrition", 5);
  });

  test("GET /digipet/ignore shows that happiness remains at 0 but discipline and nutrition has decreased", async () => {
    const response = await supertest(app).get("/digipet/ignore");
    expect(response.body.digipet).toHaveProperty("discipline", 0);
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
  });
});
