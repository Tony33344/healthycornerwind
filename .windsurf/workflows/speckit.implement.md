---
description: Execute the implementation plan by processing and executing all tasks defined in tasks.md
---

# SpecKit: Implement Workflow

This workflow executes the implementation by working through all tasks in dependency order.

## Steps

1. **Read tasks.md**
   - Load `specs/[feature-id]/tasks.md`
   - Parse all tasks and their status
   - Identify next actionable task (no pending dependencies)

2. **Execute Next Task**
   - Read task details and acceptance criteria
   - Check constitutional compliance requirements
   - Review relevant design documents
   - Implement the task:
     * Write code following brand guidelines
     * Add necessary imports and dependencies
     * Ensure TypeScript types are correct
     * Apply Tailwind CSS with brand colors
     * Add accessibility attributes (ARIA labels, etc.)

3. **Write Tests**
   - Create unit tests for new functions/components
   - Add integration tests if applicable
   - Ensure tests pass before marking task complete
   - Target 80%+ code coverage

4. **Validate Against Acceptance Criteria**
   - Check each item in task acceptance criteria
   - Verify constitutional compliance
   - Test functionality manually if needed
   - Ensure brand design consistency

5. **Mark Task Complete**
   - Update checkbox in `tasks.md`
   - Add completion timestamp
   - Document any deviations or notes

6. **Run Quality Checks**
   // turbo
   - Run linter: `npm run lint`
   // turbo
   - Run type check: `npm run type-check`
   // turbo
   - Run tests: `npm test`
   - Fix any issues before proceeding

7. **Move to Next Task**
   - Identify next uncompleted task with no pending dependencies
   - Repeat steps 2-6
   - Continue until all tasks complete

8. **Final Validation**
   // turbo
   - Run full test suite: `npm test && npm run test:e2e`
   // turbo
   - Build production bundle: `npm run build`
   - Check Lighthouse scores for performance
   - Verify brand consistency across all pages
   - Test accessibility with screen reader

9. **Update Documentation**
   - Update README.md if needed
   - Document any new environment variables
   - Add API documentation for new endpoints
   - Update DEPLOYMENT_STATUS.md

## Example Usage

```
/speckit.implement
```

## Task Execution Order

1. **Database tasks** (migrations, schemas, RLS policies)
2. **Type definitions** (TypeScript interfaces)
3. **Utility functions** (helpers, validators)
4. **API routes** (Supabase queries, Edge Functions)
5. **UI components** (atomic components first, then composed)
6. **Page implementations** (using components)
7. **Testing** (unit, integration, E2E)
8. **Documentation** (README, API docs)

## Output

- All files created/modified per tasks.md
- Updated tasks.md with completed checkboxes
- Passing test suite
- Production-ready code
