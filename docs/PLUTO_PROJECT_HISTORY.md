# Pluto Project History

This document carries forward the important product decisions and implementation context from the earlier Pluto Codex conversation. Use the repository and this document as the source of truth when continuing the project.

## Project identity

Pluto is a freelancer-first marketplace for fixed-price digital work. Freelancers do not buy tokens or pay to submit proposals. They keep 100% of their quoted price, while clients pay a transparent protection/platform fee.

The product promise is:

> Fair access to work, protected milestones, and commitment built through verification and reputation rather than paid bidding.

Pluto is intended to be the flagship project in a three-project portfolio alongside a healthcare website and SplitSpace, a shared-living application.

## Business and payment model

- The client verifies a payment method and funds the first milestone before work begins.
- Pluto recommends a limited set of suitable freelancers instead of encouraging unlimited bidding.
- The freelancer submits milestone deliverables through the project workspace.
- The client approves the work or requests revisions during a defined review window.
- An accepted milestone, or an expired review window without a valid dispute, releases payment to the freelancer.
- Freelancers receive their full quoted amount.
- Clients pay a transparent Pluto protection fee. The initial concept suggested testing a 5-8% fee plus clearly disclosed payment-processing costs.
- Real money must be handled by a regulated marketplace-payment provider; Pluto should not hold client funds in an ordinary bank account.

The portfolio/demo version may simulate payments, disputes, verification, and automatic release. Production versions require proper compliance, identity, payment, refund, chargeback, and dispute systems.

## Commitment without paid tokens

The earlier product discussion selected these alternatives to paid applications:

- Weekly application limits
- Identity and skill verification
- Profile-completion requirements
- Availability and workload limits
- Reliability scores based on response and completion history
- Penalties for abandoning accepted work
- Curated matching instead of an unlimited proposal feed
- Restoring application capacity through successful completion

## Portfolio MVP

The agreed MVP focuses on fixed-price digital projects and includes:

- Separate Talent and Client entry flows
- Talent and Client profiles/workspaces
- Project posting and opportunity discovery
- Curated matching and proposals without tokens
- Funded milestone demonstrations
- Workspace messaging
- Deliverable submission, approval, revisions, and release countdowns
- Ratings and reliability indicators
- Responsive desktop and mobile layouts

Hourly work, international tax handling, production payment custody, and real dispute arbitration are intentionally outside the first portfolio version.

## Visual direction

The project began with a deep-space control-room identity. It was later refined into a more professional marketplace experience:

- Restrained black, white, and violet palette
- Official purple Pluto logo
- Stronger information hierarchy and business-focused language
- Cleaner project and product panels
- Fewer decorative space effects
- Trust, payment protection, and marketplace credibility emphasized in the copy

Talent and Client entry screens are intentionally different:

- Talent uses a darker, opportunity-focused experience.
- Client uses a lighter, structured project-management experience.

## Current routes

- `/` - marketplace landing page
- `/opportunities` and `/opportunities/[id]` - project discovery and detail
- `/hire` - client hiring entry
- `/how-it-works` - marketplace process
- `/protect` - payment/protection explanation
- `/talent` - Talent workspace
- `/client` - Client workspace
- `/login/talent` and `/login/client` - separate role logins
- `/signup/talent` and `/signup/client` - separate role signup flows

## Current implementation state

- Framework: Next.js/React through the Sites Vinext/Vite setup
- Hosting project is configured in `.openai/hosting.json`.
- Existing Git history was preserved when the project was moved here.
- Current committed tip at the time of relocation: `0b23e51` (`Give talent and client distinct login views`).
- Preserved unfinished work: signup pages plus edits to both login pages and `app/access.css`.
- Authentication is currently a portfolio demonstration, not a secure production backend.
- The known published address is `https://pluto-fair-work.akshaey2007.chatgpt.site`.
- Do not assume the published version matches the newest local code.

## Non-negotiable working rule

Do not deploy or publish Pluto until the user explicitly says **deploy**.

Local changes, previews, builds, and verification are allowed. Publishing is a separate user-approved step.

## Conversation provenance

The recovered Pluto discussion lives in the Codex task titled `Suggest a third portfolio project`, task ID `01a034ae-1f74-7320-8c7b-3984e8eebc70`. It covers the original business analysis, MVP definition, interactive site build, Git/Sites publishing, logo adoption, professional redesign, multi-page expansion, separate Talent/Client login experiences, and signup work.

The Codex task itself remains in the app's task history. This file is the portable project-level record of its decisions so work can continue from this folder without depending on the old task being open.

## Relocation

On 2026-08-29, the complete project was moved from:

`C:\Users\Akshaey Keerthi SN\Documents\Codex\2026-08-24\so\outputs\pluto`

to this project folder:

`C:\Users\Akshaey Keerthi SN\OneDrive\Desktop\pluto excl`

The move included source files, assets, dependencies, generated outputs, Sites configuration, Git history, and uncommitted work.
