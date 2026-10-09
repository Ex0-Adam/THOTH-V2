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
| ชนิด | Headless CMS + Admin Console + Public pages ใน Next.js App Router เดียว |
| Stack | Next.js **16.2.0**, React **19.2.4**, TypeScript 5, Tailwind CSS **4**, Prisma **6.19.x** → **PostgreSQL** |
| ที่เก็บไฟล์ | `output: 'standalone'` (Docker/self-host) + `vercel.json` (Vercel) |
| Git | **มี repo แล้ว (init 2026-10-09):** commit แรก `a6eeca1` (164 ไฟล์) · remote `origin` (GitHub — พี่ฆัง push เอง) + `gitea` (192.168.1.200:3000) · **บันทึกลงดิสแล้ว → ไม่ต้อง push ไป GITEA** (คำสั่งพี่ฆัง 2026-10-09) |
| Vercel | CLI 60.1.3 login **`ex0-adam`** (team `adam-project`) · project **`thoth-v2`** (id `prj_Prcs7H2WKxPNld0b60Zp9XnQNSYl`) **deploy แล้ว** — prod live **`https://thoth-v2.vercel.app`** (ผู้ deploy = ex0-adam; สุดท้าย redeploy 2026-10-09) · ไม่มี `.vercel/` ลิงก์ใน repo (link อยู่ `/tmp/opencode/vercel-thoth`) · **env บน project (Secret — อ่านค่าผ่าน CLI/API ไม่ได้):** `DATABASE_URL` `PRISMA_DATABASE_URL` `POSTGRES_URL` มาจาก Vercel integration store **`prisma-postgres-aero-compass`** (= product **Prisma Postgres**, region `sin1`, config `icfg_p9nGP4nSb3PHX3I8okzkkCup`) + **`SESSION_SECRET`** (เพิ่ม 2026-10-09, production+preview) · **prod DB apply schema แล้ว 2026-10-09** (`prisma db push` 12 ตาราง; DB ว่างเดิม) + seed admin `gridsdev.web@gmail.com` (`superadmin`, `mustChangePassword=false`) → **login verify = HTTP 200** · bootstrap prod = `{schemaReady:true, needsSetup:false}` · `vercel.json` อ้าง secret `@database_url`/`@app_url`/`@backend_url` = ของเก่า/ยังไม่ยืนยัน (env จริงมาจาก integration store) |
| Test | **มีแล้ว (2026-10-09):** `npm test` = `node --test tests/*.test.mjs` (route-policy + session + rate-limit) — 59 tests |
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
├── extensions/             มีแค่ README + extension.schema.json (ยังไม่มี extension จริง)
├── templates/              README.md + template.schema.json + lib/templates/* (registry/validator) ← P4, ยังไม่มี template จริง
├── scripts/                create-extension.mjs, update-legal-content.ts
├── prisma/schema.prisma    ไฟล์เดียว ไม่มี prisma/migrations/
├── docs/                   MODULE_STANDARD.md, TEMPLATE_STANDARD.md, SELF_HOSTING.md, UPDATE_PLAN_2026-10.md, SPLIT_HEADLESS_PLAN_2026-10.md
├── public/, data/projects.json
└── *.md ระดับ root         11 ไฟล์ (จัดระเบียบแล้ว 2026-10-09 — ดูข้อ 18)
```

### Route ที่ build ได้จริง

- **Public:** `/`, `/products`, `/dashboard`, `/[slug]`, `/login`, `/setup`
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
4. ⚠️ **เหลือ — HTML sanitization:** `dangerouslySetInnerHTML` กับ `page.content` ยังไม่ sanitize ทั้ง 2 จุด (`app/[slug]/page.tsx:94`, `apps/web/app/(page)/[slug]/page.tsx:128`) — คนนอกเขียน content ไม่ได้แล้ว (เขียนผ่าน session เท่านั้น) แต่ **admin ที่ถูกบุกรุกหรือ XSS ข้ามpath ยังยิงสคริปต์หน้า public ได้** → รอพี่ฆังตัดสินเรื่อง sanitizer
5. ✅ **ปิดแล้ว:** cron ใช้ `isCronAuthorized` และไม่มี fail-open (`return true`) แล้ว
6. ✅ **ปิดแล้ว:** `app/api/upload/route.ts` มี `guardApiSession` + **rate limit** (ใหม่ 2026-10-09): `lib/security/rate-limit.ts` (in-memory fixed-window) · บัคเก็ตต่อ user/IP · default 30 req/min · env `UPLOAD_RATE_LIMIT_MAX` / `UPLOAD_RATE_LIMIT_WINDOW_MS` (0 = ปิด) · ตอบ 429 + `Retry-After` · tests 7 ตัวใน `tests/rate-limit.test.mjs`

### P1 — ฟีเจอร์ที่เอกสารบอกว่ามี แต่โค้ดไม่มี

7. **ไม่มี `Product` model ใน schema และไม่มี `app/api/products/`** — แต่:
   - `app/products/page.tsx:23` `fetch('/api/products')` → 404 เสมอ (หน้า public พัง/ของว่าง)
   - `app/dashboard/page.tsx` `fetch('/api/products')` + `fetch('/api/projects')` → ตัวเลข products = 0 เสมอ
   - `frontend/lib/api.ts` มี `Products.*` และ `Dashboard.getStats()` → `GET /api/dashboard/stats` ก็ไม่มี
   - README/CHANGELOG/RELEASE_NOTES โปรโมท "Products Module", `/api/products`, `/admin/products` → **ไม่มีจริง**
8. **`frontend/` ทั้งโฟลเดอร์เป็น dead code** — Next.js App Router route จาก root `app/` เท่านั้น, ไม่มี import ใดอ้าง `@/frontend` (grep พบ 0) และ `Dockerfile` ก็ไม่ได้ COPY `frontend/` ไปด้วย → ซ้ำกับ `app/products`, `app/dashboard`, `app/page.tsx`
9. **`PRODUCT_CMS_SETUP.sql` เพี้ยนจาก `prisma/schema.prisma`** — SQL ไม่มี `StaffMember`/`StaffRepo`/`SecretStore`/`AiAutoPost*`, และ `Page` ใน SQL ไม่มี `excerpt/sourceType/sourceRef`, `MenuItem` ไม่มี `showInSidebar`, `User` ไม่มี `mustChangePassword`, `Media` ไม่มี `storageProvider/storageKey` → ลูกค้าที่ใช้ SQL ตั้ง DB จะพัง

### P2 — Config / Dependency

10. **ตัวแปร S3 ชื่อไม่ตรงกัน:** โค้ดเรียก `S3_ENDPOINT` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_BUCKET` / `S3_REGION` แต่ `.env.example` เขียน `AWS_S3_*` → **เอกสารใช้ไม่ได้จริง** (`lib/storage/s3.ts` throw ถ้าไม่ครบ)
11. **`APP_ENCRYPTION_KEY` จำเป็นต่อ `lib/security/secrets.ts` แต่ไม่มีใน `.env.example` และ `.env.local`** → บันทึก Gemini API key ผ่าน `/api/admin/automation/config` จะ throw ตอน runtime
12. **ตัวแปรที่โค้ดใช้แต่ไม่มีใน `.env.example` (อัปเดต 2026-10-09 — `APP_ENCRYPTION_KEY`, `AUTOMATION_CRON_SECRET` เพิ่มแล้ว; เพิ่ม `TEMPLATES_DIR` + `TEMPLATES_WRITE_ENABLED` ในบล็อก Templates Configuration แล้ว):** `STORAGE_DRIVER`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE`, `S3_PUBLIC_URL_BASE`, `LOCAL_UPLOAD_URL_BASE`
13. **ตัวแปรใน `.env.example` ที่โค้ดไม่ได้ใช้ (`SESSION_SECRET` ตัดออกแล้ว — ถูกใช้จริง):** `SMTP_*`, `GEMINI_API_KEY`, `GITHUB_API_TOKEN`, `LOG_LEVEL`, `SKIP_ENV_VALIDATION`, `AWS_*`
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
| แผนอัปเดตถัดไป | **`docs/UPDATE_PLAN_2026-10.md`** (7 เฟส) ← สร้างพร้อมไฟล์นี้ |
| แผนแยกส่วน core/หน้าเว็บ | **`docs/SPLIT_HEADLESS_PLAN_2026-10.md`** (ขั้น A–E) ← สร้าง 2026-10-08 |
| Marketplace link (P2) | `SiteConfig.marketplaceUrl` · `app/admin/marketplace/page.tsx` · `NEXT_PUBLIC_MARKETPLACE_URL` · prod: `https://micro-marketplace-iota.vercel.app` |
| Env ตัวอย่าง | `.env.example` (ยังมีช่องว่าง/ชื่อผิด ตามข้อ 10–13) |

---

## 6. นโยบายที่ฟันธงแล้ว (มติพี่ฆัง 2026-10-09) + การรองรับโมดูล

### Projects เป็น public โดยตั้งใจ — ห้ามถือว่าเป็นข้อบกพร่อง

- **โมเดลธุรกิจ:** THOTH เป็น **open source** — รายได้มาจากการ**ขายโมดูลและหน้าเว็บ** ดังนั้น `GET /api/projects` เปิดอ่าน **ทุก Project** ได้เสมอ
- `Project` **ไม่มี flag draft/published โดยเจตนา** — ห้ามเพิ่ม flag หรือใส่เงื่อนไขกรอง draft กับ Project เพื่อ "ให้เหมือน Page" โดยไม่ผ่านมติใหม่ (คนละนโยบาย: **Page มี `isPublished` และ public API ต้องกรอง draft เสมอ**)
- **field whitelist คงไว้เสมอ** — `PUBLIC_PROJECT_SELECT` ใน `lib/project-data.ts` (13 ฟิลด์ รวม `category`) คือ**ขอบเขตการเปิดเผยข้อมูล** ไม่ใช่กลไกซ่อน draft; แม้เนื้อหาจะ public ก็ต้องผ่าน whitelist เท่านั้น
- Policy นี้ถูกล็อกจริงใน tests: `tests/route-policy.test.mjs` บังคับ (ก) ชุดฟิลด์ตรงกับ APPROVED list แบบเป๊ะ (ข) โมเดล `Project` ไม่มี publish flag — **แก้ policy ต้องแก้ไฟล์นี้ + ไฟล์ test คู่กันอย่างตั้งใจ**

### Template/theme registry (P4 — เสร็จ 2026-10-09)

- **`templates/`** เก็บ theme pack ที่ติดตั้ง (ZIP) — ยังไม่มี template จริงบนดิสก์; มาตรฐาน/สคีมา: `docs/TEMPLATE_STANDARD.md`, `templates/template.schema.json`
- **`lib/templates/`** = `validator.ts` (manifest/tokens, `CMS_TEMPLATE_API_VERSION='1'`) + `registry.ts` (install ZIP/URL, active state ที่ `templates/.cms-template-state.json`, `loadMode: 'metadata-only'` — ไม่ execute โค้ดที่อัปโหลด)
- **สถาปัตยกรรมเดียวกับ extensions:** เขียนได้เฉพาะเมื่อ `TEMPLATES_WRITE_ENABLED=true`; ดาวน์โหลด URL ผ่าน SSRF guard เดียวกัน (`lib/extensions/url-guard.ts`, `EXTENSIONS_ALLOWED_HOSTS`); แตก ZIP ผ่าน `lib/archive/safe-zip.ts` (ใช้ร่วมกับ extensions)
- **API:** `GET|POST /api/admin/templates` (JSON `{url}` หรือ multipart), `GET|PATCH|DELETE /api/admin/templates/[id]` (guarded), และ **public `GET /api/templates/active`** คืน design tokens เท่านั้น (ไม่ expose path; fallback `{active:false, tokens:{}}`)
- **`apps/web` consume:** `apps/web/lib/template.ts` → CSS variables (`--thoth-primary/accent/bg/text/font`) ผ่าน root layout; never-throws (ถ้า CMS ล่มยังเรนเดอร์ได้)

### ต้องรองรับการเพิ่มโมดูล (ขยายได้โดยไม่ต้อง fork โค้ด)

- มาตรฐาน/ข้อกำหนดโมดูล: **`docs/MODULE_STANDARD.md`** (required structure, manifest contract, API/data-access/admin-UI rules, compatibility, security)
- ของที่มีจริงบนดิสก์ตอนนี้:
  - `modules/staff-member/` — module เดียวที่ wired เข้าโค้ดแล้ว (3 ไฟล์, direct import ไม่ใช่ hot-load)
  - `npm run scaffold:module -- --id=<id> --name=<ชื่อ>` → สร้าง `extensions/<id>/{admin,api,hooks}` + manifest (`scripts/create-extension.mjs`) — **`extensions/` ยังไม่มี extension จริง ยังไม่มี hot-load runtime**
- เมื่อเพิ่มโมดูลใหม่ บังคับตามนี้:
  1. data model → เพิ่มใน `prisma/schema.prisma` แล้วรัน `npx prisma generate` เอง (postinstall ถูก block) + อัปเดต `PRODUCT_CMS_SETUP.sql` ให้ตรง (ข้อ 9)
  2. public read API → ต้องมี **whitelist ชัดเจน** แบบเดียวกับ `PUBLIC_PROJECT_SELECT` และเพิ่ม test policy ใน `tests/route-policy.test.mjs`
  3. write API → ต้องผ่าน `guardApiSession` (บังคับโดย test อยู่แล้ว ห้ามเพิ่ม allowlist ใหม่โดยไม่สั่ง)
  4. หน้า public ใหม่ใน `apps/web` → ดึงผ่าน API client (`NEXT_PUBLIC_THOTH_API_URL`) เท่านั้น ห้าม import `lib/` ของ CMS
  5. ห้ามใช้ `any` เพิ่ม (ข้อ 4 ขณะทำงาน)

### ยังแยก/รอคำสั่ง (ไม่เกี่ยวกับนโยบาย Project)

- **HTML sanitization** ของ `page.content` ก่อนแสดงผลสาธารณะ (ยัง `dangerouslySetInnerHTML` ไม่ sanitize ทั้ง 2 จุด) — รอพี่ฆังตัดสิน
- **Cutover ถอดหน้า public เดิมออกจาก CMS** = ขั้น D ของ `docs/SPLIT_HEADLESS_PLAN_2026-10.md` — ยังไม่ทำ

---

## 7. สรุปสถานะ 1 บรรทัด

> **Prod ขึ้นแล้ว (2026-10-09):** `thoth-v2.vercel.app` — schema apply (Prisma Postgres) + seed admin + `SESSION_SECRET` → **login HTTP 200** · โค้ด build/typecheck/tests ผ่าน (npm test = 59) แต่**ยังไม่พร้อมผลิตเต็มตัว:** HTML sanitization ยังไม่มี, ฟีเจอร์ Products ที่โฆษณาไม่มีอยู่จริง, push ยังค้าง (gitea ปฏิเสธสิทธิ์) — ให้ถือ `docs/UPDATE_PLAN_2026-10.md` เป็นแผนงานหลัก, แยกส่วนเว็บตาม `docs/SPLIT_HEADLESS_PLAN_2026-10.md` (ทำถึงขั้น C), เอกสาร root จัดระเบียบแล้ว (11 ไฟล์, 2026-10-09)
