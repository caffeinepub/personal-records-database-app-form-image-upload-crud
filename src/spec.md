# Specification

## Summary
**Goal:** Change the height field throughout the app to use inches instead of centimeters.

**Planned changes:**
- Update the record create/edit form height label to “Height (in)” (or “Height (inches)”).
- Update the record detail view to display height values with an inches suffix (e.g., “70 in”).
- Update frontend height validation to use an inches-based numeric range and update validation messaging to reference inches (while keeping “Height must be a number” for non-numeric input and keeping height optional).
- Update backend height validation to treat stored height as inches, including inches-based allowed range and error messaging, without changing other validation rules.

**User-visible outcome:** Users enter and view height in inches, and validation/errors consistently reference inches across the form, detail view, and backend.
