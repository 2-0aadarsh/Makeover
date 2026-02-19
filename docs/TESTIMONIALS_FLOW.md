# Testimonials (Published Reviews) – End-to-End Flow

This document describes how to implement a **Testimonials** section that shows **published** customer reviews with card-style layout, auto-sliding carousel, and smooth animations—from backend to frontend.

---

## 1. Overview

- **Goal:** Show real customer reviews (that admins have “Published”) on the homepage in a testimonials section similar to the reference image: card layout with quote, avatar, name, and context (e.g. service name). Include smooth animations and **automatic sliding** when there are more reviews than visible at once.
- **Who sees it:** All visitors (public, no login).
- **Where it lives in the UI:** **Homepage** – the existing “What our customers say” / Testimonial block (replace or refactor the current static content with this dynamic, review-driven section).

---

## 2. Backend Flow

### 2.1 Review status: support “published” and “hidden”

- **Current state:** Review `status` enum is `['pending', 'reviewed', 'resolved', 'dismissed']`. There is no “published” or “hidden.”
- **Change:** Extend the enum to include `'published'` and `'hidden'` (e.g. `['pending', 'reviewed', 'resolved', 'dismissed', 'published', 'hidden']`).
  - **Reviews (type: review):**  
    - `pending` → just submitted, not moderated.  
    - `reviewed` → admin has seen it.  
    - **`published`** → approved and **shown on the site** (testimonials).  
    - **`hidden`** → taken down from the site (not shown in testimonials).
  - **Complaints (type: complaint):** Keep using `pending` / `reviewed` / `resolved` / `dismissed` only; Publish/Hide in admin UI apply only to **reviews**, not complaints (admin buttons already only show for non-complaints).

### 2.2 Admin “Publish Review” / “Hide Review”

- **Publish Review:** Set review `status` to `'published'` (only for `type === 'review'`).
- **Hide Review:** Set review `status` to `'hidden'`.
- **API:** Reuse existing admin endpoint (e.g. `PATCH /api/admin/reviews/:id/status`) but allow `status: 'published'` and `status: 'hidden'` in the payload (and in the model enum as above). No new route required.

### 2.3 Public API for testimonials

- **New endpoint (public, no auth):**  
  `GET /api/reviews/testimonials` or `GET /api/testimonials`
- **Behavior:**
  - Query: reviews where `type === 'review'` **and** `status === 'published'`.
  - Return a **limited list** (e.g. `limit=10` or 20) for the carousel.
  - Sort e.g. by `createdAt` desc or by a “featured”/order field if you add one later.
- **Response shape (per item), at least:**
  - `_id`, `comment` (the quote), `rating`
  - `customerDetails.name` (or `customerName`) – display name
  - `serviceName` – e.g. “Mamma Earth Ubtan Facial” (acts like “title” in the reference image)
  - `orderNumber` – optional, for “Order #ORD000001” if you want
  - `createdAt` – optional, for “February 2026” etc.
- **No auth:** So the homepage can call this without cookies.

Result: backend is the single source of truth for “what is published” and “what appears in testimonials.”

---

## 3. Frontend Data Flow

1. **Homepage** loads → **Testimonials** section mounts.
2. **Testimonials** section (or a small hook/slice) calls `GET /api/reviews/testimonials` (or `GET /api/testimonials`) once.
3. Response is stored in component state or in a small Redux slice (e.g. `testimonials: { list: [], loading, error }`). No auth needed.
4. **Carousel** receives `list` and renders **one card per review** (quote, avatar, name, service/title).
5. If there are **more reviews than visible cards** (e.g. more than 3), the carousel **auto-slides** (e.g. every 5–6 seconds) and/or allows manual navigation (dots, arrows). If there are 1–3 reviews, show them without sliding or with a single “slide.”

So: **Backend (published status + public API) → Frontend fetch → State → Carousel → Cards.**

---

## 4. Where the component lives in the UI

- **Page:** **Homepage** (`HomePage.jsx`).
- **Section:** Replace (or refactor) the current **Testimonial** block (the one that today shows static text + scrolling images) with the new **Testimonials** section that:
  - Shows the heading (e.g. “Take a Look at What Our Amazing Clients Have Said” or keep “What our customers say”).
  - Renders the **carousel of review cards** (and optionally a fallback when there are no published reviews).
- **Placement:** Keep the same position in the page (e.g. after Gallery, before Serviceable Cities / Contact) so the flow of the page stays familiar.

So: **User sees it** by scrolling the homepage; no extra route or menu item.

---

## 5. How each review is presented (card design)

Each **published** review is one **card** in the carousel. One card should include:

1. **Quote**  
   The review `comment` text, in quotation marks, readable font size. Optionally truncate with “…” if very long (e.g. max 2–3 lines) with a tooltip or “Read more” if needed.

2. **Rating**  
   Optional: small star rating (e.g. 4.5/5) above or below the quote for consistency with your app.

3. **Avatar**  
   You may not have profile images; use:
   - **Initials** from `customerDetails.name` (e.g. “Aman” → “A”) in a circle with brand color, or
   - A default avatar/placeholder.  
   So each card still has a “face” like in the reference image.

4. **Name**  
   `customerDetails.name` (or equivalent) – e.g. “Aman”.

5. **Title / context**  
   Use **service name** as the “title” (e.g. “Mamma Earth Ubtan Facial”). Optionally add “Order #ORD000001” or “Feb 2026” in smaller text.

Layout: same idea as the reference—**card with quote on top, then avatar + name + title below**, with spacing and typography that match your design system (e.g. rounded corners, light shadow, brand colors).

---

## 6. Animations and auto-slide

- **Auto-slide:**  
  When there are **more reviews than visible at once** (e.g. more than 3 cards):
  - Advance to the **next set of cards** (or next single card) automatically every **5–6 seconds** (configurable).
  - Loop: after the last slide, go back to the first (infinite loop).

- **Transitions:**  
  - Use **smooth** slide (e.g. translate X) or fade when changing slides.  
  - Keep duration short (e.g. 0.3–0.5 s) so it feels responsive.  
  - Framer Motion (you already use it) or CSS transitions are enough.

- **Indicators:**  
  - **Dots** (or numbers 1, 2, 3…) under the carousel to show current slide and total slides.  
  - Clicking a dot jumps to that slide (with the same smooth animation).

- **Optional:**  
  - Prev/Next arrows for manual control.  
  - Pause auto-slide on hover so users can read.  
  - Touch/swipe support on mobile for the carousel.

- **When there are few reviews (e.g. 1–3):**  
  - No need to auto-slide; show all cards (e.g. 1–3 cards in a row).  
  - Optionally still use the same card component and layout for consistency.

Result: **smooth, clear animations** and **automatic sliding when there are more reviews**, matching the “smooth, awesome animations” and “automatic slide if more reviews” requirement.

---

## 7. Step-by-step implementation order

1. **Backend**
   - Add `'published'` and `'hidden'` to Review `status` enum.
   - Allow `published` / `hidden` in admin update-status logic (only for `type === 'review'`).
   - Add public `GET /api/reviews/testimonials` (or `GET /api/testimonials`) returning only `type === 'review'` and `status === 'published'`, with fields needed for cards (comment, rating, customer name, service name, etc.).

2. **Frontend – data**
   - Add a small API function + optional slice (or only local state) for “testimonials” that calls the new public API.
   - Homepage Testimonials section fetches on mount; store list, loading, error.

3. **Frontend – UI**
   - Build **TestimonialCard** component: quote, rating, avatar (initials or placeholder), name, service name (and optional order/date).
   - Build **TestimonialsCarousel** (or reuse/extend a carousel): render an array of `TestimonialCard`, auto-slide when `reviews.length > visible count`, dots, optional arrows, smooth slide/fade.
   - Replace (or refactor) current **Testimonial** block on **HomePage** with this carousel; use the same section title and position.

4. **Polish**
   - Empty state: when there are no published reviews, show a short message (e.g. “What our customers say – more reviews coming soon”) and optionally keep a static fallback.
   - Responsive: how many cards per view on mobile vs tablet vs desktop (e.g. 1 on mobile, 3 on desktop).
   - Accessibility: keyboard navigation, aria-labels for carousel and dots.

---

## 8. Summary

- **Backend:** Add `published`/`hidden` to review status; public API that returns only published reviews for testimonials.
- **Admin:** “Publish Review” / “Hide Review” set that status so only approved reviews appear on the site.
- **Frontend:** Homepage Testimonials section fetches from that API and renders a **carousel of cards** (quote, avatar, name, service/title), with **smooth animations** and **automatic sliding** when there are more reviews.
- **Where users see it:** Same place as today’s testimonials – **homepage**, in the “What our customers say” area, with each review presented in a clear, card-based layout like the reference image.

This flow connects “Publish = approve and show the review to customers” to a real, visible testimonials section with the behavior and design you described.
