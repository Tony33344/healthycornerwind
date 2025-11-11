# Testing Strategy

## Unit Tests
- All utility functions and data models must have unit tests.
- Use Jest for isolated logic testing.

## Integration Tests
- Test API endpoints for correct data flow and error handling.
- Validate Supabase RLS and authentication.

## End-to-End (E2E) Tests
- Use Playwright to test:
  - Booking flow (public and admin)
  - Shop checkout
  - Admin CRUD operations
  - Media upload and gallery display
  - Multilingual navigation

## Test Coverage
- Minimum 80% code coverage for all critical paths.
- All new features require tests before merging.
