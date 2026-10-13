This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.





the analystic event README ------------------------------

📊 Complete Event Reference — All Events You're Now Logging
Here's the full inventory. 16 events, all wired end-to-end and verified.

🔹 Listing Events (on /worker/[id])
#	Event	Trigger	Fires from	Payload
1	listing_view	SSR page load of /worker/{id}	getServerSideProps (SSR)	{ listing_id, city, category_id, creator_user_id, specials, ... }
2	listing_call	Click call button	handlePropertyCall()	{ listing_id, phone, realstate_id, source }
3	listing_favorite	Toggle heart icon	toggleFavorite()	{ listing_id, action: "add"|"remove" }
4	listing_share	Click share button	handleShare()	{ listing_id, channel: "native"|"clipboard"|"prompt" }
🔹 Discovery Events (homepage & category pages)
#	Event	Trigger	Fires from	Payload
5	category_view	SSR load of /{city}/{category}	getServerSideProps (SSR)	{ city_slug, category_slug, neighborhood_slug, page, results_count }
6	city_view	SSR load of /{city}	getServerSideProps (SSR)	{ city_slug, city_id, special_count, urgent_count, neighborhoods_count }
7	city_select	Pick city from dropdown	handleCitySelection()	{ city_slug, city_id, city_title, search_query }
8	search	Submit search bar	handleSearch()	{ query, city_slug, city_id, tab, trigger: "manual"|"typing", results_count, total_properties }
9	filter_apply	Apply/change filter on category page	fetchFilteredWorkers in [...slug].jsx	{ city_slug, category_slug, filters, filters_count, results_count, returned_count, has_neighborhoods, has_features, has_sort, is_reset }
🔹 Auth Events (login flow)
#	Event	Trigger	Fires from	Payload
10	auth	Enter phone + click "دریافت کد"	handleSubmit() in signup.js	{ action: "sms_requested", method: "phone", phone_prefix }
11	auth	Enter SMS code + verify	handleSubmit() in verify.jsx	{ action: "signup"|"login", method: "otp", phone_prefix, has_next_redirect }
🔹 Contact Funnel Events (homepage CTA → form page)
#	Event	Trigger	Fires from	Payload
12	contact_call_click	Click "تماس با آجر"	FileRequest.jsx → handleCallClick()	{ source, phone }
13	contact_intent	Click "ثبت درخواست"	FileRequest.jsx → handleActionClick()	{ source, intent: "form" }
14	contact_form_started	Load /file-request page	useEffect on mount	{ source: "file-request-page" }
15	contact_form_submitted	Click "ادامه" + SMS sent	handleSendVerification() success	{ source, request_type, city_id, property_type, has_description, description_length, phone_prefix, property_request_id, ... }
16	contact_form_verified	Enter correct SMS code	handleVerifyCode() success	{ source, property_request_id, user_id }
17	contact_success	Success modal shown	handleSuccess()	{ source, property_request_id }
🗂️ Grouped by Category
A) Listing analytics (4 events)
text
listing_view
listing_call
listing_favorite
listing_share
B) Category & city navigation (5 events)
text
category_view
city_view
city_select
search
filter_apply
C) Authentication (2 events)
text
auth (sms_requested)
auth (signup | login)
D) Contact funnel (6 events)
text
contact_call_click
contact_intent
contact_form_started
contact_form_submitted
contact_form_verified
contact_success
Total: 17 distinct event rows when you consider the auth event has two different action values.

🔌 Where Each Event Fires
File	Events fired
pages/worker/[id].jsx	listing_view (SSR), listing_call, listing_favorite, listing_share
pages/index.jsx (homepage)	city_view (SSR)
pages/[categories]/[...slug].jsx (category page)	category_view (SSR), filter_apply
components/filter/hooks/useFilterState.js	— (URL updates only; analytics moved to [...slug].jsx)
components/others/SearchBars.jsx	search
components/request/FileRequest.jsx	contact_call_click, contact_intent
pages/file-request.js	contact_form_started, contact_form_submitted, contact_form_verified, contact_success
components/parts/CitySelector.jsx	city_select
pages/signup.js (or panel/auth/login)	auth { action: "sms_requested" }
pages/panel/auth/verify.jsx	auth { action: "signup"|"login" }
🔄 The Data Pipeline (for every event)
text
Browser (or SSR) fires trackEvent / fireSsrEvent
           │
           ├── Client clicks → lib/track.js → POST /api/track-event
           │
           └── SSR events → lib/ssrTrack.js → POST api.ajur.app/api/analytics/track
                              (server-to-server, no CORS)
           │
           ▼
    Next.js API route forwards with X-Client-* headers
           │
           ▼
    Laravel AnalyticsController@track
           │
           ├── Reads X-Client-Ip / X-Client-User-Agent
           ├── Rejects private IPs
           └── Enriches payload (for listing_view)
           │
           ▼
    AnalyticsEvent::create() → analytics_events table
📋 Whitelist — Where Events Must Be Registered
Every event is in three places:

Location	Purpose
lib/track.js and lib/ssrTrack.js	The JavaScript helpers that fire events
pages/api/track-event.js → ALLOWED_EVENTS set	Next.js API route whitelist
app/Http/Requests/StoreAnalyticsEventRequest.php → in:[...] list	Laravel validation whitelist
All 16 event names appear in all three. (SSR-only events like listing_view bypass track-event.js — they hit Laravel directly via fireSsrEvent.)

📊 Sample Queries You Can Run Right Now
Total events today, grouped by name
sql
SELECT
  event_name,
  COUNT(*) AS count
FROM analytics_events
WHERE created_at >= CURDATE()
GROUP BY event_name
ORDER BY count DESC;
Full user journey for one listing view → call → favorite
sql
SELECT
  event_name,
  JSON_EXTRACT(payload, '$.listing_id') AS listing_id,
  created_at
FROM analytics_events
WHERE event_name IN ('listing_view', 'listing_call', 'listing_favorite')
  AND JSON_EXTRACT(payload, '$.listing_id') = 7285
  AND created_at >= NOW() - INTERVAL 7 DAY
ORDER BY created_at;
Contact funnel conversion (last 30 days)
sql
SELECT
  SUM(event_name = 'contact_intent')         AS intents,
  SUM(event_name = 'contact_form_started')   AS forms_loaded,
  SUM(event_name = 'contact_form_submitted') AS forms_submitted,
  SUM(event_name = 'contact_form_verified')  AS verified,
  SUM(event_name = 'contact_success')        AS succeeded
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL 30 DAY;
Auth funnel (signup vs login over time)
sql
SELECT
  DATE(created_at) AS day,
  SUM(JSON_EXTRACT(payload, '$.action') = 'sms_requested') AS sms_requests,
  SUM(JSON_EXTRACT(payload, '$.action') = 'signup')        AS signups,
  SUM(JSON_EXTRACT(payload, '$.action') = 'login')         AS logins
FROM analytics_events
WHERE event_name = 'auth'
  AND created_at >= NOW() - INTERVAL 30 DAY
GROUP BY day
ORDER BY day DESC;
Call vs form preference
sql
SELECT
  SUM(event_name = 'contact_call_click') AS call_clicks,
  SUM(event_name = 'contact_intent')     AS form_intents,
  ROUND(
    SUM(event_name = 'contact_call_click') /
    NULLIF(SUM(event_name = 'contact_intent') + SUM(event_name = 'contact_call_click'), 0) * 100,
    1
  ) AS "call_preference_%"
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL 30 DAY;
📁 Save This As Documentation
Save the table above as docs/analytics-events.md in your project. It's the reference for anyone who joins the team later.

Structure:

markdown
# Analytics Events

## Listing Events
| Event | Trigger | File | Payload |
|-------|---------|------|---------|
| listing_view | SSR load | pages/worker/[id].jsx | {...} |
...

## Auth Events
...

## Contact Funnel
...
✅ Status Summary
Category	Events	Status
Listing	4	✅ All wired and tested
Discovery	5	✅ All wired and tested
Auth	2 (same name, 2 actions)	✅ Wired and tested
Contact funnel	6	✅ Wired and tested
Total	17 firing positions	✅ 100% complete
Every event in your original plan is now live.




🎯 What's Next
You've finished the entire custom analytics implementation. Remaining optional work:

GA4 setup — 20 min for session tracking + retention (recommended)

GA4 Data API integration — later, when you build the dashboard

Cleanup tasks — remove debug logs from pages/api/track-event.js and pages/index.jsx once you're confident everything works

Whitelist hygiene — remember to add any new events to all three whitelists going forward

Congratulations on shipping a complete analytics system. 🚀

The next natural step is GA4 — when you're ready, create the property and paste the Measurement ID, and I'll write the integration.
