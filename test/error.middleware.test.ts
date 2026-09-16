import { describe, expect, it, vi } from "vitest";
import errorMiddlWare from "../src/middlewares/error.middleware";

//test case for error middleware 
describe("Global Error Middleware", () => {
  it("should return 500 with internal server error", () => {
    const err = new Error("Test Error");

    const req = {} as any;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any;

    const next = vi.fn();

    errorMiddlWare(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});