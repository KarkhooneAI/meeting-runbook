<div align="center">

<img src="public/favicon.svg" width="72" alt="Meeting RunBook">

# Meeting RunBook

**دفترچه‌ی زنده‌ی جلسه — راست‌چین، ساده، بدون سرور.**
A calm, RTL-first runbook for running working meetings. Your data never leaves your browser.

**Powered by KarkhooneAI** · Kourosh Sedigh ([@iamkourosh](https://github.com/iamkourosh)) · `Rewrite the Normal` · MIT

[فارسی](#فارسی) · [English](#english)

</div>

---

## فارسی

### این چیست؟

Meeting RunBook یک ابزار وب کوچک است برای **هدایت یک جلسه‌ی کاری و ثبت خروجی‌هایش در همان لحظه**: مسیر جلسه با تایمر، یادداشت و جمع‌بندی هر بخش، بک‌لاگ و مایل‌استون‌ها، OKR/KPI، معیارهای Ready و Done، برنامه‌ی بعد از جلسه، تصمیم‌ها و Parking Lot — و در پایان یک جمع‌بندی خودکار که مستقیم در گروه تیم کپی می‌شود.

فلسفه‌اش ساده است: **جلسه برای پیش‌بردن کار است، نه تولید گزارش.** کمترین فرایندی که یک تیم کوچک واقعاً لازم دارد.

### چه می‌کند

- **شروع سریع:** در اولین بازشدن فقط عنوان، تاریخ، حاضرین و یک الگو می‌گیرد؛ بقیه داخل جلسه پر می‌شود.
- **الگوها:** هم‌راستایی و شروع اجرا · هماهنگی هفتگی · Sprint Planning · Daily Standup · Backlog Refinement · Sprint Review · Retro · خالی. همه‌چیز بعد از ساخت قابل ویرایش است.
- **ذخیره در مرورگر:** هر تغییر همان لحظه در `localStorage` ذخیره می‌شود؛ چند Runbook هم‌زمان نگه می‌دارد.
- **اشتراک‌گذاری بدون سرور:** کل داده‌ی Runbook فشرده می‌شود داخل لینک. گیرنده با باز کردن لینک یک نسخه‌ی مستقل در مرورگر خودش می‌گیرد.
- **خروجی‌ها:** اکسل (بک‌لاگ، برنامه، تصمیم‌ها، Parking Lot، شاخص‌ها، مسیر جلسه) · Markdown · Word · JSON · چاپ/PDF · کپی جمع‌بندی کوتاه یا همه‌ی یادداشت‌ها.
- **دو زبانه:** فارسی (پیش‌فرض، RTL) و انگلیسی.
- **تم روشن / تیره / خودکار** و فونت‌های برند کارخونه (Vazir و Tomorrow) به‌صورت self-hosted — بدون هیچ درخواست بیرونی.
- **قابل انتشار روی GitHub Pages** با یک Workflow آماده.

### راه‌اندازی Local — گام به گام

پیش‌نیاز فقط **Node.js نسخه‌ی ۲۰ یا بالاتر** است (npm همراهش نصب می‌شود).

#### macOS

1. Terminal را باز کنید (`Cmd + Space` → بنویسید `Terminal`).
2. اگر Node ندارید، از [nodejs.org](https://nodejs.org) نسخه‌ی LTS را نصب کنید، یا با Homebrew:
   ```bash
   brew install node
   ```
3. بررسی نسخه:
   ```bash
   node -v   # باید v20 یا بالاتر باشد
   ```
4. پروژه را بگیرید و وارد فولدرش شوید:
   ```bash
   git clone https://github.com/KarkhooneAI/meeting-runbook.git
   cd meeting-runbook
   ```
5. وابستگی‌ها را نصب کنید:
   ```bash
   npm install
   ```
6. اجرا:
   ```bash
   npm run dev
   ```
7. آدرسی که چاپ می‌شود (معمولاً `http://localhost:5173`) را در مرورگر باز کنید.

#### Linux (Ubuntu / Debian)

1. ترمینال را باز کنید.
2. نصب Node 20 (اگر ندارید):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```
   (روی توزیع‌های دیگر از package manager خودتان یا [nvm](https://github.com/nvm-sh/nvm) استفاده کنید.)
3. بررسی: `node -v`
4. گرفتن پروژه:
   ```bash
   git clone https://github.com/KarkhooneAI/meeting-runbook.git
   cd meeting-runbook
   ```
5. نصب و اجرا:
   ```bash
   npm install
   npm run dev
   ```
6. `http://localhost:5173` را باز کنید.

#### Windows

1. از [nodejs.org](https://nodejs.org) نسخه‌ی LTS را دانلود و نصب کنید (گزینه‌های پیش‌فرض کافی است). اگر Git ندارید، [git-scm.com](https://git-scm.com/download/win) را هم نصب کنید.
2. **PowerShell** یا **Windows Terminal** را باز کنید (Start → بنویسید `PowerShell`).
3. بررسی:
   ```powershell
   node -v
   ```
4. گرفتن پروژه:
   ```powershell
   git clone https://github.com/KarkhooneAI/meeting-runbook.git
   cd meeting-runbook
   ```
5. نصب و اجرا:
   ```powershell
   npm install
   npm run dev
   ```
6. `http://localhost:5173` را در مرورگر باز کنید.

> اگر `npm install` با خطای شبکه متوقف شد، یک بار دیگر اجرا کنید یا از یک VPN/میرور npm استفاده کنید.

#### ساخت نسخه‌ی نهایی

```bash
npm run build      # خروجی در فولدر dist/
npm run preview    # پیش‌نمایش همان خروجی
```

فولدر `dist/` کاملاً استاتیک است و روی هر هاست ساده‌ای بالا می‌آید.

### انتشار روی GitHub Pages

1. ریپو را روی GitHub بسازید و کد را push کنید (برنچ `main`).
2. در ریپو: **Settings → Pages → Build and deployment → Source** را روی **GitHub Actions** بگذارید.
3. Workflow آماده در `.github/workflows/deploy.yml` با هر push روی `main` سایت را می‌سازد و منتشر می‌کند.
4. آدرس نهایی: `https://karkhooneai.github.io/meeting-runbook/`

مسیر پایه (`/meeting-runbook/`) به‌صورت خودکار از نام ریپو خوانده می‌شود؛ اگر اسم ریپو را عوض کنید هیچ چیزی لازم نیست تغییر بدهید.

### داده‌ی من کجاست؟

- فقط در **مرورگر خودتان** (`localStorage`) — هیچ سروری در کار نیست، هیچ‌چیز جایی ارسال نمی‌شود.
- پاک‌کردن داده‌ی سایت در مرورگر = پاک‌شدن Runbookها. برای نگه‌داشتن، از **اشتراک‌گذاری → فایل JSON** خروجی بگیرید.
- لینک اشتراک، **کل داده** را داخل خودش دارد؛ هر کسی لینک را داشته باشد محتوا را می‌بیند. برای جلسه‌های حساس، لینک را فقط در کانال خصوصی تیم بفرستید.

### ساختار پروژه

```
src/
  i18n/        دیکشنری فارسی و انگلیسی + Provider
  model/       تایپ‌ها و الگوهای جلسه
  store/       state + ذخیره در localStorage
  lib/         خروجی‌ها: xlsx (بدون وابستگی)، markdown، docx، share link
  components/  اجزای مشترک (Setup، Sidebar، Toolbar، جدول ویرایش‌پذیر…)
  sections/    نه بخش Runbook
```

### مسیر پیش رو

- [ ] بک‌اند اختیاری با Go برای همگام‌سازی و اشتراک زنده
- [ ] اتصال به ابزارهای مدیریت پروژه (import/export تسک‌ها)
- [ ] دستیار AI برای جمع‌بندی و پیشنهاد اقدام

### مشارکت

Issue و Pull Request خوش‌آمدند. لطفاً قبل از تغییرات بزرگ یک Issue باز کنید تا هم‌راستا شویم. [CONTRIBUTING.md](CONTRIBUTING.md)

---

## English

### What is it?

Meeting RunBook is a small web tool for **running a working meeting and capturing its outputs as they happen**: a timed agenda with notes and wrap-ups per block, backlog & milestones, OKR/KPI, Ready/Done criteria, a post-meeting plan, decisions and a parking lot — ending with an auto-generated summary you paste straight into the team chat.

The philosophy is simple: **a meeting is for moving work forward, not for producing reports.** The least process a small team really needs.

### Features

- **Fast start:** on first load it asks only for a title, date, participants and a template; the rest is filled in during the meeting.
- **Templates:** Alignment & kickoff · Weekly sync · Sprint Planning · Daily Standup · Backlog Refinement · Sprint Review · Retro · Blank. Everything is editable afterwards.
- **Browser-only storage:** every change is saved instantly to `localStorage`; keeps several runbooks side by side.
- **Serverless sharing:** the whole runbook is compressed into the link. Whoever opens it gets an independent copy in their own browser.
- **Exports:** Excel (backlog, plan, decisions, parking lot, metrics, agenda) · Markdown · Word · JSON · print/PDF · copy the short summary or all notes.
- **Bilingual:** Persian (default, RTL) and English.
- **Light / dark / auto theme** and self-hosted brand fonts (Vazir, Tomorrow) — zero external requests.
- **Deploys to GitHub Pages** with the included workflow.

### Local setup — step by step

The only prerequisite is **Node.js 20 or newer** (npm comes with it).

#### macOS

1. Open Terminal (`Cmd + Space` → type `Terminal`).
2. Install Node LTS from [nodejs.org](https://nodejs.org), or with Homebrew: `brew install node`
3. Check: `node -v` (should print v20 or newer)
4. Get the project:
   ```bash
   git clone https://github.com/KarkhooneAI/meeting-runbook.git
   cd meeting-runbook
   ```
5. Install and run:
   ```bash
   npm install
   npm run dev
   ```
6. Open the printed address (usually `http://localhost:5173`).

#### Linux (Ubuntu / Debian)

1. Open a terminal.
2. Install Node 20 if missing:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   ```
   (Other distros: use your package manager or [nvm](https://github.com/nvm-sh/nvm).)
3. Check: `node -v`
4. `git clone https://github.com/KarkhooneAI/meeting-runbook.git && cd meeting-runbook`
5. `npm install && npm run dev`
6. Open `http://localhost:5173`.

#### Windows

1. Install Node LTS from [nodejs.org](https://nodejs.org) (defaults are fine) and Git from [git-scm.com](https://git-scm.com/download/win).
2. Open **PowerShell** or **Windows Terminal**.
3. Check: `node -v`
4. `git clone https://github.com/KarkhooneAI/meeting-runbook.git` then `cd meeting-runbook`
5. `npm install` then `npm run dev`
6. Open `http://localhost:5173`.

#### Production build

```bash
npm run build      # static output in dist/
npm run preview    # preview that output
```

### Deploy to GitHub Pages

1. Create the repo on GitHub and push to `main`.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes on every push to `main`.
4. Your site: `https://karkhooneai.github.io/meeting-runbook/`

The base path is derived from the repository name automatically.

### Where is my data?

Only in **your browser** (`localStorage`). No server, nothing is sent anywhere. Clearing site data removes your runbooks — export a JSON file to keep them. A share link carries the **entire runbook** inside it, so send it only where you'd send the content itself.

### Roadmap

- [ ] Optional Go backend for sync and live sharing
- [ ] Project-management tool integrations (task import/export)
- [ ] AI assistant for summaries and suggested actions

### Contributing

Issues and pull requests are welcome. Please open an issue before large changes. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

<div align="center">Powered by <b>KarkhooneAI</b> · Made by Kourosh Sedigh (<a href="https://github.com/iamkourosh">@iamkourosh</a>) · MIT · <i>Rewrite the Normal</i></div>
