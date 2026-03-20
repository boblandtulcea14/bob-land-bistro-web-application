# Specification

## Summary
**Goal:** Configure the frontend so that `/.well-known/*` paths are served as static files without being intercepted by the React router, auth guards, or layout wrappers.

**Planned changes:**
- Ensure `frontend/public/.well-known/ic-domains` is served as raw static content.
- Update the TanStack Router configuration in `frontend/src/App.tsx` to exclude `/.well-known/*` paths from all route handlers, catch-all routes, and auth guards.

**User-visible outcome:** A GET request to `/.well-known/ic-domains` returns the raw file content directly, enabling custom domain DNS verification without being redirected to the app or a login page.
