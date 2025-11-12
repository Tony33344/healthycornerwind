---
description: Generate an actionable, dependency-ordered tasks.md for the feature based on available design artifacts.
---

# SpecKit: Tasks Workflow

This workflow generates a dependency-ordered task list from the feature specification and implementation plan.

## Steps

1. **Read Specification and Plan**
   - Load `specs/[feature-id]/spec.md`
   - Load all files from `specs/[feature-id]/plan/`
   - Extract all requirements and design decisions

2. **Identify Task Categories**
   - Database & Backend
   - UI Components
   - API Integration
   - Testing
   - Documentation
   - Deployment

3. **Generate Granular Tasks**
   - Break down each user story into implementable tasks
   - Each task should be:
     * Atomic (1-4 hours of work)
     * Testable (has clear success criteria)
     * Specific (no ambiguity)
   - Format: `[CATEGORY] Task description`
   - Include file paths and specific implementation details

4. **Establish Dependencies**
   - Order tasks by dependencies (database → API → UI)
   - Mark prerequisite tasks clearly
   - Group related tasks together
   - Ensure blocking tasks are completed first

5. **Add Acceptance Criteria**
   - Each task has clear "Done" criteria
   - Link to relevant spec sections
   - Include testing requirements
   - Reference brand guidelines where applicable

6. **Constitutional Compliance Checks**
   - Add checkpoints for brand design validation
   - Include accessibility testing tasks
   - Add performance measurement tasks
   - Include security review tasks

7. **Generate tasks.md**
   - Create `specs/[feature-id]/tasks.md`
   - Use checkbox format for progress tracking
   - Include estimated effort
   - Add priority indicators (P0, P1, P2)
   - Link to relevant documentation

8. **Review and Validate**
   - Display task summary
   - Confirm completeness with user
   - Iterate if needed

## Task Format

```markdown
## [CATEGORY] Task Group

### Task 1: Create database schema for services table
**Priority:** P0 (Blocking)
**Estimate:** 2 hours
**Dependencies:** None
**Files:** `supabase/migrations/001_services.sql`

**Acceptance Criteria:**
- [ ] Table created with columns: id, name, description, price, duration, capacity, category, image_url
- [ ] RLS policies enable public SELECT, admin INSERT/UPDATE/DELETE
- [ ] Foreign keys and constraints properly defined
- [ ] Migration tested locally

**Constitutional Reference:** Principle 4 (Security & Data Integrity)
```

## Example Usage

```
/speckit.tasks
```

## Output

- `specs/[feature-id]/tasks.md` - Complete, ordered task list with checkboxes
