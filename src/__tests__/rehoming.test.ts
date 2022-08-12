import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for rehoming a digipet.
 *
 * It is intended to test two behaviours:
 *  1. rehoming a digipet leads to increasing happiness
 *  2. rehoming a digipet leads to decreasing nutrition
 *
 * These have been mostly separated out into two different E2E tests to try to make the tests more robust - it is possible that we might want a change in one but not the other, and it would be annoying to have to fix tests on increasing happiness when there's a change in intended nutrition behaviour.
 */

describe("When a user rehomes a digipet, the user will no longer have a digitpet to care for", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 75,
      nutrition: 80,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
  });

  test("GET /digipet/rehome sets digitpet to be undefined", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.digipet).toBe(undefined);
  });
});
