# Oleksandr Avramchuk — academic website with CMS

This version includes a browser-based editor at `/admin/` using **Decap CMS**. You do not need to edit HTML for normal updates.

## What you can edit in /admin

- Profile & homepage: name, role, institution, introduction, portrait, contact/profile links, keywords.
- Books: add/reorder books and source editions, upload covers, change descriptions and external links.
- Research projects: add/reorder projects and edit summaries/full descriptions.
- Publications: add/reorder publications, choose type, tags, DOI/link, upload PDF, select items for the homepage.
- Talks & Media: add lectures, conference papers, podcasts, interviews, dates and links.
- About: edit biography paragraphs, short bio and portrait.
- CV: upload the current PDF and maintain selected appointments, education and research areas.

## Recommended free setup (GitHub + Netlify)

The website files live in a GitHub repository. Netlify hosts the site for free and provides the login layer used by Decap CMS.

### 1. Create the GitHub repository

1. Sign in to GitHub.
2. Create a new repository, e.g. `academic-website`.
3. Upload **all files and folders from this package** to the repository root.
4. Make sure the default branch is `main`.

### 2. Deploy on Netlify

1. Sign in to Netlify (you can use your GitHub account).
2. Choose **Add new project / Import an existing project** and select the GitHub repository.
3. No build command is needed. The publish directory is `.` (the repository root); `netlify.toml` already contains this setting.
4. Deploy the site.

### 3. Enable the CMS login

In the Netlify dashboard for this site:

1. Enable **Identity**.
2. Set registration to **Invite only**.
3. Enable **Git Gateway**.
4. Optionally enable GitHub or Google as an external login provider.
5. Invite your own email address as a site user if needed.

Then open:

`https://YOUR-SITE.netlify.app/admin/`

Log in, edit a field, and click **Publish**. Decap CMS writes the updated JSON/content files back to GitHub; Netlify then publishes the changed site automatically.

## Custom domain

Once the Netlify version works, add your domain in Netlify → Domain management. The site itself does not require a paid hosting plan; the domain is the only likely annual cost.

## Important first edits

Open `/admin/` and add:

1. portrait photograph;
2. Manchester University Press book cover;
3. email, ORCID and Google Scholar links;
4. complete publication list;
5. real Talks & Media entries;
6. current CV PDF.

## Local preview

Because pages load content JSON with JavaScript, do not open `index.html` by double-clicking it. Run a tiny local web server in this folder, for example:

`python3 -m http.server 8000`

and open `http://localhost:8000/`.

## Files for developers

- `content/*.json` — all editable website content.
- `admin/config.yml` — Decap CMS form configuration.
- `site.js` — renders JSON content on the public pages.
- `styles.css` — design.
- `netlify.toml` — Netlify deployment settings.
- `assets/uploads/` — images and PDFs uploaded through the CMS.
