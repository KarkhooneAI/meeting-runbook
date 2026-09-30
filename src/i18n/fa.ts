const fa = {
  appName: 'Meeting RunBook',
  by: 'Powered by KarkhooneAI',
  tagline: 'Rewrite the Normal',
  // nav
  nav_overview: 'نمای کلی', nav_agenda: 'مسیر جلسه', nav_team: 'قلق همکاری', nav_backlog: 'بک‌لاگ و مایل‌استون',
  nav_metrics: 'OKR و KPI', nav_quality: 'کیفیت و Done', nav_plan: 'برنامه‌ی بعد از جلسه', nav_decisions: 'تصمیم‌ها و خروجی', nav_summary: 'جمع‌بندی نهایی',
  // toolbar
  share: 'اشتراک‌گذاری', export: 'خروجی', exportExcel: 'اکسل (تسک‌ها و بک‌لاگ)', exportMd: 'Markdown', exportDocx: 'Word', exportJson: 'فایل JSON',
  importJson: 'بازیابی از JSON', print: 'چاپ / PDF', theme: 'تم روشن/تیره', lang: 'English',
  copyLink: 'کپی لینک اشتراک', linkCopied: 'لینک کپی شد — هر کسی با این لینک نسخه‌ی کامل را می‌بیند', linkTooLong: 'حجم داده برای لینک زیاد است؛ از فایل JSON استفاده کنید',
  shareHint: 'کل داده‌ی این Runbook داخل خود لینک است (بدون سرور). گیرنده با باز کردن لینک، یک نسخه‌ی مستقل در مرورگر خودش می‌گیرد.',
  sharedOpen: 'یک Runbook با شما به اشتراک گذاشته شده. باز شود؟', sharedImported: 'Runbook اشتراکی باز شد',
  saved: 'ذخیره‌ی خودکار در مرورگر', savedOff: 'ذخیره‌ی مرورگر در دسترس نیست — حتماً JSON بگیرید',
  runbooks: 'Runbookها', newRunbook: '+ Runbook جدید', deleteRunbook: 'حذف این Runbook', confirmDelete: 'این Runbook حذف شود؟ (قابل بازگشت نیست)',
  // setup
  setupTitle: 'یک Runbook جدید', setupSub: 'فقط چند چیز لازم داریم؛ بقیه را داخل جلسه پر می‌کنیم.',
  f_title: 'عنوان جلسه', f_title_ph: 'مثلاً: جلسه‌ی هم‌راستایی و شروع اجرا',
  f_date: 'تاریخ', f_time: 'ساعت شروع', f_duration: 'زمان پیش‌بینی‌شده (دقیقه)', f_buffer: 'زمان شناور (دقیقه)',
  f_participants: 'حاضرین', f_participants_ph: 'نام را بنویسید و Enter بزنید', f_template: 'الگوی جلسه',
  f_focus: 'تمرکز خاص جلسه', f_focus_ph: 'اختیاری — اگر یک چیز مهم‌تر از بقیه است',
  tpl_alignment: 'هم‌راستایی و شروع اجرا', tpl_weekly: 'هماهنگی هفتگی', tpl_retro: 'Retro', tpl_blank: 'خالی',
  tpl_alignment_d: 'روش کار، بک‌لاگ، شاخص‌ها، کیفیت و برنامه‌ی دو هفته‌ی اول', tpl_weekly_d: 'وضعیت، Blockerها، اولویت هفته', tpl_retro_d: 'Keep · Change · Drop', tpl_blank_d: 'خودتان مسیر را بچینید',
  tpl_sprintPlanning: 'Sprint Planning', tpl_standup: 'Daily Standup', tpl_refinement: 'Backlog Refinement', tpl_sprintReview: 'Sprint Review',
  tpl_sprintPlanning_d: 'هدف اسپرینت، انتخاب آیتم‌های Ready، تعهد', tpl_standup_d: 'دور سریع، Blockerها، هدف اسپرینت', tpl_refinement_d: 'مرور، شکستن، Ready کردن آیتم‌ها', tpl_sprintReview_d: 'نمایش کار Done، بازخورد، Backlog',
  themeDark: 'تم تیره', themeLight: 'تم روشن', themeAuto: 'خودکار (سیستم)',
  start: 'شروع Runbook', required: 'الزامی', minOne: 'حداقل یک نفر',
  // overview
  ov_info: 'اطلاعات جلسه', ov_outputs: 'تا پایان جلسه باید این‌ها را داشته باشیم', ov_addOutput: '+ خروجی', ov_planned: 'دقیقه برنامه‌ریزی‌شده', ov_buffer: 'دقیقه شناور',
  ov_done: 'بخش جمع‌بندی‌شده', ov_decisions: 'تصمیم ثبت‌شده', f_sot: 'منبع حقیقت کارها (بعد از جلسه یک‌جا باشد)', f_sot_ph: 'مثلاً: ابزار مدیریت پروژه · پیام‌رسان فقط برای گفت‌وگو',
  ov_rule: 'قاعده‌ی بازی: کمترین فرایندی که برای این تیم واقعاً لازم است، نه بیشتر. هر بحثی که جلسه را از مسیر خارج می‌کند به Parking Lot می‌رود.',
  // agenda
  ag_sub: 'هر بخش را باز کنید، یادداشت و جمع‌بندی بنویسید، تایمر بزنید و در پایان تیک «جمع‌بندی شد» را بزنید.',
  ag_total: 'مجموع برنامه', ag_spent: 'زمان واقعی', ag_doneOf: 'جمع‌بندی شد', min: 'دقیقه', openAll: 'باز کردن همه', closeAll: 'بستن همه',
  ag_notes: 'یادداشت گفت‌وگو', ag_summary: 'جمع‌بندی / تصمیم این بخش', ag_done: 'این بخش جمع‌بندی شد', ag_add: '+ بخش جدید', ag_topics: 'موضوع‌ها (هر خط یکی)',
  ag_title: 'عنوان بخش', ag_minutes: 'دقیقه', ag_delete: 'حذف بخش', tStart: 'شروع', tStop: 'توقف', tReset: 'صفر',
  // team
  tm_sub: 'بعد از جلسه، گفت‌وگوی مستقیم با هر نفر جای توضیح دست‌دومی را می‌گیرد. این بخش فقط برای شروع روان‌تر است — نه شخصیت‌شناسی، نه برچسب.',
  tm_q1: 'چه چیزی کمک می‌کند بهتر با هم کار کنیم؟', tm_q2: 'ارتباط و Feedback', tm_q3: 'نکته‌ی دیگر',
  tm_shared: 'توافق‌های کوچک ارتباطی تیم', tm_shared_h: 'کجا پیام بزنیم، چه چیزی «فوری» است، Feedback را چطور و کجا بدهیم، ساعت‌های تمرکز.',
  // backlog
  bk_sub: 'Product Backlog از پروژه‌های مشتری جدا می‌ماند. شروع کار فقط برای آیتم‌هایی که Ready هستند.',
  c_space: 'فضا', c_topic: 'موضوع', c_outcome: 'نتیجه‌ی مورد انتظار', c_priority: 'اولویت', c_person: 'پیگیر', c_due: 'موعد', c_milestone: 'مایل‌استون', c_status: 'وضعیت',
  bk_add: '+ آیتم جدید', bk_stats: '{n} آیتم · {p0} تا P0 · {ready} تا Ready', bk_p0hint: 'P0 یعنی «باید در همین بازه بسته شود»؛ بیش از ۳ تا P0 یعنی هنوز اولویت‌بندی نکرده‌ایم.',
  sp_product: 'محصول', sp_client: 'پروژه‌ی مشتری', sp_platform: 'پلتفرم / زیرساخت', sp_internal: 'داخلی', sp_other: 'سایر',
  later: 'بعداً',
  // metrics
  mt_sub: 'چند Outcome مهم، نه یک داشبورد. هر KPI باید به یک تصمیم مشخص کمک کند.',
  c_objective: 'Objective', c_kr: 'شاخص / Key Result', c_baseline: 'Baseline', c_target: 'Target', c_source: 'منبع داده', c_measure: 'پیگیر سنجش', c_cadence: 'ریتم مرور',
  mt_add: '+ شاخص جدید', cad_weekly: 'هفتگی', cad_biweekly: 'دوهفته‌ای', cad_monthly: 'ماهانه', cad_milestone: 'پایان مایل‌استون',
  mt_r1: 'تعداد Task، Story Point یا ساعت کار KPI عملکرد افراد نیست.', mt_r2: 'اگر Baseline نداریم، «تعریف روش اندازه‌گیری» خودش یک اقدام است — عدد ساختگی نمی‌گذاریم.', mt_r3: 'هر KPI باید به یک تصمیم مشخص کمک کند؛ وگرنه حذفش کنید.',
  // quality
  q_sub: 'متن هر معیار قابل ویرایش است؛ تیک یعنی «روی این توافق کردیم».',
  q_dor: 'Definition of Ready', q_dor_d: 'چه زمانی یک کار آماده‌ی شروع است؟', q_dod: 'Definition of Done', q_dod_d: 'چه زمانی می‌گوییم یک کار واقعاً تمام شده؟',
  q_ms: 'پایان مایل‌استون', q_ms_d: 'چه زمانی یک مرحله را بسته تلقی می‌کنیم؟', q_addItem: '+ معیار',
  q_flow: 'مسیر تست و بازبینی (چطور یک خروجی از «تمام شد» به «تأیید شد» می‌رسد)', q_flow_ph: 'مثلاً: پیگیر خروجی → بازبینی یک نفر دیگر (Review) → QC روی معیار پذیرش → Done.',
  q_qaqc: 'QA = فرایند؛ جلوی خطا را قبل از ساخت می‌گیرد (DoR، معیار پذیرش، Review). QC = بررسی خروجی نهایی با معیار پذیرش.',
  // plan
  pl_sub: 'تصمیم‌ها را به اقدام‌های کوچک تبدیل می‌کنیم: همراه یا پیگیر، موعد، معیار تمام‌شدن.',
  c_range: 'بازه', c_action: 'اقدام یا خروجی', c_companion: 'همراه / پیگیر', c_criteria: 'معیار تمام‌شدن', pl_add: '+ اقدام جدید',
  f_firstReview: 'اولین Review', f_retro: 'Retro و بازبینی روش کار', f_sync: 'ریتم هماهنگی', f_dayTime: 'روز و ساعت', f_sync_ph: 'مثلاً: پیام وضعیت روزانه + جلسه‌ی ۳۰ دقیقه‌ای هفتگی',
  // decisions
  dc_sub: 'تصمیم بدون منطق کوتاه و زمان بازبینی، شش هفته بعد قابل دفاع نیست.',
  dc_log: 'Decision Log', c_decision: 'تصمیم', c_why: 'منطق کوتاه', c_review: 'موعد یا زمان بازبینی', dc_add: '+ تصمیم جدید',
  pk_title: 'Parking Lot', pk_sub: 'موضوعاتی که مهم‌اند اما نباید جلسه را از مسیر خارج کنند.', c_next: 'قدم بعدی', pk_add: '+ موضوع',
  // summary
  sm_sub: 'به‌صورت خودکار از داده‌های همین صفحه ساخته می‌شود — آماده‌ی کپی در گروه.', sm_copy: 'کپی جمع‌بندی', sm_copied: 'جمع‌بندی کپی شد', sm_copyAll: 'کپی همه‌ی یادداشت‌ها',
  sm_notes: 'یادداشت آزاد پایان جلسه', sm_notes_ph: 'حس کلی، چیزی که نگفته ماند، قدم بعدی خود جلسه…',
  sm_h_outputs: 'خروجی‌های جلسه', sm_h_sections: 'جمع‌بندی بخش‌ها', sm_h_decisions: 'تصمیم‌ها', sm_h_backlog: 'اولویت‌های نزدیک Backlog', sm_h_metrics: 'شاخص‌های نسخه‌ی اول',
  sm_h_quality: 'کیفیت و Done', sm_h_plan: 'برنامه‌ی بعد از جلسه', sm_h_parking: 'Parking Lot', sm_h_notes: 'یادداشت پایانی', sm_h_team: 'قلق همکاری', sm_h_agendaNotes: 'یادداشت‌های بخش‌ها',
  sm_none: '— ثبت نشده —', sm_participants: 'حاضرین', sm_focus: 'تمرکز جلسه', sm_sot: 'منبع حقیقت کارها', sm_time: 'ساعت', sm_agreed: '{d} از {n} معیار توافق شد',
  sm_flow: 'مسیر تست و بازبینی', sm_retro: 'بازبینی روش همکاری (Retro)', sm_review: 'اولین Review', sm_sync: 'ریتم هماهنگی', sm_reviewAt: 'بازبینی', sm_follow: 'پیگیر', sm_measure: 'سنجش', sm_criteria: 'معیار', sm_due: 'موعد', sm_source: 'منبع',
  // misc
  delete: 'حذف', confirmRow: 'این ردیف حذف شود؟', empty: 'هنوز چیزی ثبت نشده — با «+» شروع کنید.', exported: 'فایل دانلود شد', importBad: 'فایل معتبر نیست', imported: 'اطلاعات بازیابی شد',
  copySelect: 'متن انتخاب شد — Ctrl/Cmd+C', none: '—', all: 'همه', team: 'تیم', goto: 'رفتن به بخش مرتبط ←',
  footer: 'Meeting RunBook · متن‌باز · داده فقط در مرورگر شما · Powered by KarkhooneAI · Kourosh Sedigh (iamkourosh)',
  jalaliHint: 'تاریخ آزاد است — شمسی یا میلادی، هرطور تیم می‌نویسد.',
}
export default fa
export type Dict = typeof fa
