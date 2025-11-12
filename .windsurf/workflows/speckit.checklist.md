---
description: Generate a custom checklist for the current feature based on user requirements.
---

# SpecKit: Checklist Workflow

This workflow generates a quality assurance checklist customized for the current feature.

## Steps

1. **Read Feature Specification**
   - Load `specs/[feature-id]/spec.md`
   - Extract user stories and acceptance criteria
   - Identify key features and integrations

2. **Determine Checklist Categories**
   - Functionality
   - Brand Design Compliance
   - Accessibility (WCAG 2.1 AA)
   - Performance
   - Security
   - Mobile Responsiveness
   - Browser Compatibility
   - SEO
   - Documentation

3. **Generate Functionality Checklist**
   - Convert each acceptance criterion to checkbox item
   - Add manual testing steps
   - Include edge cases and error scenarios
   - Specify test data requirements

4. **Add Brand Design Checks**
   - Verify logo usage (from `/public/images/logo.png`)
   - Check color palette (#A4B82C lime green)
   - Validate typography ("healthy corner" lowercase)
   - Confirm spacing and layout consistency
   - Verify image optimization

5. **Create Accessibility Checklist**
   - Keyboard navigation tests
   - Screen reader compatibility
   - Color contrast ratios (WCAG AA)
   - ARIA labels and roles
   - Focus indicators
   - Form validation accessibility

6. **Add Performance Checks**
   - Lighthouse score targets (90+)
   - Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
   - Image optimization (WebP, lazy loading)
   - Bundle size limits
   - API response times

7. **Include Security Checks**
   - RLS policy validation
   - Input validation (Zod schemas)
   - XSS prevention
   - CSRF protection
   - Secure headers
   - Environment variable security

8. **Add Cross-Browser Tests**
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers (iOS Safari, Chrome Android)

9. **Generate Checklist File**
   - Create `specs/[feature-id]/checklists/qa-checklist.md`
   - Use checkbox format for tracking
   - Add notes section for each category
   - Include testing dates and tester names

10. **Present Checklist**
    - Display checklist summary
    - Highlight critical items
    - Suggest testing order

## Checklist Format

```markdown
# QA Checklist: [Feature Name]

**Feature ID:** [feature-id]
**Testing Date:** _____________
**Tester:** _____________
**Version:** _____________

---

## Functionality

### User Story: [US-001] Hero & About Section
- [ ] Logo displays from `/public/images/logo.png` at 160x160px
- [ ] Background image loads from `/public/images/hero-bg.jpg`
- [ ] Brand name "healthy corner" is lowercase and bold
- [ ] Tagline "ALPSKI ZDRAVILIŠKI KAMP" is uppercase with proper tracking
- [ ] Smooth fade-in animation works
- [ ] Mobile responsive (320px to 1024px+)
- [ ] SEO meta tags present

**Notes:** ___________________________________________

---

## Brand Design Compliance

- [ ] Primary color #A4B82C used consistently
- [ ] Logo sourced from `/public/images/` (never recreated)
- [ ] Typography follows guidelines (lowercase brand name)
- [ ] Hover effects use lime green
- [ ] Spacing matches brand guide
- [ ] All images optimized (Next.js Image component)

**Notes:** ___________________________________________

---

## Accessibility (WCAG 2.1 AA)

- [ ] All images have alt text
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus indicators visible
- [ ] Screen reader announces all content correctly
- [ ] Forms have proper labels and error messages
- [ ] ARIA landmarks used correctly

**Tools Used:** axe DevTools, WAVE, NVDA

**Notes:** ___________________________________________

---

## Performance

- [ ] Lighthouse Performance score ≥ 90
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Images use WebP format
- [ ] Lazy loading enabled for below-fold images
- [ ] No layout shifts during page load

**Notes:** ___________________________________________

---

## Security

- [ ] RLS policies tested (public can SELECT, admin can CRUD)
- [ ] Input validation works (Zod schemas)
- [ ] XSS attack prevented
- [ ] Environment variables not exposed
- [ ] Rate limiting active
- [ ] Secure headers configured

**Notes:** ___________________________________________

---

## Mobile Responsiveness

Tested on:
- [ ] iPhone 13 (390x844)
- [ ] Samsung Galaxy S21 (360x800)
- [ ] iPad Air (820x1180)
- [ ] Desktop (1920x1080)

**Notes:** ___________________________________________

---

## Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Chrome Android

**Notes:** ___________________________________________

---

## SEO

- [ ] Meta title and description present
- [ ] Open Graph tags configured
- [ ] Structured data (JSON-LD) included
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs set

**Notes:** ___________________________________________

---

## Documentation

- [ ] README updated
- [ ] API documentation current
- [ ] Environment variables documented
- [ ] Deployment guide accurate

**Notes:** ___________________________________________

---

## Final Sign-Off

**Overall Status:** [ ] PASS  [ ] FAIL  [ ] NEEDS REVISION

**Critical Issues:**
1. ___________________________________________
2. ___________________________________________

**Approved By:** _____________
**Date:** _____________
```

## Example Usage

```
/speckit.checklist
```

## Output

- `specs/[feature-id]/checklists/qa-checklist.md` - Complete quality assurance checklist
