import { describe, it, expect } from "vitest"
import { ApiError } from "../src/utils/ApiError.js"
import { ApiResponse } from "../src/utils/ApiResponse.js"
import { asyncHandler } from "../src/utils/asyncHandler.js"

// ── ApiError Tests

describe("ApiError", () => {

    it("should create an error with status code and message", () => {
        const error = new ApiError(404, "Video not found")

        expect(error.statusCode).toBe(404)
        expect(error.message).toBe("Video not found")
        expect(error.success).toBe(false)
        expect(error.data).toBeNull()
    })

    it("should default message to 'Something went wrong'", () => {
        const error = new ApiError(500)

        expect(error.message).toBe("Something went wrong")
    })

    it("should be an instance of Error (so try/catch works)", () => {
        const error = new ApiError(401, "Unauthorized")

        expect(error).toBeInstanceOf(Error)
    })

    it("should include custom errors array when provided", () => {
        const error = new ApiError(400, "Validation failed", [
            "Email is required",
            "Password too short"
        ])

        expect(error.errors).toHaveLength(2)
        expect(error.errors[0]).toBe("Email is required")
    })
})

// ── ApiResponse Tests 

describe("ApiResponse", () => {

    it("should set success=true for status codes below 400", () => {
        const response = new ApiResponse(200, { id: 1 }, "OK")

        expect(response.success).toBe(true)
        expect(response.statusCode).toBe(200)
        expect(response.data).toEqual({ id: 1 })
        expect(response.message).toBe("OK")
    })

    it("should set success=false for status codes 400+", () => {
        const response = new ApiResponse(404, null, "Not found")

        expect(response.success).toBe(false)
    })

    it("should set success=true for 201 Created", () => {
        const response = new ApiResponse(201, { title: "My Video" })

        expect(response.success).toBe(true)
        expect(response.data.title).toBe("My Video")
    })

    it("should default message to 'Success'", () => {
        const response = new ApiResponse(200, null)

        expect(response.message).toContain("Success")
    })
})

// ── asyncHandler Tests 

describe("asyncHandler", () => {

    it("should call the wrapped function with req, res, next", async () => {
        let wasCalled = false

        const handler = asyncHandler(async (req, res, next) => {
            wasCalled = true
        })

        await handler({}, {}, () => { })
        expect(wasCalled).toBe(true)
    })

    it("should catch errors and pass them to next()", async () => {
        let caughtError = null

        const handler = asyncHandler(async () => {
            throw new Error("Something broke")
        })

        await handler({}, {}, (err) => {
            caughtError = err
        })

        expect(caughtError).toBeInstanceOf(Error)
        expect(caughtError.message).toBe("Something broke")
    })

    it("should catch ApiError and pass it to next()", async () => {
        let caughtError = null

        const handler = asyncHandler(async () => {
            throw new ApiError(401, "Not logged in")
        })

        await handler({}, {}, (err) => {
            caughtError = err
        })

        expect(caughtError).toBeInstanceOf(ApiError)
        expect(caughtError.statusCode).toBe(401)
    })
})
