Auth token (client flow) — short note

Purpose

- The app now relies only on the stored token (localStorage.key: `token`) to restore the logged-in user's display name at startup.

What changed

- Removed storing `user` separately in localStorage.
- `initializeUser()` decodes the token client-side (JWT) and reads `username` / `name` / `email` claims to set `currentUserName`.
- `setUser()` no longer writes `user` to localStorage; it only updates the store.
- `userLogout()` removes only the `token`.

Why

- Single source of truth (the token) avoids data duplication and drift.
- Simpler logic and fewer localStorage keys.

Notes & caveats

- This assumes the token is a JWT that includes a username/name/email claim. If the token is opaque, consider replacing this with a server-verified `/me` call on startup.
- JWT decoding is only for UI convenience; it does not verify token validity. For sensitive flows, validate with the backend.

How to explain to others

- "We store the auth token in localStorage and decode its payload to extract the username for the UI. We do not persist the username separately to avoid duplication. If the token is invalid or missing the username, the user will not be restored and must re-login."
