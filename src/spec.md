# Specification

## Summary
**Goal:** Restore the application’s frontend and backend behavior to match the previously working Draft Version 8 runtime behavior.

**Planned changes:**
- Roll back or undo any post–Draft Version 8 code changes that altered runtime behavior in the frontend UI flows and backend logic.
- Ensure sign-in/sign-out flow, records CRUD (admin + personal), and admin gating behave exactly as they did in Draft Version 8.
- Rebuild and redeploy to confirm the deployed draft runs without browser console runtime errors.

**User-visible outcome:** The deployed app behaves the same as Draft Version 8, with expected authentication, admin access gating, and record creation/editing/deletion flows working without runtime errors.
