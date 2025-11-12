---
description: Identify underspecified areas in the current feature spec by asking up to 5 highly targeted clarification questions and encoding answers back into the spec.
---

# SpecKit: Clarify Workflow

This workflow identifies gaps or ambiguities in a feature specification and resolves them through targeted questions.

## Steps

1. **Read Current Specification**
   - Load the feature spec from `specs/[feature-id]/spec.md`
   - Analyze all sections for completeness

2. **Identify Underspecified Areas**
   - Look for vague requirements or missing details
   - Check for unclear acceptance criteria
   - Identify missing edge cases
   - Find technical gaps or assumptions
   - Note missing integration points

3. **Generate Targeted Questions (Max 5)**
   - Create specific, actionable questions
   - Prioritize by impact on implementation
   - Format: "Question X: [Specific question about Y]"
   - Focus on:
     * User experience gaps
     * Technical implementation details
     * Business logic clarifications
     * Security or performance concerns
     * Integration requirements

4. **Present Questions to User**
   - Display all questions clearly numbered
   - Wait for user responses
   - Allow user to skip questions if not applicable

5. **Update Specification**
   - Encode answers directly into `spec.md`
   - Update relevant sections (User Stories, Technical Requirements, etc.)
   - Add new acceptance criteria if needed
   - Document decisions in appropriate sections

6. **Validate and Save**
   - Ensure updates maintain constitutional compliance
   - Save updated `spec.md`
   - Summarize changes made

## Example Usage

```
/speckit.clarify
```

## Example Questions

1. **Question 1:** Should the booking calendar support recurring appointments (weekly yoga classes)?
2. **Question 2:** What happens when a user tries to book an activity that becomes full during checkout?
3. **Question 3:** Should administrators be able to override double-booking restrictions?
4. **Question 4:** How should timezone conversion work for international users?
5. **Question 5:** What notification methods are required (email, SMS, in-app)?

## Output

- Updated `specs/[feature-id]/spec.md` with clarifications integrated
- Summary of changes made
