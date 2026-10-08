# แผนอัปเดต THOTH — ทุกภาคส่วน (เตรียมงาน)

> จัดทำ: **2026-10-08 โดย ฌอน (opencode)** จากการตรวจสอบโค้ดจริงทั้งโปรเจกต์
> สถานะเอกสาร (อัปเดต 2026-10-09): **ทำแล้วบางส่วน** — เฟส 1 ทำ 5/8 (1.1, 1.2, 1.3, 1.6, 1.8), เฟส 5 ทำแล้วทั้งหมด, เฟส 6.1 มี `node --test` 30 tests แล้ว; **เฟส 2, 3, 4, 7 ยังไม่เริ่ม** — งานที่เหลือยังรอพี่ฆังอนุมัติทุกข้อ
> อ้างอิงปัญหา: ดู `AGENTS.md` ข้อ 3 (P0–P3)
> ⚠️ กฎบังคับ: ห้ามเริ่มเฟสใดโดยไม่ได้รับอนุมัติ · ห้ามแก้ `.env.local` · ห้าม commit/push

---

## 0. Baseline ที่วัดได้ (2026-10-08)

| รายการ | ผลลัพธ์จริง |
| --- | --- |
| `npm ci` | ผ่าน (645 packages) — แต่ npm 12 block install-scripts → ต้องรัน `npx prisma generate` เอง |
| `npx tsc --noEmit` | ✅ exit 0 |
| `npm run build` | ✅ exit 0 |
| `npm run lint` | ❌ 30 errors / 22 warnings |
| git | ❌ ไม่ใช่ repo (ไม่มี `.git`, ไม่มี remote) |
| การทดสอบ | ⚠️ วัด 2026-10-08 = ไม่มีเลย · **อัปเดต 2026-10-09 = มีแล้ว 30 tests (`node --test tests/*.test.mjs`)** |
| หน้า public พัง | `/products`, `/dashboard` เรียก `/api/products` ที่ไม่มีอยู่ |

**เป้าหมายรวม:** ทำให้ lint ผ่าน, ปิดช่องโหว่ P0, ให้เอกสาร/โค้ด/DB ตรงกัน, มี test อย่างน้อย smoke, มี git repo + remote ตามที่พี่ฆังสั่ง

---

## เฟส 1 — P0 ความปลอดภัย (ทำก่อนสิ่งอื่น)

| # | งาน | ไฟล์ที่กระทบ | เสร็จเมื่อ / สถานะ |
| --- | --- | --- | --- |
| 1.1 | สร้าง guard ส่วนกลาง `requireApiAuth()` (ตรวจ session cookie + ลายเซ็น + expiry) แล้วครอบทุก route ที่มี `POST/PATCH/DELETE` | `lib/auth.ts` + ทุก `app/api/**/route.ts` (≈20 ไฟล์) | ✅ 2026-10-09 — `guardApiSession` ใน 21 route files + `tests/route-policy.test.mjs` บังคับทุก write (acceptance: POST ไม่มี cookie → 401) |
| 1.2 | ขยาย `proxy.ts` matcher ให้ครอบ `/api/*` ด้วย (หรือย้ายการตรวจไปฝั่ง handler ล้วน — เลือกทางเดียวให้ชัด) | `proxy.ts` | ✅ 2026-10-09 — ทั้งคู่: proxy matcher มี `/api/:path*` + handler-level guard |
| 1.3 | เปลี่ยน session จาก `user.id` เปล่า → token ที่เซ็นด้วย `SESSION_SECRET` (HMAC หรือ JWT) + ตรวจ expiry ฝั่ง server | `lib/auth.ts`, `proxy.ts` | ✅ 2026-10-09 — `signSessionToken` (ขาด `SESSION_SECRET` → throw) |
| 1.4 | เพิ่ม rate limit + lockout ที่ `POST /api/auth/login` (ตอนนี้ brute-force ได้ไม่จำกัด) | `app/api/auth/login/route.ts` | ❌ ยังไม่ทำ (ตรวจซ้ำ 2026-10-09: ไม่มี rate/lockout ใน route) |
| 1.5 | `POST /api/upload`: ต้อง auth + จำกัดจำนวน/ความถี่ + ตรวจ content ซ้ำ | `app/api/upload/route.ts` | ⚠️ auth แล้ว (`guardApiSession`) — **rate limit ยังไม่มี** (2026-10-09) |
| 1.6 | `AUTOMATION_CRON_SECRET`: บังคับตั้งค่า (ถ้าว่าง → ปฏิเสธทุก request) + เพิ่มลง `.env.example` | `app/api/admin/automation/cron/route.ts`, `.env.example` | ✅ 2026-10-09 — `isCronAuthorized` fail-closed + key อยู่ใน `.env.example` แล้ว |
| 1.7 | Sanitize HTML ก่อน render (`dangerouslySetInnerHTML` ใน `app/[slug]/page.tsx`) — ใช้ sanitizer ฝั่ง server ตอนบันทึก หรือตอน render | `app/[slug]/page.tsx` + จุดอื่นที่เจอ | ❌ ยังไม่ทำ — **แยก รอพี่ฆังตัดสิน** (ดู `AGENTS.md` ข้อ 4) |
| 1.8 | เพิ่ม `APP_ENCRYPTION_KEY` ลง `.env.example` + ตรวจตอน startup ว่ามีค่า (ตอนนี้ automation บันทึก key จะ throw) | `.env.example`, `lib/security/secrets.ts` | ✅ 2026-10-09 — อยู่ใน `.env.example` แล้ว |

**อนุมัติเฉพาะเฟส 1 ก่อน** แล้วค่อยไปเฟส 2 — เพราะ 1.1–1.3 เปลี่ยนพฤติกรรม auth ทั้งระบบ

---

## เฟส 2 — ฟีเจอร์ / พื้นผิวที่เสีย

| # | งาน | ทางเลือก (ต้องเลือกอย่างใดอย่างหนึ่ง) |
| --- | --- | --- |
| 2.1 | `/products` + `/dashboard` พัง (เรียก API ที่ไม่มี) | **(ก)** สร้าง `Product` model + `/api/products` + `/api/dashboard/stats` ให้ตรงที่โฆษณา หรือ **(ข)** ลบหน้า `app/products`, `app/dashboard` + ตัดคำโปรโมท Products ออกจาก README/CHANGELOG |
| 2.2 | `frontend/` เป็น dead code 1,877 LOC | **(ก)** ลบ (ขอล่วงหน้า) **(ข)** ย้ายของที่ยังใช้เข้า `app/` แล้วลบ **(ค)** ปล่อยไว้ + ตัดออกจาก tsconfig/eslint ไม่ให้เป็นภาระ |
| 2.3 | `modules/` มีแค่ `staff-member` แต่ README อ้าง `projects/products/staff/pages` | ปรับ `MODULE_STANDARD.md` + README ให้ตรง หรือ scaffold module ที่ขาด |
| 2.4 | `extensions/` ยังไม่มี extension จริง | สร้าง extension ตัวอย่างอย่างน้อย 1 ตัว หรือยอมรับว่ายังเป็น scaffold |
| 2.5 | Rich-text editor เป็น contentEditable เขียนเอง (262 บรรทัด) — ไม่มี sanitization | ประเมินแทน: คงไว้ + เพิ่ม sanitize ตอนบันทึก, หรือสลับเป็น library ที่ maintain |

---

## เฟส 3 — Config / Dependency / Deploy

| # | งาน | หมายเหตุ |
| --- | --- | --- |
| 3.1 | แก้ชื่อ S3 env ให้ตรงกัน: `.env.example` `AWS_S3_*` ↔ โค้ด `S3_*` | เลือกชื่อเดียวทั้งระบบ + อัปเดต `.env.example`, README, ENV_SETUP |
| 3.2 | ตัด dependency ที่ไม่ใช้ 6 ตัว: `admin-lte`, `bootstrap`, `jquery`, `popper.js`, `@uiw/react-markdown-preview`, `@uiw/react-md-editor` | ตรวจซ้ำก่อนลบ แล้ว `npm ci` + `build` ใหม่ |
| 3.3 | ลบ env ที่โค้ดไม่ใช้ (`SMTP_*`, `GITHUB_API_TOKEN`, `LOG_LEVEL`, `SKIP_ENV_VALIDATION`, `SESSION_SECRET` → พอ 1.3 ทำแล้วจะถูกใช้จริง) | — |
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
| 6.1 | ✅ ทำแล้ว (2026-10-09): ใช้ `node --test` (ไม่ใช่ Vitest) + script `test` ใน `package.json` — **30 tests ผ่าน** (`tests/route-policy.test.mjs` + `tests/session.test.mjs`) |
| 6.2 | Unit: `lib/auth`, `lib/security/secrets`, `lib/storage`, `lib/automation/helpers` |
| 6.3 | Integration/API smoke: login, CRUD page/project พร้อม assert 401 เมื่อไม่มี session (พิสูจน์เฟส 1) |
| 6.4 | E2E smoke (Playwright): `/` → `/login` → `/admin` → สร้าง Page → ดูหน้า public |
| 6.5 | ทำ `npm run lint` ให้เป็น 0 error แล้วค่อยเปิด gate ใน CI |

---

## เฟส 7 — Git / Release (ต้องสั่งก่อนเสมอ)

1. **ยังไม่มี repo** — ต้องให้พี่ฆังสั่งว่าจะ `git init` + remote ชื่ออะไร (ห้ามฌอนสร้างเอง)
2. ตรวจ `.gitignore` (มี `.env*` อยู่แล้ว ✅) — ยืนยัน `.env.local` ไม่หลุดก่อน commit แรก
3. งานค้าง: ปรับ `CHANGELOG.md` / `RELEASE_NOTES.md` ให้ตรงของจริงก่อนปล่อย beta ถัดไป
4. สรุป version: ยัง `1.0.0-beta.1` — ถ้าแก้ P0 เสร็จ ควรขึ้นเป็น `beta.2`

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
