---
description: Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.
---

# SpecKit: Analyze Workflow

This workflow performs a comprehensive analysis of all specification artifacts to ensure consistency and quality.

## Steps

1. **Load All Artifacts**
   - Read `specs/[feature-id]/spec.md`
   - Read all files in `specs/[feature-id]/plan/`
   - Read `specs/[feature-id]/tasks.md`
   - Load `.specify/memory/constitution.md`

2. **Cross-Reference Analysis**
   - Verify all user stories in spec.md have corresponding tasks
   - Ensure all acceptance criteria are testable in tasks.md
   - Check that technical design matches spec requirements
   - Validate UI/UX design aligns with brand guidelines

3. **Constitutional Compliance Check**
   - **Principle 1:** Verify technology stack consistency
   - **Principle 2:** Check brand design adherence (#A4B82C, lowercase "healthy corner")
   - **Principle 3:** Validate accessibility requirements
   - **Principle 4:** Ensure security measures are planned
   - **Principle 5:** Confirm CMS requirements are covered
   - **Principle 6:** Check performance targets are specified
   - **Principle 7:** Verify testing coverage is adequate
   - **Principle 8:** Validate commerce features if applicable

4. **Coverage Analysis**
   - Identify missing requirements not covered by tasks
   - Find gaps in technical design
   - Check for missing test scenarios
   - Detect ambiguous acceptance criteria

5. **Quality Metrics**
   - Count total user stories
   - Count total tasks
   - Calculate task distribution by category
   - Estimate total implementation effort
   - Assess specification completeness (0-100%)

6. **Dependency Validation**
   - Verify task dependencies are correct
   - Check for circular dependencies
   - Ensure blocking tasks are identified
   - Validate task ordering

7. **Generate Analysis Report**
   - Create `specs/[feature-id]/analysis-report.md`
   - Include:
     * Executive summary
     * Coverage statistics
     * Constitutional compliance score
     * Identified gaps and risks
     * Recommendations
     * Quality checklist

8. **Present Findings**
   - Display key findings to user
   - Highlight critical issues (P0)
   - Suggest improvements
   - Ask if clarifications are needed

## Analysis Report Format

```markdown
# Feature Analysis Report

**Feature:** [Feature Name]
**Analysis Date:** [Date]
**Specification Version:** [Version]

## Executive Summary
[2-3 sentence overview of analysis findings]

## Coverage Statistics
- User Stories: X
- Acceptance Criteria: Y
- Implementation Tasks: Z
- Test Cases: W
- Coverage Ratio: X tasks per user story

## Constitutional Compliance
- ✅ Principle 1 (Technology Stack): Compliant
- ✅ Principle 2 (Brand Design): Compliant
- ⚠️  Principle 3 (Accessibility): Partial - missing screen reader tests
- ✅ Principle 4 (Security): Compliant
...

## Identified Gaps
1. **Missing Test Coverage:** No E2E tests for checkout flow
2. **Ambiguous Requirement:** "Fast loading" not quantified
3. **Missing Design Detail:** Mobile navigation behavior unclear

## Recommendations
1. Add E2E test task for checkout (Priority: P1)
2. Specify performance target: LCP < 2.5s
3. Add wireframes for mobile menu to UI/UX design

## Quality Checklist
- [x] All user stories have tasks
- [x] All tasks have acceptance criteria
- [ ] All acceptance criteria are testable
- [x] Constitutional compliance verified
- [ ] No circular dependencies
```

## Example Usage

```
/speckit.analyze
```

## Output

- `specs/[feature-id]/analysis-report.md` - Comprehensive analysis report
- Console output with key findings and recommendations
