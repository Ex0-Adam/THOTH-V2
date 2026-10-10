# แผนอัปเดต THOTH — ทุกภาคส่วน (เตรียมงาน)

> จัดทำ: **2026-10-08 โดย ฌอน (opencode)** จากการตรวจสอบโค้ดจริงทั้งโปรเจกต์
> สถานะเอกสาร (reconcile **2026-10-10** เทียบ `docs/FEATURE_MODULE_ROADMAP_2026-10.md` §0): **ทำแล้วบางส่วน — เฟส 1 ยังไม่นับปิดครบ** (✅ 1.1–1.7 · ⚠️ 1.8 "ตรวจเมื่อเรียกใช้แล้ว; ยังไม่ตรวจตอน startup" — ไม่นับปิดครบตามเกณฑ์เดิม)**, เฟส 2 เหลือเฉพาะงานที่ต้องเลือกทาง, เฟส 3 ทำ 3.1/3.3, เฟส 5 ทำทั้งหมด, เฟส 6.1 = `node --test` **125 tests**, เฟส 7 = มี repo แล้ว; **เฟส 2 (ทางเลือก), 4 ยังไม่เริ่ม** — งานที่เหลือยังรอพี่ฆังอนุมัติทุกข้อ
> แผน Core ระยะต่อไป (ความปลอดภัย/โครงสร้าง) อยู่ที่ `docs/FEATURE_MODULE_ROADMAP_2026-10.md` (เฟส 8–9) — **ยังไม่อนุมัติ implementation รายเฟส**
> อ้างอิงปัญหา: ดู `AGENTS.md` ข้อ 3 (P0–P3)
> ⚠️ กฎบังคับ: ห้ามเริ่มเฟสใดโดยไม่ได้รับอนุมัติ · ห้ามแก้ `.env.local` · ห้าม commit/push

---

## 0. Baseline (วัด 2026-10-08 · reconcile 2026-10-10)

| รายการ | ผลลัพธ์จริง |
| --- | --- |
| `npm ci` | ผ่าน (645 packages) — แต่ npm 12 block install-scripts → ต้องรัน `npx prisma generate` เอง |
| `npx tsc --noEmit` | ✅ exit 0 |
| `npm run build` | ✅ exit 0 |
| `npm run lint` | ✅ 0 errors / 20 warnings (reconcile 2026-10-10; เดิม 30 errors / 22 warnings) |
| git | ✅ repo (init 2026-10-09) — commit แรก `a6eeca1` · remote `origin` (GitHub — พี่ฆัง push เอง) + `gitea` (LAN) · **ไม่ push** |
| การทดสอบ | ✅ **115 tests** ผ่าน (`node --test tests/*.test.mjs` — 12 ไฟล์); วัด 2026-10-08 = ไม่มีเลย |
| API route files | 30 (`app/api/**/route.ts`) |
| หน้า public พัง | ⚠️ **ยังไม่แก้** — `app/products/page.tsx:23` + `app/dashboard/page.tsx:20` เรียก `/api/products` ที่ไม่มีอยู่ (ไม่มี `app/api/products/`) |

**เป้าหมายรวม:** ทำให้ lint ผ่าน, ปิดช่องโหว่ P0, ให้เอกสาร/โค้ด/DB ตรงกัน, มี test อย่างน้อย smoke, มี git repo + remote ตามที่พี่ฆังสั่ง

> **Baseline ที่เป็นทางการ (2026-10-10):** ดู `docs/FEATURE_MODULE_ROADMAP_2026-10.md` §0 — ลำดับงาน Core = baseline → XSS → migration strategy → Webhooks → RBAC → Revision (ต้องทวนขอบเขตและรออนุมัติเป็นรายเฟส)

---

## เฟส 1 — P0 ความปลอดภัย (ทำก่อนสิ่งอื่น)

| # | งาน | ไฟล์ที่กระทบ | เสร็จเมื่อ / สถานะ |
| --- | --- | --- | --- |
| 1.1 | สร้าง guard ส่วนกลาง `requireApiAuth()` (ตรวจ session cookie + ลายเซ็น + expiry) แล้วครอบทุก route ที่มี `POST/PATCH/DELETE` | `lib/auth.ts` + ทุก `app/api/**/route.ts` (≈20 ไฟล์) | ✅ 2026-10-09 — `guardApiSession` ใน 21 route files + `tests/route-policy.test.mjs` บังคับทุก write (acceptance: POST ไม่มี cookie → 401) |
| 1.2 | ขยาย `proxy.ts` matcher ให้ครอบ `/api/*` ด้วย (หรือย้ายการตรวจไปฝั่ง handler ล้วน — เลือกทางเดียวให้ชัด) | `proxy.ts` | ✅ 2026-10-09 — ทั้งคู่: proxy matcher มี `/api/:path*` + handler-level guard |
| 1.3 | เปลี่ยน session จาก `user.id` เปล่า → token ที่เซ็นด้วย `SESSION_SECRET` (HMAC หรือ JWT) + ตรวจ expiry ฝั่ง server | `lib/auth.ts`, `proxy.ts` | ✅ 2026-10-09 — `signSessionToken` (ขาด `SESSION_SECRET` → throw) |
| 1.4 | เพิ่ม rate limit + lockout ที่ `POST /api/auth/login` (ตอนนี้ brute-force ได้ไม่จำกัด) | `app/api/auth/login/route.ts` + `lib/security/login-limit.ts` | ✅ 2026-10-10 — buckets 2 ชั้น (ต่อ IP + ต่อ account) บน `lib/security/rate-limit.ts` · env `LOGIN_RATE_LIMIT_MAX`/`WINDOW_MS` + `LOGIN_ACCOUNT_LIMIT_MAX`/`WINDOW_MS` (0 = ปิด, default 10/15min IP + 5/15min account) · 429 + `Retry-After` ก่อน verify · success reset bucket account · tests `login-limit.test.mjs` + route-policy guard |
| 1.5 | `POST /api/upload`: ต้อง auth + จำกัดจำนวน/ความถี่ + **ตรวจชนิดไฟล์จากเนื้อหาจริง** (ไม่เชื่อ MIME ที่ client ส่ง) | `app/api/upload/route.ts`, `app/api/admin/media/route.ts`, `lib/security/upload-guard.ts` | ✅ 2026-10-10 ตามมติพี่ (ตัด scope): auth ✅ + rate limit ✅ (2026-10-09) + **content-sniff จาก magic bytes** (JPEG `FFD8FF` / PNG / WebP `RIFF…WEBP` / GIF `GIF8`) — ต้องตรงกับ `file.type` ที่ client แจ้ง ไม่ตรง → 400 `File content does not match its declared type` (`lib/security/upload-guard.ts`, ใช้ทั้ง `/api/upload` + `/api/admin/media`) · **ตัด `image/svg+xml` ออกจาก allowlist แล้ว** (จนกว่าจะมี SVG sanitizer ที่เชื่อถือได้) · tests `tests/upload-guard.test.mjs` ×10 · **"ตรวจ content ซ้ำ (dedup)" ย้ายเป็นงาน P2/ปรับปรุง storage** — ทำเมื่อมีเหตุผลด้านพื้นที่/ค่าใช้จ่าย โดยต้องกำหนดวิธีนับซ้ำและผลเมื่อพบไฟล์ซ้ำให้ชัดก่อน (มติพี่ 2026-10-10) |
| 1.6 | `AUTOMATION_CRON_SECRET`: บังคับตั้งค่า (ถ้าว่าง → ปฏิเสธทุก request) + เพิ่มลง `.env.example` | `app/api/admin/automation/cron/route.ts`, `.env.example` | ✅ 2026-10-09 — `isCronAuthorized` fail-closed + key อยู่ใน `.env.example` แล้ว |
| 1.7 | Sanitize HTML ก่อน render (`dangerouslySetInnerHTML` ใน `app/[slug]/page.tsx`) – ใช้ sanitizer ฝั่ง server ตอนบันทึก หรือตอน render | `app/[slug]/page.tsx` + จุดอื่นที่เจอ | ✅ 2026-10-10 — สำเร็จผ่าน **Core เฟส 8.1** (sanitize-html allowlist + `normalizeUrl`) ใช้ตอนบันทึก (`app/api/pages` ×2) + ตอน render ทั้ง 2 ทาง (`app/[slug]` + `apps/web/[slug]`); tests `tests/xss-sanitization.test.mjs` ×5; dep ประกาศทั้ง root + `apps/web`; bug เก่า `cbe6635` (apps/web แทรก sanitizer ไม่ import – root tsconfig exclude `apps` → build พังเงียบ) แก้แล้ว |
| 1.8 | เพิ่ม `APP_ENCRYPTION_KEY` ลง `.env.example` + **ตรวจเมื่อเรียกใช้** ว่ามีค่า (ตอนนี้ automation บันทึก key จะ throw) | `.env.example`, `lib/security/secrets.ts` | ⚠️ ตามมติพี่ 2026-10-10: **"ตรวจเมื่อเรียกใช้แล้ว; ยังไม่ตรวจตอน startup"** — env อยู่ใน `.env.example` ✅ + `getKey()` throw เมื่อเรียก `encrypt/decryptSecret` แต่ไม่มี key ✅ (2026-10-09) + error ที่ throw ถูกส่งให้ผู้ใช้เห็นผ่าน `{ error: message }` ของ automation routes (บอกวิธีแก้: ต้องตั้ง `APP_ENCRYPTION_KEY`) · **ยังไม่ทำ startup fail-fast** — key จำเป็นเฉพาะฟีเจอร์ secret (SecretStore/automation) ไม่ใช่ทั้งแอป จึงปล่อยให้แอปวิ่ง แต่ฟีเจอร์ secret ปฏิเสธชัดเจน; fail-fast ตอน startup จะค่อยพิจารณาเมื่อ SecretStore ถูกกำหนดเป็น feature บังคับของทุก deployment + ตั้ง key ครบทุก environment แล้ว · **ยังไม่นับปิดครบตามเกณฑ์ startup-check เดิม** |

**อนุมัติเฉพาะเฟส 1 ก่อน** แล้วค่อยไปเฟส 2 — เพราะ 1.1–1.3 เปลี่ยนพฤติกรรม auth ทั้งระบบ

---

## เฟส 2 — ฟีเจอร์ / พื้นผิวที่เสีย

| # | งาน | ทางเลือก (ต้องเลือกอย่างใดอย่างหนึ่ง) |
| --- | --- | --- |
| 2.1 | `/products` + `/dashboard` พัง (เรียก API ที่ไม่มี) | **(ก)** สร้าง `Product` model + `/api/products` + `/api/dashboard/stats` ให้ตรงที่โฆษณา หรือ **(ข)** ลบหน้า `app/products`, `app/dashboard` + ตัดคำโปรโมท Products ออกจาก README/CHANGELOG |
| 2.2 | `frontend/` เป็น dead code 1,877 LOC | **(ก)** ลบ (ขอล่วงหน้า) **(ข)** ย้ายของที่ยังใช้เข้า `app/` แล้วลบ **(ค)** ปล่อยไว้ + ตัดออกจาก tsconfig/eslint ไม่ให้เป็นภาระ |
| 2.3 | `modules/` มีแค่ `staff-member` แต่ README อ้าง `projects/products/staff/pages` | ปรับ `MODULE_STANDARD.md` + README ให้ตรง หรือ scaffold module ที่ขาด |
| 2.4 | `extensions/` ยังไม่มี extension จริง | ✅ มีตัวอย่างแล้ว `extensions/hello-module/` (commit `a67193e`, 2026-10-10) — ยังไม่มี hot-load runtime; ดู `docs/MODULE_STANDARD.md` |
| 2.5 | Rich-text editor เป็น contentEditable เขียนเอง (262 บรรทัด) — ไม่มี sanitization | ประเมินแทน: คงไว้ + เพิ่ม sanitize ตอนบันทึก, หรือสลับเป็น library ที่ maintain |

---

## เฟส 3 — Config / Dependency / Deploy

| # | งาน | หมายเหตุ |
| --- | --- | --- |
| 3.1 | แก้ชื่อ S3 env ให้ตรงกัน: `.env.example` `AWS_S3_*` ↔ โค้ด `S3_*` | ✅ 2026-10-10 — `.env.example` ใช้ `S3_*` + `STORAGE_DRIVER`/`LOCAL_UPLOAD_URL_BASE` แล้ว (ดู `AGENTS.md` ข้อ 10) |
| 3.2 | ตัด dependency ที่ไม่ใช้ 6 ตัว: `admin-lte`, `bootstrap`, `jquery`, `popper.js`, `@uiw/react-markdown-preview`, `@uiw/react-md-editor` | ตรวจซ้ำก่อนลบ แล้ว `npm ci` + `build` ใหม่ |
| 3.3 | ลบ env ที่โค้ดไม่ใช้ (`SMTP_*`, `GITHUB_API_TOKEN`, `LOG_LEVEL`, `SKIP_ENV_VALIDATION`, `SESSION_SECRET` → พอ 1.3 ทำแล้วจะถูกใช้จริง) | ✅ 2026-10-10 ฝั่ง `.env.example` (ดู `AGENTS.md` ข้อ 13) · ⚠️ `.env.local` ยังมีขยะค้าง — รอพี่ฆังสั่ง cleanup (ข้อ 11) |
| 3.4 | แก้ `vercel.json`: เอา `env`, `nodeVersion`, `buildEnvironment` ออก (ไม่อยู่ใน schema ปัจจุบันของ Vercel) → ย้ายไป Project Settings | อ้าง docs vercel.com/docs/project-configuration (2026-08-25) |
| 3.5 | เพิ่ม `"engines": { "node": ">=20" }` ใน `package.json` + ปรับ README ให้ Node 20+ ตรงกัน | ตรงกับ Next 16 |
| 3.6 | `Dockerfile`: เพิ่ม `frontend/` ถ้า 2.2 เลือก "เก็บ" และพิจารณาไม่ COPY source ทั้งหมดใน runner stage | — |
| 3.7 | `docker-compose.yml` `POSTGRES_PASSWORD: micro-cms_change_me` → ต้องไม่ default ใน production | รายงานอย่างเดียวถ้ายังไม่ deploy |
| 3.8 | ปรับ CI `.github/workflows/release.yml`: เอา `continue-on-error: true` ออกจาก lint หลัง lint ผ่านแล้ว | — |

---

## เฟส 4 — ข้อมูล/Database

| # | งาน |
| --- | --- |
| 4.1 |  regenerate `PRODUCT_CMS_SETUP.sql` ให้ตรง `prisma/schema.prisma` (หรือเลิกแจก SQL แล้วใช้ `npx prisma db push` / `migrate deploy` ทางเดียว) |
| 4.2 | ตัดสินใจเรื่อง migrations: ตอนนี้ไม่มี `prisma/migrations/` เลย ใช้ `db push` ล้วน → ถ้าจะขาย/ติดตั้งจริง ต้องเริ่ม `prisma migrate dev` |
| 4.3 | ตรวจ `data/projects.json` + `lib/seed-menu.ts` ว่ายังตรงกับ schema |

---

## เฟส 5 — เอกสาร (ลดจาก 23 ไฟล์)

| # | งาน |
| --- | --- |
| 5.1 | ✅ ทำแล้ว (2026-10-09): README เขียนใหม่ตามโค้ดจริง — ลบรายการที่ไม่มีจริง (`/api/products`, `tailwind.config.js`, `lib/api.ts` ฯลฯ) |
| 5.2 | ✅ ทำแล้ว (2026-10-09): ลบเอกสารซ้ำ/หมดอายุ 16 ไฟล์ (QA_×4, TESTING_EXECUTION_PLAN, QA_ACTION_PLAN, COMPLETION_SUMMARY, FINAL_STATUS, PRODUCTION_CHECKLIST, RELEASE_CHECKLIST, BETA_RELEASE_COMMANDS, SUPPORT_PROCESS, GIT_COMMANDS.txt, BUG_TRACKING, STRUCTURE.md) → เหลือ root .md 11 ไฟล์ (สำรองไว้ที่ `/tmp/opencode/thoth-trash-2026-10-09/`) |
| 5.3 | ✅ ทำแล้ว (2026-10-09): ลบ `desktop.ini`, `README.html` |
| 5.4 | ✅ แทนที่ด้วย README.md ใหม่ (โครงสร้างแยกส่วน CMS/web + flow chart) — ไม่ใช้ `STRUCTURE.md` แล้ว (ลบไปกับ 5.2) |

---

## เฟส 6 — Quality / Test (6.1 ทำแล้ว — เฟส 6 ข้ออื่นยังไม่เริ่ม)

| # | งาน |
| --- | --- |
| 6.1 | ✅ ทำแล้ว (2026-10-09, นับซ้ำ 2026-10-10): ใช้ `node --test` (ไม่ใช่ Vitest) + script `test` ใน `package.json` — **115 tests ผ่าน** (12 ไฟล์: `block-document`, `block-renderer`, `cors-policy`, `cron-auth`, `extension-url-guard`, `login-limit`, `page-input`, `rate-limit`, `route-policy`, `session`, `template-policy`, `xss-sanitization`) |
| 6.2 | Unit: `lib/auth`, `lib/security/secrets`, `lib/storage`, `lib/automation/helpers` |
| 6.3 | Integration/API smoke: login, CRUD page/project พร้อม assert 401 เมื่อไม่มี session (พิสูจน์เฟส 1) |
| 6.4 | E2E smoke (Playwright): `/` → `/login` → `/admin` → สร้าง Page → ดูหน้า public |
| 6.5 | ทำ `npm run lint` ให้เป็น 0 error แล้วค่อยเปิด gate ใน CI |

---

## เฟส 7 — Git / Release (ต้องสั่งก่อนเสมอ)

1. ✅ **มี repo แล้ว** — init + commit แรก `a6eeca1` (2026-10-09) · remote `origin` (GitHub) + `gitea` (LAN) · บันทึกลงดิสแล้ว (ไม่ต้อง push)
2. ✅ ตรวจ `.gitignore` แล้ว — `.env.local` ไม่หลุด (commit แรก verify แล้ว)
3. ✅ ปรับ `CHANGELOG.md` (entry `2.0.0-beta.1`) / `RELEASE_NOTES.md` (bump เป็น v2) แล้ว 2026-10-09
4. ✅ version ปัจจุบัน: **`2.0.0-beta.1`** (bump แล้ว 2026-10-09 ตามคำสั่ง — ข้าม beta.2)

---

## ลำดับที่แนะนำ (ถ้าอนุมัติทั้งหมด)

```
เฟส 1 (P0 ความปลอดภัย)  →  เฟส 2 (ฟีเจอร์ที่เสีย)  →  เฟส 4 (DB ตรงกัน)
      ↓                                              ↓
เฟส 3 (config/deps)   ←  ระหว่างทางรัน tsc/build/lint ทุกครั้ง
      ↓
เฟส 5 (เอกสาร)  →  เฟส 6 (test + lint 0 error)  →  เฟส 7 (git/release รอสั่ง)
```

## กติกางาน

- แก้จุดไหน → รัน `npx tsc --noEmit` + `npm run build` + `npm run lint` ทันที
- ทุกอย่างต้องพิสูจน์บนดิสก์ (Write → Verify → Report)
- ห้ามเดาค่า/ห้ามโชว์ secret/ห้ามแก้ `.env.local`/ห้าม commit โดยไม่สั่ง
- งานไหนกระทบหลายไฟล์ → ทวนขอบเขตแล้วรอบอนุมัติก่อนเสมอ
