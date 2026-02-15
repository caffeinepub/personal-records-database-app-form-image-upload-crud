# Specification

## Summary
**Goal:** Separate “personal records” from the Admin Panel by introducing a dedicated backend store and user-scoped APIs, and provide a standalone Personal Records UI for signed-in users.

**Planned changes:**
- Backend: split record storage into distinct admin-records and personal-records stores, with separate APIs for each.
- Backend: enforce per-user authorization on personal-record APIs (scoped to caller Principal) and return clear unauthorized errors when not signed in.
- Backend: add a conditional Motoko migration if needed to preserve existing records across the new storage separation.
- Frontend: update Admin Panel to only manage admin records and never call personal-record APIs.
- Frontend: add a separate “Personal Records” experience outside the Admin Panel for signed-in users, including list, detail, create/edit, and delete.
- Frontend: add/adjust React Query hooks/mutations with separate cache keys for admin vs personal records and ensure create/update reflects immediately in the UI; handle auth errors in English.

**User-visible outcome:** Admin users continue managing admin records in the Admin Panel, while signed-in users can separately view and manage only their own personal records in a dedicated Personal Records area; signed-out users see a clear sign-in prompt.
