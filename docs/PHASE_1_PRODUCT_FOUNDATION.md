# Pluto — Phase 1 Product Foundation

Status: Working baseline for the guided rebuild  
Last updated: 2026-08-29

This document defines the product and design decisions that every later Pluto screen must follow. These choices remain editable, but implementation should not contradict them without an explicit decision.

## 1. Product definition

### One-sentence description

Pluto is a freelancer-first marketplace where verified talent can access serious work without paying to apply, while clients fund protected milestones and pay a transparent platform fee.

### Product promise

> Fair access to work. Clear commitments. Protected delivery.

### The problem

Many freelance marketplaces create friction on both sides:

- Talent may need tokens, credits, or paid visibility just to apply.
- Clients receive too many low-quality or irrelevant proposals.
- Payment expectations and deliverables are often unclear.
- Both sides worry about abandonment, delayed payment, and poor work.
- Marketplace interfaces frequently optimize for activity instead of trust.

### Pluto's answer

Pluto replaces paid bidding with curated matching, verified profiles, funded milestones, structured delivery, and reputation-based accountability.

## 2. Positioning

### Primary positioning

Pluto is a professional marketplace for fixed-price digital projects. It is designed for clients who value reliable delivery and for independent professionals who should not have to pay for access to work.

### Differentiators

1. Talent never pays to apply.
2. Talent receives the full quoted project amount.
3. Clients fund milestones before work begins.
4. Clients see a focused shortlist instead of an unfiltered proposal pile.
5. Reliability is demonstrated through verification and completion history.
6. Deliverables, revisions, approvals, and payment status live in one workspace.

### What Pluto is not

- A bidding race to the lowest price
- A paid-token application system
- A social feed for freelancers
- A generic job board
- An hourly-work tracker in the first release
- A replacement for legal or financial professionals

## 3. Primary users

### Talent

Independent designers, developers, writers, marketers, and other digital professionals who want qualified opportunities without paid bidding.

Their main needs are:

- Relevant opportunities
- Clear scope and budget
- Protection from unpaid work
- A credible professional profile
- Simple proposals and project communication
- Predictable milestone releases

### Client

Startup founders, small teams, agencies, and growing businesses hiring independent specialists for defined outcomes.

Their main needs are:

- Trusted and relevant talent
- Clear pricing and deliverables
- Easy project creation
- Controlled milestones and revisions
- Progress visibility
- Evidence before approving payment

### Platform operator

The Pluto team responsible for verification, project quality, marketplace safety, fee transparency, and dispute administration.

## 4. Core marketplace journey

1. A client creates a clearly scoped project.
2. The client confirms the budget and expected deliverables.
3. Pluto presents a focused shortlist of suitable talent.
4. Talent sends a concise proposal without buying tokens.
5. The client selects talent and funds the first milestone.
6. Work begins inside a shared project workspace.
7. Talent submits the milestone with supporting files and notes.
8. The client approves it or requests revisions within the review window.
9. Approved work releases payment to talent.
10. Both sides leave structured feedback that contributes to reliability.

## 5. Marketplace rules

- Talent does not pay to browse, apply, or receive its quoted amount.
- Clients see all platform and payment charges before funding a milestone.
- The portfolio prototype will demonstrate a 7% client protection fee; the production rate must be validated before launch.
- A milestone must be funded before work begins.
- Every milestone requires a deliverable, due date, price, and revision allowance.
- Clients receive a defined review window before automatic release is demonstrated.
- Scope changes require a new or amended milestone.
- Repeated abandonment, spam, or abusive behavior reduces account reliability.
- Real payments must eventually use a regulated marketplace-payment provider.

## 6. Portfolio MVP scope

### Included

- Public landing page
- Opportunity discovery and filtering
- Opportunity detail pages
- Separate Talent and Client entry flows
- Demonstration signup and login
- Talent profile and portfolio
- Client company profile
- Project creation
- Curated talent matching
- Proposals
- Talent and Client dashboards
- Shared project workspace
- Milestones, delivery, revisions, and approval
- Demonstration payment-protection states
- Ratings and reliability indicators
- Notifications, empty states, and responsive layouts

### Deferred

- Real payment processing and payouts
- Production authentication
- International tax handling
- Formal dispute arbitration
- Hourly tracking
- Video calling
- Native mobile applications
- AI-generated proposals
- Public community or social-feed features

## 7. Information architecture

### Public

- Home
- Find opportunities
- Opportunity detail
- Hire talent
- How Pluto works
- Payment protection
- Login
- Signup

### Talent workspace

- Overview
- Recommended opportunities
- Saved opportunities
- Proposals
- Active projects
- Messages
- Earnings
- Profile and portfolio
- Settings

### Client workspace

- Overview
- Projects
- Post a project
- Talent matches
- Proposals
- Active work
- Messages
- Payments
- Company profile
- Settings

### Shared project workspace

- Overview
- Milestones
- Messages
- Files and deliveries
- Activity
- Contract summary

## 8. Professional design direction

### Design character

The interface should communicate quiet confidence: premium, trustworthy, calm, and operationally clear. It should feel like a serious financial or professional product rather than a themed portfolio experiment.

### Visual principles

- Content and actions lead; decoration supports them.
- Neutral surfaces dominate the interface.
- Violet is used as a controlled brand accent, not as a background effect.
- Information hierarchy must remain obvious at a glance.
- Cards exist only when they create meaningful grouping.
- Data and status use consistent, restrained colors.
- Marketing pages and product workspaces belong to one visual family.

### Color foundation

| Role | Color |
| --- | --- |
| Page background | `#F7F7F5` |
| Primary surface | `#FFFFFF` |
| Primary text | `#18181B` |
| Secondary text | `#667085` |
| Border | `#E4E7EC` |
| Pluto violet | `#5B4FE8` |
| Violet hover | `#4438CA` |
| Success | `#137A5B` |
| Warning | `#B66A10` |
| Danger | `#B42318` |

### Typography

- Primary family: Inter or a comparable clean sans-serif
- Body size: 16px with comfortable line height
- Headings: compact, confident, and sentence case
- Numerical data: tabular figures where alignment matters
- Avoid oversized decorative headlines and excessive font-weight changes

### Layout

- Maximum content width: approximately 1200px
- Spacing system: 4, 8, 12, 16, 24, 32, 48, 64, and 96px
- Primary corner radius: 12px
- Smaller controls: 8px radius
- Borders are preferred over heavy shadows
- Mobile layouts should preserve action priority rather than simply stack everything

### Interaction

- Primary action: solid Pluto violet
- Secondary action: white or transparent with a clear border
- Destructive action: isolated and explicitly labelled
- Motion: subtle 160–240ms transitions
- Visible keyboard focus on every interactive element
- No interaction should depend on hover alone

### Explicitly avoid

- Stars, planets, orbit graphics, or space-themed dashboards
- Neon gradients and glowing borders
- Glassmorphism
- Excessive shadows
- Decorative metric cards without purpose
- Huge hero text that hides the product
- Generic stock photos of office teams
- Multiple competing accent colors
- Different visual systems for Talent and Client

## 9. Content voice

Pluto should sound direct, fair, and confident.

- Explain benefits in plain language.
- Use specific marketplace terms such as milestone, deliverable, review window, and funded.
- Avoid exaggerated claims such as “revolutionary” or “the future of work.”
- Never hide fees behind vague language.
- Use “Talent” and “Client” consistently throughout the interface.
- Use supportive empty states that explain the next useful action.

## 10. Accessibility baseline

- Meet WCAG AA color contrast.
- Support keyboard navigation and visible focus.
- Use semantic page structure and form labels.
- Never communicate status with color alone.
- Maintain usable touch targets on mobile.
- Respect reduced-motion preferences.
- Provide meaningful error messages next to the affected fields.

## 11. Phase 1 acceptance checklist

- [x] Product problem defined
- [x] Target users defined
- [x] Value proposition established
- [x] Marketplace workflow defined
- [x] MVP boundaries established
- [x] Information architecture drafted
- [x] Professional design direction defined
- [x] Content and accessibility principles defined
- [ ] User reviews and approves or changes the working baseline

## 12. Next implementation step

After this foundation is approved, Phase 2 should create only the application shell and reusable design system. The first visible product screen should not be built until that foundation is stable.

Recommended next instruction:

> Approve Phase 1 and start Phase 2: create the clean project structure and reusable professional design system, but do not build the homepage yet.
