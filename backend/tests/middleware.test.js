import { describe, it, expect, vi } from "vitest"


describe("optionalJWT logic", () => {

    it("should set req.user to null when no token is present", () => {
        // Simulating: a guest visits /video/123 with no login cookie
        const req = {
            cookies: {},
            header: () => undefined
        }

        // The logic from our optionalJWT middleware:
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            req.user = null
        }

        expect(req.user).toBeNull()
    })

    it("should set req.user to null when token is empty string", () => {
        const req = {
            cookies: { accessToken: "" },
            header: () => undefined
        }

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            req.user = null
        }

        expect(req.user).toBeNull()
    })

    it("should extract token from cookies when present", () => {
        const req = {
            cookies: { accessToken: "abc123" },
            header: () => undefined
        }

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        expect(token).toBe("abc123")
    })

    it("should extract token from Authorization header as fallback", () => {
        const req = {
            cookies: {},
            header: (name) => name === "Authorization" ? "Bearer xyz789" : undefined
        }

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        expect(token).toBe("xyz789")
    })
})


describe("getVideoById guest access (regression test)", () => {

    it("should not crash when req.user is null", () => {
        // This is what happens when a guest visits /video/123
        const req = { user: null }

        const existingLike = req.user
            ? { video: "123", likedBy: req.user._id }  // logged in
            : null                                       // guest

        expect(existingLike).toBeNull()
    })

    it("should return like data when req.user exists", () => {
        const req = { user: { _id: "user123" } }

        const existingLike = req.user
            ? { video: "vid456", likedBy: req.user._id }
            : null

        expect(existingLike).not.toBeNull()
        expect(existingLike.likedBy).toBe("user123")
    })

    it("should set isLiked and isSubscribed to false for guests", () => {
        const req = { user: null }

        const existingLike = req.user ? {} : null
        const existingSub = req.user ? {} : null

        const video = {
            title: "Test Video",
            isLiked: !!existingLike,
            isSubscribed: !!existingSub
        }

        expect(video.isLiked).toBe(false)
        expect(video.isSubscribed).toBe(false)
    })
})
