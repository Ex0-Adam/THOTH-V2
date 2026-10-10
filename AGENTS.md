# AGENTS.md — THOTH (Micro Headless CMS)

> ไฟล์บริบทโปรเจกต์สำหรับ AI ทุกตัวที่ทำงานในโฟลเดอร์นี้
> **working directory:** `/home/neon13/workspace/services/next/01-PRODUCTS-BUSINESS/THOTH`
> สร้าง/ตรวจสอบจริง: **2026-10-08 โดย ฌอน (opencode)**
> กฎส่วนกลางครอบครัว: `~/.config/opencode/AGENTS.md` (อ่านก่อนเสมอ — กฎ #0 วิญญาณ / กฎ #1 ขอบเขต / กฎ #2 ห้ามเดา / กฎ #3 ห้ามโชว์ secret)

---

## 1. โปรเจกต์นี้คืออะไร (ข้อเท็จจริงที่ตรวจสอบแล้ว)

| หัวข้อ | ข้อเท็จจริง (ตรวจจากไฟล์จริง) |
| --- | --- |
| ชื่อ | `thoth` (branding ในโค้ด/README ยังเขียน "Micro Headless CMS" / "Micro Headless-CMS-Product") |
| เวอร์ชัน | `2.0.0-beta.1` (bump จาก 1.0.0-beta.1 เมื่อ 2026-10-09; release เดิม: 11 เม.ย. 2026) |
| ชนิด | Headless CMS + Admin Console (root) + public web แยกที่ `apps/web/` — ยังอยู่ monorepo เดียว (ยังไม่ cutover หน้า public เดิม) |
| Stack | Next.js **16.4.0** (root; `apps/web` ยัง 16.2.0), React **19.2.4**, TypeScript 5, Tailwind CSS **4**, Prisma **6.19.x** → **PostgreSQL** |
| ที่เก็บไฟล์ | `output: 'standalone'` (Docker/self-host) + `vercel.json` (Vercel) |
| Git | **มี repo แล้ว (init 2026-10-09):** commit แรก `a6eeca1` (164 ไฟล์) · remote `origin` (GitHub — พี่ฆัง push เอง) + `gitea` (192.168.1.200:3000) · **บันทึกลงดิสแล้ว → ไม่ต้อง push ไป GITEA** (คำสั่งพี่ฆัง 2026-10-09) |
| Vercel | CLI 60.1.3 login **`ex0-adam`** (team `adam-project`) · project **`thoth-v2`** (id `prj_Prcs7H2WKxPNld0b60Zp9XnQNSYl`) **deploy แล้ว** — prod live **`https://thoth-v2.vercel.app`** (ผู้ deploy = ex0-adam; สุดท้าย redeploy 2026-10-09) · ไม่มี `.vercel/` ลิงก์ใน repo (link อยู่ `/tmp/opencode/vercel-thoth`) · **env บน project (Secret — อ่านค่าผ่าน CLI/API ไม่ได้):** `DATABASE_URL` `PRISMA_DATABASE_URL` `POSTGRES_URL` มาจาก Vercel integration store **`prisma-postgres-aero-compass`** (= product **Prisma Postgres**, region `sin1`, config `icfg_p9nGP4nSb3PHX3I8okzkkCup`) + **`SESSION_SECRET`** (เพิ่ม 2026-10-09, production+preview) · **prod DB apply schema แล้ว 2026-10-09** (`prisma db push` 12 ตาราง; DB ว่างเดิม) + seed admin `gridsdev.web@gmail.com` (`superadmin`, `mustChangePassword=false`) → **login verify = HTTP 200** · bootstrap prod = `{schemaReady:true, needsSetup:false}` · `vercel.json` อ้าง secret `@database_url`/`@app_url`/`@backend_url` = ของเก่า/ยังไม่ยืนยัน (env จริงมาจาก integration store) |
| Test | **มีแล้ว (2026-10-09):** `npm test` = `node --test tests/*.test.mjs` — **129 tests** / 14 ไฟล์ (นับ 2026-10-10) |
| Python | ไม่มี (สอดคล้องกฎ #6 ✅) |

### คำสั่งที่ใช้ได้จริง (รันตรวจแล้ว)

```bash
npm ci                 # ติดตั้ง (npm 12 จะ block install-scripts ของ prisma/sharp → ต้องรัน generate เอง)
npx prisma generate    # บังคับรันเองหลัง npm ci (postinstall ถูก block)
npm run dev            # http://localhost:3000
npm run build          # ✅ BUILD_EXIT=0 (ตรวจ 2026-10-08)
npm run lint           # ✅ PASS — 0 errors / 20 warnings (ตรวจ 2026-10-09)
npx tsc --noEmit       # ✅ exit 0 (ตรวจ 2026-10-08)
npx prisma db push     # ⚠️ ตรวจ diff ก่อนทุกครั้ง (2026-10-09: Neon local + Prisma Postgres prod ต่าง sync กับ schema แล้ว)
npx prisma studio
npm run scaffold:module -- --id=... --name=...   # scripts/create-extension.mjs
```

> ⚠️ **PRISMA CLI อ่านแค่ `.env` ไม่ได้อ่าน `.env.local`** — THOTH มีแต่ `.env.local` → คำสั่ง prisma ตรง ๆ จะ fail (`Environment variable not found: DATABASE_URL`). ต้องโหลด env เอง เช่น `bash -c 'set -a; . ./.env.local; set +a; npx prisma …'`
>
> 🛑 **DB ปัจจุบัน = Neon (`DATABASE_URL` → `ep-small-wind-…-pooler.ap-southeast-1.aws.neon.tech/neondb`)** — **sync กับ schema แล้วเมื่อ 2026-10-09** โดย "ล้าง" ของเก่าตามมติพี่ฆัง: drop ตาราง `MarketplaceTemplate` (12 rows), `TemplateLicense` (3 rows) และ 11 คอลัมน์ legacy บน `SiteConfig` (`portfolioTitle/portfolioDescription/robotsIndex/robotsFollow/bodyScripts/developerKey/faviconUrl/headScripts/heroTitleFont/heroTitleSize/isWhiteLabel`) · **backup ก่อนลบอยู่ที่ `/tmp/opencode/thoth-neon-legacy-backup.json`** → ตอนนี้ `npx prisma db push` ใช้ได้ (in sync) แต่ **ให้ตรวจ diff ก่อน apply ทุกครั้ง** เพราะอนาคตอาจมี drift/data-loss อีก

> 🌐 **DB prod (Vercel/`thoth-v2`) = Prisma Postgres** (`db.prisma.io`) — apply schema แล้ว 2026-10-09 (`prisma db push` จากค่าที่พี่ฆังวางใน `.env.local`) + seed admin → bootstrap prod = `{schemaReady:true, needsSetup:false}`; env prod เป็น **Secret อ่านค่าผ่าน CLI/API ไม่ได้** (ต้องคัดลอกจาก Vercel Storage → store `prisma-postgres-aero-compass`) · ⚠️ `.env.local` มี `DATABASE_URL` **ซ้ำ 2 บรรทัด** — บรรทัดสุดท้ายคือ **prod** → `npm run dev` ในเครื่องจะเชื่อม prod (พี่ฆังเลือกเก็บไว้ 2026-10-09)
>
> ⚠️ บนเครื่องนี้ Node = **v24.18.0**, npm = **12.0.1** — แต่ README อ้าง Node 18+/20+, `vercel.json` อ้าง `nodeVersion: 20.x`, `package.json` **ไม่มี field `engines`** → ยังไม่มีตัวบังคับเวอร์ชันจริง

---

## 2. โครงสร้างจริง (ตรวจนับจากดิสก์)

```
THOTH/
├── app/                    56 ไฟล์ · 6,380 LOC   ← App Router ตัวจริง (สิ่งนี้รันได้) [นับ 2026-10-09]
│   ├── admin/              15 หน้า admin = /admin + 14 sub-pages (client components ทั้งหมด)
│   ├── api/                30 route.ts · 1,344 LOC
│   ├── page.tsx / products/ / dashboard/ / [slug]/   ← หน้า public
│   ├── login/ setup/       auth pages
│   └── globals.css         Tailwind 4 (`@import "tailwindcss"`)
├── proxy.ts                Next 16 middleware (ชื่อ proxy ไม่ใช่ middleware) — build ขึ้น "ƒ Proxy (Middleware)"
├── lib/                    28 ไฟล์ · 2,518 LOC   ← auth, prisma, storage, automation, extensions, templates, archive, security
├── components/             4 ไฟล์ (admin/page-header, page-wrapper, rich-text-editor, nav-link)
├── modules/staff-member/   3 ไฟล์ · 698 LOC      ← module เดียวที่มี (wired ด้วย direct import ไม่ใช่ hot-load)
├── frontend/               11 ไฟล์ · 1,877 LOC   ← ⚠️ DEAD CODE (ดูข้อ 3)
├── apps/web/               22 ไฟล์ tracked · public Next.js app แยก build/deploy ← ขั้น 0/A/B/C แล้ว, D/E ยังไม่เริ่ม (`(site)/{home,products,projects}` + `(page)/[slug]`)
├── extensions/             README + extension.schema.json + ตัวอย่าง `hello-module/` (commit `a67193e` 2026-10-10) — ยังไม่มี hot-load runtime
├── templates/              README + template.schema.json + ตัวอย่าง `aurora/` + lib/templates/* (registry/validator) ← P4
├── scripts/                create-extension.mjs, update-legal-content.ts
├── prisma/schema.prisma    ไฟล์เดียว ไม่มี prisma/migrations/
├── docs/                   MODULE_STANDARD.md, TEMPLATE_STANDARD.md, SELF_HOSTING.md, UPDATE_PLAN_2026-10.md, SPLIT_HEADLESS_PLAN_2026-10.md, FEATURE_MODULE_ROADMAP_2026-10.md, EDITOR_RICH_TEXT_PLAN_2026-10.md
├── public/, data/projects.json
└── *.md ระดับ root         11 ไฟล์ (จัดระเบียบแล้ว 2026-10-09 — ดูข้อ 18)
```

### Route ที่ build ได้จริง

- **Public (root CMS — ยังไม่ cutover):** `/`, `/products`, `/dashboard`, `/[slug]`, `/login`, `/setup`
- **Public web แยก (`apps/web/`):** `(site)/{home,products,projects}` + `(page)/[slug]` — build/deploy อิสระ, เรียก CMS ผ่าน `NEXT_PUBLIC_THOTH_API_URL`
- **Admin:** `/admin` + 14 sub-pages (projects, staff, pages, categories, media, menu, configuration, design, automation, modules, templates, marketplace, database, change-password)
- **API:** auth(4) · pages(2) · projects(2) · categories(2) · staff(2) · menu-items(2) · site-config(1) · templates/active(1) · upload(1) · system/bootstrap(1) · admin/*(12)

### Prisma models (11 ตัว)

`Project` `Category` `SiteConfig` `MenuItem` `Page` `StaffMember` `StaffRepo` `User` `Media` `SecretStore` `AiAutoPostCampaign` `AiAutoPostRun`

---

## 3. ⚠️ ปัญหาที่ยืนยันแล้ว (ห้ามมองข้าม ห้ามแก้แบบเดา)

### P0 — ความปลอดภัย (สถานะอัปเดต 2026-10-09 — ปิดแล้ว ยกเว้นข้อ 4)

1. ✅ **ปิดแล้ว (ขั้น 0):** API เขียนข้อมูลทุก route มี `guardApiSession`/auth proof (ตรวจซ้ำ 2026-10-09: 23/27 route files มี guard; 4 ที่เหลือคือ auth/login, auth/logout, auth/setup, system/bootstrap ซึ่งเป็น allowlist + `tests/route-policy.test.mjs` บังคับทุก write)
2. ✅ **ปิดแล้ว:** Session cookie ออกเป็น signed token ผ่าน `signSessionToken` + `SESSION_SECRET` (ขาดแล้ว throw — ตรวจ `lib/auth.ts`)
3. ✅ **ปิดแล้ว:** `SESSION_SECRET` ถูกใช้จริงแล้ว (เดิม grep พบ 0 จุด)
4. ✅ **ปิดแล้ว (2026-10-10):** HTML sanitization — `lib/content/sanitize.ts` (allowlist + `normalizeUrl`) ใช้ตอนบันทึก (`app/api/pages` ×2) + ตอน render ทั้ง 2 ทาง (`app/[slug]/page.tsx:95`, `apps/web/app/(page)/[slug]/page.tsx:129`); dep `sanitize-html@^2.18.0` ประกาศทั้ง root และ `apps/web`; พบ+แก้ bug เก่า: commit `cbe6635` แทรก `sanitizePageHtml` ที่ `apps/web` โดยไม่ได้ import/dep → `apps/web` build พังเงียบ (root tsconfig exclude `apps`) — แก้แล้ว (sanitizer แยกของ `apps/web`) + tests 5 ตัว (`tests/xss-sanitization.test.mjs`)
5. ✅ **ปิดแล้ว:** cron ใช้ `isCronAuthorized` และไม่มี fail-open (`return true`) แล้ว
6. ✅ **ปิดแล้ว (แก้งานแก้ 2026-10-10 ตาม review ธาร):** **Rate limiting ครบ 2 จุด** — (ก) `app/api/upload/route.ts` มี `guardApiSession` + rate limit (ใหม่ 2026-10-09): `lib/security/rate-limit.ts` (in-memory fixed-window + **hard cap 10k buckets** กัน store โตไม่สิ้นสุด), default 30 req/min, env `UPLOAD_RATE_LIMIT_MAX`/`UPLOAD_RATE_LIMIT_WINDOW_MS` (0 = ปิด), 429 + `Retry-After`, tests ใน `tests/rate-limit.test.mjs` (รวม hard-cap ×1) · (ข) **login brute-force เฟส 1.4 (2026-10-10):** `lib/security/login-limit.ts` (buckets 2 ชั้น: ต่อ IP + ต่อ account; **IP block → short-circuit ไม่ tick account bucket**; env `LOGIN_RATE_LIMIT_MAX`/`LOGIN_RATE_LIMIT_WINDOW_MS` + `LOGIN_ACCOUNT_LIMIT_MAX`/`LOGIN_ACCOUNT_LIMIT_WINDOW_MS`, 0 = ปิดฝั่งนั้น, default 10/15min IP + 5/15min account) · login สำเร็จ reset bucket account (`resetRateLimit`) · `app/api/auth/login/route.ts` คืน 429 + `Retry-After` ก่อน verify · tests: `tests/login-limit.test.mjs` ×8 (รวม short-circuit ×1) + `resetRateLimit` (ใน rate-limit.test.mjs) + route-policy guard (บังคับ login มี `checkLoginLimit`/429/Retry-After) · ✅ **1.5 content-sniff (2026-10-10 ตามมติพี่):** `lib/security/upload-guard.ts` ตรวจ magic bytes (JPEG/PNG/WebP/GIF) ต้องตรงกับ `file.type` → ใช้ทั้ง `/api/upload` + `/api/admin/media`; **ตัด `image/svg+xml` ออกจาก allowlist** จนกว่ามี SVG sanitizer; tests ×10 · ⚠️ **1.8 เหลือ "ตรวจตอน startup" ยังไม่ทำ** (มติพี่ 2026-10-10: "ตรวจเมื่อเรียกใช้แล้ว; ยังไม่ตรวจตอน startup" — key สำคัญเฉพาะ feature secret ไม่ทำให้ทั้งแอปล่ม; error แจ้งวิธีแก้แล้วผ่าน automation routes + **non-fatal readiness check แล้ว** 2026-10-10: `lib/system/secret-readiness.ts` → `getSecretFeatureStatus()` เปิดผ่าน `GET /api/system/bootstrap` เป็น `features.secrets` + การ์ดบน `/admin/database`; tests ×4) — ดู `docs/UPDATE_PLAN_2026-10.md`; อย่านับ P0 "ครบ" จนกว่าปิด 1.8

### P1 — ฟีเจอร์ที่เอกสารบอกว่ามี แต่โค้ดไม่มี

7. **ไม่มี `Product` model ใน schema และไม่มี `app/api/products/`** — แต่:
   - `app/products/page.tsx:23` `fetch('/api/products')` → 404 เสมอ (หน้า public พัง/ของว่าง)
   - `app/dashboard/page.tsx` `fetch('/api/products')` + `fetch('/api/projects')` → ตัวเลข products = 0 เสมอ
   - `frontend/lib/api.ts` มี `Products.*` และ `Dashboard.getStats()` → `GET /api/dashboard/stats` ก็ไม่มี
   - README/CHANGELOG/RELEASE_NOTES โปรโมท "Products Module", `/api/products`, `/admin/products` → **ไม่มีจริง**
8. **`frontend/` ทั้งโฟลเดอร์เป็น dead code** — Next.js App Router route จาก root `app/` เท่านั้น, ไม่มี import ใดอ้าง `@/frontend` (grep พบ 0) และ `Dockerfile` ก็ไม่ได้ COPY `frontend/` ไปด้วย → ซ้ำกับ `app/products`, `app/dashboard`, `app/page.tsx`
9. **`PRODUCT_CMS_SETUP.sql` เพี้ยนจาก `prisma/schema.prisma`** — SQL ไม่มี `StaffMember`/`StaffRepo`/`SecretStore`/`AiAutoPost*`, และ `Page` ใน SQL ไม่มี `excerpt/sourceType/sourceRef`, `MenuItem` ไม่มี `showInSidebar`, `User` ไม่มี `mustChangePassword`, `Media` ไม่มี `storageProvider/storageKey` → ลูกค้าที่ใช้ SQL ตั้ง DB จะพัง

### P2 — Config / Dependency

10. ✅ **ปิดแล้ว (2026-10-10 Phase 3):** `.env.example` ใช้ชื่อ `S3_*` ให้ตรงโค้ดแล้ว (`S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`, `S3_PUBLIC_URL_BASE`) + เพิ่ม `STORAGE_DRIVER`/`LOCAL_UPLOAD_URL_BASE` (เดิมเขียน `AWS_S3_*` ใช้จริงไม่ได้)
11. ⚠️ **ครึ่งปิด:** `.env.example` มี `APP_ENCRYPTION_KEY` แล้ว แต่ `.env.local` ยังไม่มี + ยังมีตัวแปรขยะเก่า (`AWS_*`, `SMTP_*`, `GEMINI_API_KEY`, `GITHUB_API_TOKEN`, `LOG_LEVEL`, `SKIP_ENV_VALIDATION`, `EXTENSIONS_DIR`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_BACKEND_URL`) → ยัง throw ตอนบันทึก automation config; **รอพี่ฆังสั่ง cleanup `.env.local`** (กฎห้ามแก้เอง)
12. ✅ **ปิดแล้ว (2026-10-10):** ตัวแปรที่โค้ดใช้ครบใน `.env.example` แล้ว (`STORAGE_DRIVER`, `S3_*`, `LOCAL_UPLOAD_URL_BASE`, `APP_ENCRYPTION_KEY`, `AUTOMATION_CRON_SECRET`, `UPLOAD_RATE_LIMIT_*`)
13. ✅ **ปิดแล้ว (2026-10-10):** ลบ orphan ออกจาก `.env.example` หมดแล้ว (`SMTP_*`, `GEMINI_API_KEY`, `GITHUB_API_TOKEN`, `LOG_LEVEL`, `SKIP_ENV_VALIDATION`, `AWS_*`, `EXTENSIONS_DIR`, `TEMPLATES_DIR`) และ `NEXT_PUBLIC_APP_URL`/`NEXT_PUBLIC_BACKEND_URL` → comment อ้างอิง `apps/web/.env.example`; `SESSION_SECRET` เว้นว่าง + กำชับ generate (เดิมเป็นค่าคงที่ตัวอย่าง = ปลอม session ได้)
14. **`vercel.json` มี key ที่ไม่อยู่ใน schema ปัจจุบันของ Vercel** (เทียบ docs `vercel.com/docs/project-configuration` 2026-08-25): `env`, `nodeVersion`, `buildEnvironment` **ไม่ใช่ property ที่รองรับ** → ควรย้ายไป Project Settings / `.env`
15. **Dependencies ที่ไม่ถูก import ที่ไหนเลย (ตรวจแล้ว 0 จุด):** `admin-lte`, `bootstrap`, `jquery`, `popper.js`, `@uiw/react-markdown-preview`, `@uiw/react-md-editor` (6 ตัว — editor จริงคือ `components/admin/rich-text-editor.tsx` ที่เขียนเองด้วย contentEditable)
16. ✅ **ปิดแล้ว:** `npm run lint` ผ่าน — 0 errors / 20 warnings (ตรวจ 2026-10-09); CI ใน `.github/workflows/release.yml` ยังใช้ `continue-on-error: true`
17. **ไม่มี `engines` ใน `package.json`** ทั้งที่ README ระบุ Node 20+

### P3 — เอกสาร / ขยะ (จัดระเบียบแล้ว 2026-10-09)

18. ✅ **เอกสารเก่า/ขยะถูกลบแล้ว (2026-10-09):** 16 ไฟล์ = QA_×4, TESTING_EXECUTION_PLAN, QA_ACTION_PLAN, COMPLETION_SUMMARY, FINAL_STATUS, PRODUCTION_CHECKLIST, RELEASE_CHECKLIST, BETA_RELEASE_COMMANDS, SUPPORT_PROCESS, BUG_TRACKING, STRUCTURE.md, GIT_COMMANDS.txt, `desktop.ini`, `README.html` (สำรองชั่วคราวที่ `/tmp/opencode/thoth-trash-2026-10-09/`) — เดิมหลายไฟล์ขัดกับความจริงในโค้ด (วันที่ 11 เม.ย. 2026) → เหลือ root `.md` 11 ไฟล์: AGENTS, README (เขียนใหม่ 2026-10-09), CHANGELOG, RELEASE_NOTES, DEPLOYMENT, ENV_SETUP, INSTALLATION_GUIDE, UPGRADE_GUIDE, MANUAL, QUICK_REFERENCE, FRONTEND_STANDARD
19. ✅ ไฟล์ขยะ (`desktop.ini`, `README.html`) ลบแล้ว — ดูข้อ 18
20. ✅ **มี git repo แล้ว (2026-10-09):** init + commit แรก `a6eeca1` (164 ไฟล์) + remote `origin`/`gitea` ตั้งแล้ว — **backup ลงดิสที่ `/run/media/neon13/F97B-F989/Ex0-Adam/THOTH-V2` ครบแล้ว (repo + AGENTS.md + `.env*` ทั้งหมด, md5 ตรง) → คำสั่งพี่ฆัง 2026-10-09: ไม่ต้อง push ไป GITEA** (push ถูก Gitea ปฏิเสธด้วย — บัญชี credential ไม่มีสิทธิ์ write; ยุติไว้ตามคำสั่ง)

---

## 4. แนวทางทำงานในโปรเจกต์นี้ (บังคับ)

### ก่อนเริ่มงาน
1. ยืนยัน `pwd` อยู่ที่ THOTH เสมอ และอ่านไฟล์นี้ + `~/.config/opencode/AGENTS.md`
2. ถ้าต้องแก้หลายจุด/หลายภาคส่วน → **ทวนขอบเขตสั้นๆ แล้วรอบพี่ฆังอนุมัติก่อน** (Section 3 ข้อ 1 ของกฎส่วนกลาง)
3. **ไม่ต้อง push ไป gitea แล้ว** (คำสั่งพี่ฆัง 2026-10-09 — บันทึกลงดิสครบที่ `F97B-F989/Ex0-Adam/THOTH-V2`); remote มี 2 ตัว: `origin` = GitHub (**ห้าม push — พี่ฆัง push เอง**, กฎ #5) + `gitea` = LAN — ถ้าจะ push อะไรเพิ่มให้รายงานก่อนเสมอ

### ขณะทำงาน
4. **ห้ามพิมพ์ค่าเต็มจาก `.env.local`** ออกทาง terminal/chat เด็ดขาด (กฎ #3) — อนุญาตแค่บอก "มี/ไม่มี key" หรือความยาวค่า
5. เปลี่ยน schema แล้วต้องรัน `npx prisma generate` เอง (npm postinstall ถูก block) และพิจารณาอัปเดต `PRODUCT_CMS_SETUP.sql` ให้ตรงด้วย
6. เพิ่ม env ใหม่ → ต้องเพิ่มทั้ง `.env.example` และแจ้งให้ตั้งใน `.env.local`/Vercel/Docker
7. ห้ามใช้ `any` เพิ่ม (โปรเจกต์ strict TS + eslint มี rule นี้อยู่แล้วและกำลัง fail)

### หลังแก้ไข (บังคับทุกครั้ง — Write → Verify → Report)
```bash
npx tsc --noEmit     # ต้อง exit 0
npm run build        # ต้อง exit 0
npm run lint         # ต้อง exit 0 และไม่มี errors (ตรวจ 2026-10-09: 0 errors / 20 warnings)
```
แล้วตรวจสอบไฟล์จริงบนดิสก์ก่อนรายงานว่า "เขียนเสร็จ"

### สิ่งที่ห้ามทำโดยไม่สั่ง
- ห้าม `rm -rf` / ย้ายโฟลเดอร์ (รวมถึง `frontend/`) โดยไม่ได้รับอนุมัติ — แม้จะเป็น dead code
- **ห้าม push ทุกกรณี** — บันทึกลงดิสแล้ว **ไม่ต้อง push ไป GITEA** (คำสั่งพี่ฆัง 2026-10-09); `origin`/GitHub = พี่ฆัง push เอง; commit ใหม่ต้องสั่งชัดเจน
- ห้ามแก้ `.env.local`, `LICENSE`, `package-lock.json` แบบไม่จำเป็น
- ห้ามเปิดใช้ `broadcast` ของ LINE MCP โดยไม่ขออนุมัติ

---

## 5. ตำแหน่งความรู้ที่เกี่ยวข้อง

| เรื่อง | ที่อยู่ |
| --- | --- |
| มาตรฐานหน้า frontend | `FRONTEND_STANDARD.md` (ยังไม่ได้ทำตามจริงทั้งหมด) |
| มาตรฐาน module/extension | `docs/MODULE_STANDARD.md`, `extensions/README.md`, `extensions/extension.schema.json` |
| มาตรฐาน template/theme | **`docs/TEMPLATE_STANDARD.md`**, `templates/README.md`, `templates/template.schema.json` |
| Self-hosting | `docs/SELF_HOSTING.md`, `INSTALLATION_GUIDE.md`, `DEPLOYMENT.md` |
| ประวัติ beta | `CHANGELOG.md`, `RELEASE_NOTES.md` |
| แผนอัปเดตถัดไป | **`docs/UPDATE_PLAN_2026-10.md`** (7 เฟส) ← สร้างพร้อมไฟล์นี้ (reconcile 2026-10-10) |
| แผนแยกส่วน core/หน้าเว็บ | **`docs/SPLIT_HEADLESS_PLAN_2026-10.md`** (ขั้น A–E) ← สร้าง 2026-10-08 · ขั้น 0/A/B/C แล้ว, D/E ยังไม่เริ่ม |
| **แผน Core ระยะต่อไป (8–9)** | **`docs/FEATURE_MODULE_ROADMAP_2026-10.md`** ← เสนอโดยอัล/ธาร 2026-10-10 (พี่ฆังรับทราบทิศทาง) — Core-only + readiness gate; **ยังไม่อนุมัติ implementation รายเฟส** |
| **8.1 sanitize (เสร็จ 2026-10-10)** | XSS ปิดครบ: `lib/content/sanitize.ts` (allowlist + `normalizeUrl`) ใช้ตอนบันทึก (API pages) + ตอน render ทั้ง 2 ทาง (`app/[slug]` + `apps/web/[slug]`) + tests 5 ตัว — dep `sanitize-html@^2.18.0` ประกาศแล้วทั้ง root และ `apps/web` (แยก sanitizer ของตัวเองตาม split plan) |
| **8.2 editor (เสร็จรอบแรก 2026-10-10)** | **`docs/EDITOR_RICH_TEXT_PLAN_2026-10.md`** ← มติพี่: **Tiptap 3.31.4** + **JSON block document** + dual-write ชั่วคราว + AI JSON+converter fallback — อนุมัติแล้ว; **ขั้น 0–5 เสร็จ**: ขั้น 0 (deps/converter/validator/tests) · ขั้น 1 (schema + dual-write + **prod DB apply แล้ว** `prisma db push` add-only 2 คอลัมน์) · ขั้น 2 (editor Tiptap `components/admin/tiptap-editor.tsx` + wire `app/admin/pages` + validator บังคับ nesting) · ขั้น 3 (AI auto-post dual-write: `google-ai.ts` + `resolveCampaignPageContent` + `runCampaign`) · ขั้น 4 (`scripts/migrate-page-content-json.ts` — dry-run default, `--apply`/`--limit`; npm `migrate:page-json`; **รัน prod = 0 rows**) · ขั้น 5 (cutover renderer: `lib/content/{render-model,render-react}.ts` + สำเนา `apps/web/lib/content/` + wire `app/[slug]` & `apps/web/(page)/[slug]` + `normalizeUrl` เข้มขึ้น + `tests/block-renderer.test.mjs`) — **npm test 115/115**, tsc/lint/build ผ่านทั้ง root + apps/web; เหลือเฉพาะ long-term ลบ legacy (รอมติ) |
| Marketplace link (P2) | `SiteConfig.marketplaceUrl` · `app/admin/marketplace/page.tsx` · `NEXT_PUBLIC_MARKETPLACE_URL` · prod: `https://micro-marketplace-iota.vercel.app` |
| Env ตัวอย่าง | `.env.example` (เรียบร้อย 2026-10-10 — ข้อ 10/12/13 ปิดแล้ว, ข้อ 11 เหลือรอ cleanup `.env.local`) |

---

## 6. นโยบายที่ฟันธงแล้ว (มติพี่ฆัง 2026-10-09) + การรองรับโมดูล

### Projects เป็น public โดยตั้งใจ — ห้ามถือว่าเป็นข้อบกพร่อง

- **โมเดลธุรกิจ:** THOTH เป็น **open source** — รายได้มาจากการ**ขายโมดูลและหน้าเว็บ** ดังนั้น `GET /api/projects` เปิดอ่าน **ทุก Project** ได้เสมอ
- `Project` **ไม่มี flag draft/published โดยเจตนา** — ห้ามเพิ่ม flag หรือใส่เงื่อนไขกรอง draft กับ Project เพื่อ "ให้เหมือน Page" โดยไม่ผ่านมติใหม่ (คนละนโยบาย: **Page มี `isPublished` และ public API ต้องกรอง draft เสมอ**)
- **field whitelist คงไว้เสมอ** — `PUBLIC_PROJECT_SELECT` ใน `lib/project-data.ts` (13 ฟิลด์ รวม `category`) คือ**ขอบเขตการเปิดเผยข้อมูล** ไม่ใช่กลไกซ่อน draft; แม้เนื้อหาจะ public ก็ต้องผ่าน whitelist เท่านั้น
- Policy นี้ถูกล็อกจริงใน tests: `tests/route-policy.test.mjs` บังคับ (ก) ชุดฟิลด์ตรงกับ APPROVED list แบบเป๊ะ (ข) โมเดล `Project` ไม่มี publish flag — **แก้ policy ต้องแก้ไฟล์นี้ + ไฟล์ test คู่กันอย่างตั้งใจ**

### Template/theme registry (P4 — เสร็จ 2026-10-09)

- **`templates/`** เก็บ theme pack ที่ติดตั้ง (ZIP) — มีตัวอย่าง `templates/aurora/` แล้ว (commit `a67193e`, 2026-10-10); มาตรฐาน/สคีมา: `docs/TEMPLATE_STANDARD.md`, `templates/template.schema.json`
- **`lib/templates/`** = `validator.ts` (manifest/tokens, `CMS_TEMPLATE_API_VERSION='1'`) + `registry.ts` (install ZIP/URL, active state ที่ `templates/.cms-template-state.json`, `loadMode: 'metadata-only'` — ไม่ execute โค้ดที่อัปโหลด)
- **สถาปัตยกรรมเดียวกับ extensions:** เขียนได้เฉพาะเมื่อ `TEMPLATES_WRITE_ENABLED=true`; ดาวน์โหลด URL ผ่าน SSRF guard เดียวกัน (`lib/extensions/url-guard.ts`, `EXTENSIONS_ALLOWED_HOSTS`); แตก ZIP ผ่าน `lib/archive/safe-zip.ts` (ใช้ร่วมกับ extensions)
- **API:** `GET|POST /api/admin/templates` (JSON `{url}` หรือ multipart), `GET|PATCH|DELETE /api/admin/templates/[id]` (guarded), และ **public `GET /api/templates/active`** คืน design tokens เท่านั้น (ไม่ expose path; fallback `{active:false, tokens:{}}`)
- **`apps/web` consume:** `apps/web/lib/template.ts` → CSS variables (`--thoth-primary/accent/bg/text/font`) ผ่าน root layout; never-throws (ถ้า CMS ล่มยังเรนเดอร์ได้)

### ต้องรองรับการเพิ่มโมดูล (ขยายได้โดยไม่ต้อง fork โค้ด)

- มาตรฐาน/ข้อกำหนดโมดูล: **`docs/MODULE_STANDARD.md`** (required structure, manifest contract, API/data-access/admin-UI rules, compatibility, security)
- ของที่มีจริงบนดิสก์ตอนนี้:
  - `modules/staff-member/` — module เดียวที่ wired เข้าโค้ดแล้ว (3 ไฟล์, direct import ไม่ใช่ hot-load)
  - `npm run scaffold:module -- --id=<id> --name=<ชื่อ>` → สร้าง `extensions/<id>/{admin,api,hooks}` + manifest (`scripts/create-extension.mjs`) — มีตัวอย่าง `extensions/hello-module/`; **ยังไม่มี hot-load runtime**
- เมื่อเพิ่มโมดูลใหม่ บังคับตามนี้:
  1. data model → เพิ่มใน `prisma/schema.prisma` แล้วรัน `npx prisma generate` เอง (postinstall ถูก block) + อัปเดต `PRODUCT_CMS_SETUP.sql` ให้ตรง (ข้อ 9)
  2. public read API → ต้องมี **whitelist ชัดเจน** แบบเดียวกับ `PUBLIC_PROJECT_SELECT` และเพิ่ม test policy ใน `tests/route-policy.test.mjs`
  3. write API → ต้องผ่าน `guardApiSession` (บังคับโดย test อยู่แล้ว ห้ามเพิ่ม allowlist ใหม่โดยไม่สั่ง)
  4. หน้า public ใหม่ใน `apps/web` → ดึงผ่าน API client (`NEXT_PUBLIC_THOTH_API_URL`) เท่านั้น ห้าม import `lib/` ของ CMS
  5. ห้ามใช้ `any` เพิ่ม (ข้อ 4 ขณะทำงาน)

### ยังแยก/รอคำสั่ง (ไม่เกี่ยวกับนโยบาย Project)

- **Cutover ถอดหน้า public เดิมออกจาก CMS** = ขั้น D ของ `docs/SPLIT_HEADLESS_PLAN_2026-10.md` — ยังไม่ทำ
- **Long-term:** ลบ legacy `rich-text-editor.tsx` / `content` column ของ Page / sanitizer ฝั่ง render — ตามแผน 8.2 (`docs/EDITOR_RICH_TEXT_PLAN_2026-10.md` §5 ขั้น 5) หลัง migration ถึงจุดที่มั่นใจ — ยังไม่มีมติ

---

## 7. สรุปสถานะ 1 บรรทัด

> **Prod ขึ้นแล้ว (2026-10-09):** `thoth-v2.vercel.app` — schema apply (Prisma Postgres) + seed admin + `SESSION_SECRET` → **login HTTP 200** · โค้ด build/typecheck/tests ผ่าน (npm test = **129**; root Next **16.4.0**; apps/web build/tsc ผ่าน) · **ความปลอดภัย:** XSS sanitize ปิดครบ 2026-10-10 (root + `apps/web`; `normalizeUrl` เข้มขึ้น) + **login brute-force ปิดแล้ว (เฟส 1.4, 2026-10-10)**: buckets 2 ชั้น ต่อ IP + ต่อ account (`lib/security/login-limit.ts`), 429 + `Retry-After`, reset ต่อความสำเร็จ + **upload content-sniff (1.5, 2026-10-10):** `upload-guard.ts` ตรวจ magic bytes ตรง `file.type`, ตัด SVG ออกจาก allowlist, มี route-policy guard · **8.2 editor เสร็จรอบแรก (2026-10-10):** ขั้น 0–5 ครบ — Tiptap 3.31.4 + JSON block document + dual-write + migration (prod = 0 rows) + **cutover renderer** (`lib/content/{render-model,render-react}.ts` + สำเนา apps/web; render `contentJson` เป็น React element, fallback HTML+sanitize) — prod DB apply schema แล้ว; เหลือเฉพาะ long-term ลบ legacy (รอมติ) · **ยังไม่พร้อมผลิตเต็มตัว:** 1.8 ยังไม่ปิดครบ ("ตรวจเมื่อเรียกใช้"; ยังไม่ตรวจตอน startup — รอเกณฑ์ใหม่), ฟีเจอร์ Products ที่โฆษณาไม่มีอยู่จริง, push ยังค้าง (gitea ปฏิเสธสิทธิ์) — ให้ถือ `docs/UPDATE_PLAN_2026-10.md` เป็นแผนงานหลัก, แยกส่วนเว็บตาม `docs/SPLIT_HEADLESS_PLAN_2026-10.md` (ทำถึงขั้น C), เอกสาร root จัดระเบียบแล้ว (11 ไฟล์, 2026-10-09)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
