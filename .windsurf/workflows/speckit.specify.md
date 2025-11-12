---
description: Create or update the feature specification from a natural language feature description.
---

# SpecKit: Specify Workflow

This workflow creates or updates a feature specification using the specification template.

## Steps

1. **Gather Feature Requirements**
   - Ask the user for a natural language description of the feature
   - Clarify the business value and target users
   - Identify key user stories and acceptance criteria

2. **Check for Existing Specification**
   - Look for existing spec in `specs/[feature-id]/spec.md`
   - If exists, ask if updating or creating new feature

3. **Create Specification Directory**
   - Create `specs/[feature-id]/` directory
   - Use kebab-case for feature ID (e.g., `001-wellness-platform`)

4. **Generate spec.md**
   - Use the template from `.specify/templates/spec-template.md`
   - Fill in all sections with feature-specific details
   - Include constitutional references
   - Add user stories with acceptance criteria
   - Define technical requirements
   - Specify success metrics

5. **Validate Against Constitution**
   - Cross-check all requirements with `.specify/memory/constitution.md`
   - Ensure brand design compliance (Principle 2)
   - Verify technology stack alignment (Principle 1)
   - Confirm security requirements (Principle 4)
   - Check accessibility standards (Principle 3)

6. **Save and Review**
   - Save `spec.md` to `specs/[feature-id]/`
   - Display key sections for user review
   - Ask for feedback and iterate if needed

## Example Usage

```
/speckit.specify "Add a booking calendar with conflict detection"
```

## Output

- `specs/[feature-id]/spec.md` - Complete feature specification
