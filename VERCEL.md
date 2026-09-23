# Elluzion AI - Vercel deployment guide

## 1. Open the project

Extract E_P_O_O.zip. In VS Code choose File > Open Folder and select the inner elluzion-ai folder. You should see vercel.json, package.json and website directly inside it.

The latest shopping video is included in website/assets/elluzion-demo.mp4.

Install Node.js LTS from https://nodejs.org if Node is not already installed. Open Terminal > New Terminal in VS Code.

To preview locally:

```sh
npm run dev
```

Open http://127.0.0.1:4173. Press Ctrl+C to stop the preview.

## 2. Deploy directly from VS Code (no GitHub required)

Run these commands separately:

```sh
npx vercel login
npx vercel
```

Allow npx to install the official Vercel CLI if prompted, then complete Vercel sign-in in your browser.

When asked about the project:

- Choose your intended Vercel account or team.
- Create a new project, or link your existing Elluzion website project if you already have one.
- Suggested project name: elluzion-ai.
- Code directory: ./ (the folder containing vercel.json).
- Framework: Other, if asked.
- Keep the included configuration; no build or install command is needed.
- Output directory: website.

Open the deployment URL printed in the terminal and check the page, video, buyer app link and contact form. Vercel can treat the first deployment of a new project as production, so do this before attaching your custom domain.

To deploy the final version to production, run:

```sh
npx vercel --prod
```

## 3. Connect www.elluzionai.com through GoDaddy

1. Open your project in the Vercel dashboard, then Settings > Domains.
2. Add www.elluzionai.com and elluzionai.com.
3. Make www.elluzionai.com the destination and configure elluzionai.com to redirect to it.
4. Vercel will show the DNS records needed for each domain. Copy those exact values; do not use guessed IP addresses or CNAME targets.
5. In GoDaddy, open elluzionai.com > DNS > Manage DNS.
6. Add or update the www record using the type and target shown by Vercel. Add or update the root (@) record as instructed by Vercel. Add any verification TXT record Vercel requests.
7. Replace only conflicting website records for those same names. Preserve email MX, SPF, DKIM and other unrelated records. You can keep DNS at GoDaddy; changing nameservers is unnecessary for this method.
8. Return to Vercel and wait for valid domain configuration and HTTPS. DNS changes may take time to propagate.
9. Open https://www.elluzionai.com in a private browser window and check it works without a Vercel login. If protection is enabled for production, review Settings > Deployment Protection for public access.

## 4. Included configuration

vercel.json publishes website as static files:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "buildCommand": "",
  "installCommand": "",
  "outputDirectory": "website"
}
```

The local scripts/serve.cjs server is only for your laptop. Vercel serves the website files directly.

## 5. Current launch details

- The website still has a noindex,nofollow meta tag in website/index.html. When ready for search engines, remove that tag and deploy again.
- Legal pages are drafts; registered address and grievance details remain pending.
- Supabase is not configured. The contact form currently opens an email draft; it does not save submissions to a database. See README.md and the supplied migration for database setup.
- Store AI and the online salesperson are labelled as planned/in development. The video is a concept demo.

## 6. Future updates

Edit files inside website, check them locally with npm run dev, then run npx vercel --prod from the same project folder. Reuse the linked Vercel project. Do not deploy just the website folder when using this configuration; deploy its parent elluzion-ai folder.

If you see a 404, check that the selected project root contains vercel.json and that website/index.html exists. If old content remains, confirm you deployed to the correct linked project and refresh the browser.

Official documentation:
- https://vercel.com/docs/builds/configure-a-build
- https://vercel.com/docs/deployments
- https://vercel.com/docs/domains/set-up-custom-domain

This package is prepared for deployment. No deployment or DNS changes were made for you.
