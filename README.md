# KPMG Document Management — Next.js Prototype

Next.js 14 (App Router) port of the single-file HTML prototype. All 17 screens, all four document-system requirements from Lior's brief, and the follow-up family-member / per-member-question / member-view features.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
```

Build for production:
```bash
npm run build
npm start
```

## What's in here

- **Next.js 14.2** App Router, React 18.3
- **Tailwind CSS 3.4** (configured but the existing design system in `app/globals.css` does most of the styling — Tailwind is there for new utilities)
- **Zustand** for shared state (wizard, modal, toast, member view)
- **No backend** — every action shows a toast or transitions a screen; nothing persists

## Routes

| Path | What |
|---|---|
| `/` | Redirects to `/login` |
| `/login` · `/otp` · `/role` | Auth + role picker (Client / Staff / log in as family member) |
| `/client/home` · `/client/apps` | Client dashboard |
| `/client/project` | The big project view — family card, per-member passport, multi-tranche fund transfer, sign-in-portal declaration, per-member questions, view-as switcher |
| `/client/upload` | Per-file upload screen |
| `/staff/overview` | Staff dashboard |
| `/staff/projects` · `/staff/project-review` | Project list + full review screen |
| `/staff/clients` | Clients table with Family column |
| `/staff/templates` · `/staff/template` | Template list + editor (with editable Template Variables panel) |
| `/staff/services` | Service-type catalog |
| `/staff/request` | The 4-step wizard with family members section in Step 3 |
| `/staff/review` · `/staff/zoho` | Single-doc review, Zoho integrations |

## Project structure

```
app/
  globals.css              # Design system from prototype (CSS variables, .btn, .doc-row, etc.) + Tailwind directives
  layout.js                # Root layout — Manrope font, Tabler Icons, mounts Modal + Toast portals
  page.js                  # Redirects to /login
  login/ · otp/ · role/    # Auth screens (no shell)
  client/
    layout.js              # Client shell: TopBar + Sidebar
    home/apps/project/upload/
  staff/
    layout.js              # Staff shell
    overview/.../zoho/
components/
  TopBar.js                # Topbar — role-aware, reflects member-view swap on c-project
  Sidebar.js               # Sidebar — active-state highlighting
  Modal.js                 # Single modal portal with 17 modal-body variants
  Toast.js                 # Toast portal listening to Zustand store
lib/
  store.js                 # Zustand: toast, modal, wizard (full state machine), memberView
  templates.js             # TEMPLATES object — Fast Track + Pink Slip, with variables, collectPer, multiDoc, signInPortal, answerPer flags
```

## State model

- `useToastStore` — global toast queue, helper `showToast(title, sub)`
- `useModalStore` — `openModal(type, context)` / `closeModal()`
- `useWizardStore` — full request-wizard state: client, service, family members, documents, questions; includes `addFamilyMember`, `togglePerMemberItem`, `setPerMember`
- `useMemberViewStore` — drives the c-project "View as" switcher; member.id is `'main' | 'm2' | 'm3'`

The c-project view uses `data-viewing-member` on the wrapper plus the existing CSS rules in `globals.css` to filter `.cv-shared` and `.cv-pm-row` content.

## Known honest gaps

This is a faithful port of a prototype, not a production app. Specifically:

- **Wizard interactivity in `/staff/request` is stubbed.** The HTML was converted but the click handlers for the step navigation, family-add form, per-member toggles, etc. point at no-op stubs (`pickClient`, `pickService`, `nextStep`...). The state machine in `lib/store.js → useWizardStore` is fully wired and ready — wire each onClick to the right store action.
- **Some inline state toggles fall back to no-ops.** Anywhere the original prototype used `this.classList.toggle('on')` inline (e.g. some `.toggle` switches inside cards), the converter stripped that out as `/* react-state */`. Replace with `useState` if you need them interactive.
- **The static c-project view is hardcoded to Priya / Rohan / Aarav.** It doesn't read from `useWizardStore`. If you submit a different family in the wizard, c-project still shows the demo family. Wiring the c-project page to read live state is straightforward: replace the hardcoded names/avatars with `useWizardStore(s => s.draft.familyMembers)` once you persist a "current application" somewhere.
- **No auth.** `/login` and `/otp` just navigate forward when you click the button.
- **No persistence.** Everything is in-memory. Refresh wipes state.

## Where each requirement lives

| Requirement | Files |
|---|---|
| Family members (CRM + per-member docs) | `lib/store.js` family helpers, `app/client/project/page.js`, `app/staff/clients/page.js` (Family column), `app/staff/request/page.js` (Step 3 section), `components/Modal.js` (`add-client`) |
| Multi-transaction fund transfer | `lib/templates.js` (`multiDoc: true`, `minDocs: 1`), `app/client/project/page.js` (transfer group), `app/staff/template/page.js` (Multiple files badge) |
| Sign in portal | `lib/templates.js` (`signInPortal: true`), `components/Modal.js` (`sign-in-portal` body), `app/client/project/page.js` (Sign now button) |
| Template variables | `lib/templates.js` (`variables` object), `app/staff/template/page.js` (editable inputs), `components/Modal.js` (`add-variable`) |
| Per-family-member questions | `lib/templates.js` (`answerPer: 'familyMember'`), `app/staff/template/page.js`, `app/client/project/page.js` |
| View as family member | `useMemberViewStore`, `components/TopBar.js`, `app/role/page.js`, `app/client/project/page.js` |

## Migrating to Tailwind

The existing `app/globals.css` is intentionally kept verbatim from the HTML prototype — the design tokens live as CSS custom properties and the component classes (`.btn`, `.doc-row`, `.review-doc`, `.tb-list`, etc.) carry over unchanged. Tailwind is configured and active, but unused for now. If you want to migrate to Tailwind utilities:

1. Start with one shared component (e.g. `Sidebar.js`)
2. Replace `className="sb-item active"` with the equivalent Tailwind classes
3. Delete the matching CSS rule from `globals.css`
4. Repeat per component

The design tokens in `tailwind.config.js` are already mapped (`navy`, `cyan`, `purple`, etc.) so `bg-navy text-cyan` will work.
