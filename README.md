# Elluzion AI website

Responsive product website for offline stores, online brands and shoppers. The current design uses platform.css and platform.js, with three separate demonstrations beside their explanations instead of the older Three.js walkthrough.

## Run in VS Code

Extract the ZIP, open this folder in VS Code, install Node.js 22+ if needed, and run:

    npm run dev

Open http://127.0.0.1:4173/. No npm install or build is required. Save and refresh to see changes. Stop with Ctrl+C. If the port is busy, set $env:PORT = '4174' in PowerShell before starting.

## Files to edit

- website/index.html: homepage copy, sections and enquiry form.
- website/platform.css: active styling and responsive layouts.
- website/platform.js: clickable AI salesperson walkthrough.
- website/navigation.js: mobile menu.
- website/business.js: enquiry form behavior.
- website/supabase-config.js: public Supabase configuration (currently empty).
- website/supabase-inquiries.js: validation and database requests.
- website/legal.html and website/document.css: draft policy pages.

Older walkthrough scripts, styles, artwork and vendor files are included for reference but not loaded by the homepage.

## Integrations

Store AI and the online AI salesperson are planned. The product previews are illustrative, not live AI. The buyer app opens at https://elluzionai.lovable.app/; its separate source code is not included.

Supabase is not connected. The enquiry form currently prepares an email draft. To connect a project, review and run supabase/migrations/202609160001_website_inquiries.sql once, then set your project URL and public publishable/anon key in website/supabase-config.js. Never use a service-role or secret key in browser files. Visitors can insert inquiries but cannot read, update or delete them. Update the privacy draft with your actual data handling details before enabling live submissions.

Run npm test for mocked inquiry tests; these do not contact a database. Browser checks covered salesperson simulation, mobile stacking, menu, enquiry routing and layout.

## Publish manually

Use website as your static publish directory. No deployment was performed. The page retains noindex,nofollow for preview. Final policies, registered address and grievance details remain pending. Google Fonts and the buyer app require internet access.

