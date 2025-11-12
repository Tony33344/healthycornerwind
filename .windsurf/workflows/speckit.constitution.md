---
description: Create or update the project constitution from interactive or provided principle inputs, ensuring all dependent templates stay in sync
---

# SpecKit: Constitution Workflow

This workflow creates or updates the project constitution and ensures all templates remain synchronized.

## Steps

1. **Check for Existing Constitution**
   - Look for `.specify/memory/constitution.md`
   - If exists, ask: "Update existing or create new version?"
   - If updating, load current version

2. **Gather Constitutional Principles**
   - Ask user for core principles (or use defaults)
   - Recommend 8-10 principles covering:
     * Technology stack constraints
     * Brand design requirements
     * Accessibility standards
     * Security policies
     * CMS requirements
     * Performance targets
     * Testing standards
     * Business rules (e.g., commerce, booking)

3. **Interactive Principle Definition**
   - For each principle, ask:
     * **Title:** Brief name (e.g., "Brand Design Integrity")
     * **Description:** What does this principle govern?
     * **Rationale:** Why is this important?
     * **Requirements:** Specific, testable rules
     * **Validation:** How will compliance be verified?

4. **Generate Constitution Document**
   - Create `.specify/memory/constitution.md`
   - Format using standard template:

```markdown
# Project Constitution: [Project Name]

**Version:** X.Y.Z
**Effective Date:** [Date]
**Governance Level:** Project-wide

---

## Preamble

This constitution establishes the foundational principles and requirements for the [Project Name] platform. All features, code changes, and design decisions MUST comply with these principles.

---

## Principle 1: [Title]

**Description:**
[What this principle governs]

**Rationale:**
[Why this principle exists]

**Requirements:**
1. [Specific requirement 1]
2. [Specific requirement 2]
...

**Validation:**
- [How compliance is verified]

**Non-Compliance:**
- [Consequences of violation]
- [Remediation process]

---

[Repeat for all principles]

---

## Amendment Process

1. Propose change via `/speckit.constitution` workflow
2. Document rationale in amendment log
3. Update version number (MAJOR.MINOR.PATCH)
4. Notify all stakeholders
5. Update dependent templates

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0   | [Date] | Initial constitution | [Name] |
```

5. **Create Dependent Templates**
   - Generate `.specify/templates/spec-template.md`
   - Generate `.specify/templates/plan-template.md`
   - Generate `.specify/templates/tasks-template.md`
   - Ensure templates reference constitutional principles

6. **Generate Constitutional Summary**
   - Create `CONSTITUTION_SUMMARY.md` in project root
   - Include quick-reference guide for developers
   - List key compliance checkpoints

7. **Update Existing Specifications**
   - Scan all files in `specs/*/spec.md`
   - Check for constitutional references
   - Warn if specifications don't cite constitution
   - Offer to update references

8. **Version Control**
   - Increment version number appropriately:
     * MAJOR: Breaking principle changes
     * MINOR: New principles added
     * PATCH: Clarifications or typos
   - Log changes in version history table

9. **Validate and Publish**
   - Display constitution summary
   - Confirm with user
   - Save all files
   - Update README.md to reference constitution

## Example Principles

### Principle 1: Technology Independence with Constraints
**Requirements:**
- Next.js 14+ (App Router)
- TypeScript strict mode
- Tailwind CSS for styling
- Supabase for backend

### Principle 2: Brand Design Integrity
**Requirements:**
- Use brand colors: #A4B82C (lime green), #000000, #FFFFFF
- Brand name "healthy corner" ALWAYS lowercase
- Use logo from `/public/images/logo.png`
- Never recreate logo with CSS/SVG

### Principle 3: Accessibility First
**Requirements:**
- WCAG 2.1 AA compliance mandatory
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation for all interactions
- Screen reader compatible

## Example Usage

```
/speckit.constitution
```

## Output

- `.specify/memory/constitution.md` - Complete project constitution
- `.specify/templates/spec-template.md` - Specification template
- `.specify/templates/plan-template.md` - Planning template
- `.specify/templates/tasks-template.md` - Tasks template
- `CONSTITUTION_SUMMARY.md` - Quick reference guide
