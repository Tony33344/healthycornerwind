---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
---

# SpecKit: Plan Workflow

This workflow creates a detailed implementation plan from a feature specification.

## Steps

1. **Read Feature Specification**
   - Load `specs/[feature-id]/spec.md`
   - Extract key requirements and user stories
   - Identify technical constraints

2. **Create Plan Directory**
   - Create `specs/[feature-id]/plan/` directory
   - Prepare for multiple planning artifacts

3. **Generate Technical Design**
   - Create `plan/technical-design.md`
   - Define architecture and data models
   - Specify API endpoints and contracts
   - Document component hierarchy
   - Identify external dependencies
   - Plan database schema and migrations

4. **Create UI/UX Design**
   - Create `plan/ui-ux-design.md`
   - Define page layouts and wireframes
   - Specify component designs
   - Document user flows
   - Define responsive breakpoints
   - Plan animations and interactions
   - Ensure brand compliance (#A4B82C, lowercase "healthy corner")

5. **Security & Performance Plan**
   - Create `plan/security-performance.md`
   - Define RLS policies for Supabase
   - Plan authentication flows
   - Document rate limiting strategy
   - Specify caching approach
   - Plan image optimization
   - Define performance budgets

6. **Testing Strategy**
   - Create `plan/testing-strategy.md`
   - Define unit test coverage targets
   - Plan integration tests
   - Specify E2E test scenarios
   - Document accessibility testing approach
   - Plan performance testing

7. **Validate Against Constitution**
   - Ensure all plans comply with `.specify/memory/constitution.md`
   - Verify technology stack alignment
   - Check brand design adherence
   - Confirm security requirements

8. **Review and Finalize**
   - Display summary of all planning artifacts
   - Ask for feedback
   - Iterate if needed

## Example Usage

```
/speckit.plan
```

## Output

- `specs/[feature-id]/plan/technical-design.md`
- `specs/[feature-id]/plan/ui-ux-design.md`
- `specs/[feature-id]/plan/security-performance.md`
- `specs/[feature-id]/plan/testing-strategy.md`
