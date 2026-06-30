# Architecture & Pre-Implementation Discovery (GetProspectra)

## 1.1 Architecture Inventory
- **Frontend Framework**: Next.js 16.2.6 (App Router with Turbopack)
- **React Version**: React 19.2.4
- **Styling**: TailwindCSS v4 with CSS variables (e.g., in `globals.css`)
- **State Management**: Next.js Server Components, React Client Components hooks.
- **Database/ORM**: PostgreSQL managed via Prisma 5.22.0. DB operations are wrapped by a singleton `LocalDB` in `src/db/local-db.ts`.
- **Authentication**: Custom cookie-based session management (`src/lib/auth.ts`) utilizing `getprospectra_session` with base64 encoded user IDs.
- **Premium Check**: Driven by `CareerProfile.premiumCredits` (integer).
- **API Pattern**: Server Actions and dynamic routes.
- **Deployment**: Vercel (Next.js config present, `.env` files used).

## 1.2 Data Model Inventory
Referencing `prisma/schema.prisma`:
- **User**: `id`, `name`, `email`, `password`, `createdAt`
- **CareerProfile**: `userId`, `professionCategory`, JSON fields for `personalInfo`, `skills`, `experience`, `projects`, `education`, `certifications`, `achievements`, `publications`, `workSamples`. Includes `premiumCredits` and `professionalBlueprint`.
- **Portfolio**: `userId`, `templateId`, `visibility` (private/public), `subdomain`, JSON fields for `sectionToggles`, `sectionOrder`, `sectionTitles`, `enhancements`.
- **InterviewQuestion**, **IdentityStack**, **GeneratedAsset**: For AI and generated components tracking.

*Note: Portfolio customizations for Phase 2 will require additive fields directly to the `Portfolio` model (e.g., `colorPaletteId`, `fontPairId`, `themeId`, etc.).*

## 1.3 Resume & Portfolio Generation Flow
- **Profile Creation**: Manual profile form or AI-generated (`src/lib/ai-service.ts`) yielding a `CareerProfile`.
- **Portfolio Generation**: Triggered by user selecting a template, creating a `Portfolio` record pointing to the `CareerProfile` via `userId`.
- **Enhancement Merge**: Base `CareerProfile` is dynamically merged with `Portfolio.enhancements` at runtime via `src/lib/portfolio-enhancements.ts` -> `generatePortfolioData()`.
- **Public Portfolio Route**: Served dynamically via `src/app/u/[username]/page.tsx` mapping to `Portfolio.subdomain`. It checks `LocalDB.getPortfolioBySubdomain` and ensures `visibility` is not "private".

## 1.4 Resolutions to Ambiguities
- **Entitlement-check mechanism**: Currently relies on `careerProfile.premiumCredits > 0` for premium generations.
- **Public Portfolio URL**: Confirmed as `/u/[username]` mapping to the subdomain field.
- **Premium Themes**: Implemented as single-unit selectable options overriding base templates.
- **AI-Provider Integration**: Existing AI logic is centralized in `src/lib/ai-service.ts` using OpenRouter/OpenAI API calls. Phase 1 AI enhancement will reuse this service.
