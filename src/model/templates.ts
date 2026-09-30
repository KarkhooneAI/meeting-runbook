import { uid, type AgendaItem, type Lang, type OutputItem, type PlanRow, type Quality, type MetricRow } from './types'

export type TemplateId = 'alignment' | 'weekly' | 'sprintPlanning' | 'standup' | 'refinement' | 'sprintReview' | 'retro' | 'blank'
export const TEMPLATE_IDS: TemplateId[] = ['alignment', 'weekly', 'sprintPlanning', 'standup', 'refinement', 'sprintReview', 'retro', 'blank']

type AgendaSeed = { title: string; minutes: number; topics: string[]; hint?: string }
type Seed = { agenda: AgendaSeed[]; outputs: string[]; plan: PlanRow[]; metrics: MetricRow[]; quality: Quality }

const A = (title: string, minutes: number, topics: string[], hint?: string): AgendaSeed => ({ title, minutes, topics, hint })
const item = (text: string) => ({ id: uid(), text, done: false })
const plan = (range: string, action: string, person: string, criteria: string): PlanRow => ({ id: uid(), range, action, person, due: '', criteria, status: 'Not started' })
const metric = (objective: string, kr: string): MetricRow => ({ id: uid(), objective, kr, baseline: '', target: '', source: '', person: '', cadence: '' })

const QUALITY: Record<Lang, Quality> = {
  fa: {
    dor: ['مسئله و نتیجه‌ی مورد انتظار روشن است.', 'معیار پذیرش قابل بررسی نوشته شده است.', 'ورودی‌ها و وابستگی‌های لازم آماده‌اند.', 'اندازه‌ی کار برای شروع قابل قبول است.', 'پیگیر مشخص است.'].map(item),
    dod: ['معیارهای پذیرش کامل شده‌اند.', 'تست و بازبینی مرتبط انجام شده است.', 'QA و QC نتیجه را تأیید کرده‌اند.', 'مورد Blocker یا Critical باز نمانده است.', 'مستندات و شیوه‌ی سنجش نتیجه آماده است.'].map(item),
    milestone: ['Outcome مایل‌استون محقق شده است، نه فقط فهرست Deliverableها.', 'تمام Exit Criteria پاس شده‌اند.', 'کارهای باقی‌مانده با پیگیر و موعد ثبت شده‌اند.', 'یادگیری‌ها و تصمیم‌های مهم ثبت شده‌اند.'].map(item),
  },
  en: {
    dor: ['Problem and expected outcome are clear.', 'Verifiable acceptance criteria are written.', 'Inputs and dependencies are ready.', 'The work is small enough to start.', 'A follower is named.'].map(item),
    dod: ['Acceptance criteria are met.', 'Relevant tests and review are done.', 'QA and QC approved the result.', 'No blocker or critical issue is open.', 'Docs and the way to measure the result are ready.'].map(item),
    milestone: ['The milestone outcome is achieved, not just the deliverable list.', 'All exit criteria passed.', 'Remaining work is logged with a follower and a due date.', 'Learnings and key decisions are recorded.'].map(item),
  },
}

const SEEDS: Record<Lang, Record<TemplateId, Seed>> = {
  fa: {
    alignment: {
      agenda: [
        A('شروع و تنظیم تمرکز جلسه', 5, ['مرور کوتاه هدف جلسه', 'تأیید خروجی‌هایی که باید تا پایان جلسه داشته باشیم', 'توافق: هر بحث خارج از مسیر → Parking Lot']),
        A('ارائه‌ی روش پیشنهادی کار', 20, ['مدل برنامه‌ریزی و اولویت‌بندی', 'ساختار Backlog', 'وضعیت‌های Workflow', 'ریتم هماهنگی، Review و Retro', 'روش مدیریت تغییر و Blocker'], 'این‌جا فقط می‌شنویم و سؤال می‌پرسیم؛ تصمیم در بخش بعد.'),
        A('توافق روی نسخه‌ی اول روش کار', 15, ['انتخاب فرایندهایی که برای این تیم واقعاً لازم‌اند', 'توافق روی ابزار و منبع حقیقت', 'قفل نسخه‌ی اول برای اجرا', 'تعیین زمان بازبینی']),
        A('قلق همکاری', 10, ['شیوه‌ی ارتباط مؤثر با هر نفر', 'شیوه‌ی ارائه و دریافت Feedback', 'نکاتی که اصطکاک شروع را کمتر می‌کنند'], 'بدون شخصیت‌شناسی، برچسب یا تعریف نقش.'),
        A('بک‌لاگ، مایل‌استون‌ها و Deadlineها', 30, ['مرور محصولات و پروژه‌های فعال', 'تفکیک Product Backlog از پروژه‌های مشتری', 'انتخاب اولویت‌های نزدیک', 'Outcome، پیگیر، Deadline، وابستگی و معیار پایان']),
        A('OKR و KPI', 15, ['توافق روی چند Outcome مهم', 'Baseline و Target', 'منبع داده', 'ریتم مرور شاخص‌ها']),
        A('QA، QC، تست، DoR و DoD', 25, ['تفاوت QA و QC', 'مسیر تست و بازبینی خروجی', 'Definition of Ready', 'Definition of Done', 'معیار بسته‌شدن یک Milestone']),
        A('اقدام‌ها و برنامه‌ی دو هفته‌ی اول', 15, ['تبدیل تصمیم‌ها به اقدام‌های کوچک', 'همراه یا پیگیر و موعد', 'تنظیم اولین Review', 'تنظیم Retro و بازبینی روش کار']),
      ],
      outputs: ['نسخه‌ی اول روش کار تیمی توافق و برای اجرا قفل شود.', 'بک‌لاگ و مایل‌استون‌های نزدیک اولویت‌بندی شوند.', 'Deadline و پیگیر هر خروجی روشن شوند.', 'OKR و KPIهای نسخه‌ی اول مشخص شوند.', 'فرایند QA، QC و تست جمع‌بندی شود.', 'DoR، DoD و معیار پایان مایل‌استون شفاف شوند.', 'برنامه‌ی دو هفته‌ی اول بسته شود.'],
      plan: [
        plan('روز ۱ تا ۳', 'گفت‌وگوهای کوتاه با اعضای تیم و مرور وضعیت واقعی کارها', '', 'تصویر مشترک از کارهای فعال و اصطکاک‌ها'),
        plan('روز ۱ تا ۷', 'مرتب‌کردن Backlog و آماده‌کردن آیتم‌های Ready', '', 'اولویت‌های نزدیک و معیارهای پذیرش روشن‌اند'),
        plan('روز ۸ تا ۱۴', 'اجرای روش توافق‌شده و آماده‌کردن اولین Review', '', 'حداقل یک چرخه‌ی کامل از Ready تا Done'),
        plan('پایان روز ۱۴', 'Retro کوتاه و بازبینی نسخه‌ی اول روش کار', '', 'موارد Keep، Change و Drop تصمیم شده‌اند'),
      ],
      metrics: [metric('زمان بیشتری به انسان برگردانیم', 'Time Returned نسبت به Baseline'), metric('کیفیت را هم‌زمان با سرعت حفظ کنیم', 'نرخ بازکاری و قبولی QC در تلاش اول'), metric('استفاده‌ی قابل اعتماد بسازیم', 'استفاده‌ی تکرارشونده و رضایت')],
      quality: QUALITY.fa,
    },
    weekly: {
      agenda: [
        A('وضعیت هفته‌ی گذشته', 10, ['چه چیزی Done شد', 'چه چیزی جا ماند و چرا']),
        A('Blockerها', 10, ['چه چیزی جلوی کار را گرفته', 'چه کسی می‌تواند بازش کند']),
        A('اولویت‌های این هفته', 15, ['حداکثر ۳ اولویت', 'پیگیر و موعد هر کدام']),
        A('تصمیم‌ها و Parking Lot', 5, ['ثبت تصمیم‌ها', 'موضوعاتی که به جلسه‌ی دیگری می‌روند']),
      ],
      outputs: ['اولویت‌های این هفته با پیگیر مشخص شوند.', 'Blockerهای باز صاحب داشته باشند.'],
      plan: [], metrics: [], quality: QUALITY.fa,
    },
    sprintPlanning: {
      agenda: [
        A('هدف اسپرینت', 10, ['یک جمله: این اسپرینت چه چیزی را عوض می‌کند؟', 'ظرفیت واقعی تیم (مرخصی، جلسات، کار پشتیبانی)']),
        A('انتخاب آیتم‌ها از Backlog', 25, ['فقط آیتم‌های Ready', 'ترتیب بر اساس ارزش و وابستگی', 'هر آیتم: معیار پذیرش و پیگیر']),
        A('شکستن به تسک‌های کوچک', 15, ['تسک‌های یک تا دو روزه', 'ریسک‌ها و وابستگی‌های بیرونی']),
        A('تعهد و جمع‌بندی', 10, ['آیا هدف اسپرینت با این آیتم‌ها محقق می‌شود؟', 'زمان Review و Retro', 'تصمیم‌ها و Parking Lot']),
      ],
      outputs: ['هدف اسپرینت در یک جمله توافق شود.', 'فهرست آیتم‌های اسپرینت با معیار پذیرش و پیگیر بسته شود.', 'زمان Review و Retro مشخص شود.'],
      plan: [plan('طول اسپرینت', 'اجرای آیتم‌های تعهدشده', '', 'هدف اسپرینت محقق شده'), plan('پایان اسپرینت', 'Sprint Review و Retro', '', 'بازخورد ثبت و اقدام‌ها مشخص شده')],
      metrics: [metric('پیش‌بینی‌پذیری تحویل', 'نسبت آیتم‌های Done به آیتم‌های تعهدشده'), metric('کیفیت', 'تعداد بازگشت از Review / QC')],
      quality: QUALITY.fa,
    },
    standup: {
      agenda: [
        A('دور سریع', 10, ['هر نفر: دیروز چه شد، امروز چه می‌کنم، چه چیزی جلویم است', 'حداکثر یک دقیقه برای هر نفر']),
        A('Blockerها', 5, ['چه کسی می‌تواند کمک کند؟ همین‌جا هماهنگ شود، نه بحث']),
        A('نگاه به هدف اسپرینت', 3, ['هنوز در مسیریم؟ چیزی باید جابه‌جا شود؟']),
        A('گفت‌وگوهای بعد از استندآپ', 2, ['موضوعاتی که دو نفر باید جدا حل کنند']),
      ],
      outputs: ['Blockerهای باز صاحب داشته باشند.', 'اگر هدف اسپرینت در خطر است، یک تصمیم ثبت شود.'],
      plan: [], metrics: [], quality: QUALITY.fa,
    },
    refinement: {
      agenda: [
        A('مرور آیتم‌های بالای Backlog', 20, ['برای هر آیتم: مسئله، نتیجه‌ی مورد انتظار، معیار پذیرش', 'سؤال‌های باز و وابستگی‌ها']),
        A('برآورد و شکستن', 15, ['آیتم بزرگ → چند آیتم کوچک', 'برآورد نسبی، نه ساعت دقیق']),
        A('علامت‌گذاری Ready', 5, ['کدام آیتم‌ها معیار DoR را پاس می‌کنند؟']),
        A('حذف و بایگانی', 5, ['آیتم‌هایی که دیگر ارزش ندارند']),
      ],
      outputs: ['آیتم‌های Ready برای اسپرینت بعد کافی باشند.', 'آیتم‌های بزرگ شکسته و آیتم‌های بی‌ارزش بایگانی شوند.'],
      plan: [], metrics: [], quality: QUALITY.fa,
    },
    sprintReview: {
      agenda: [
        A('هدف اسپرینت و نتیجه', 5, ['چه قولی داده بودیم؟ چه شد؟']),
        A('نمایش کار Done', 25, ['فقط کار واقعاً تمام‌شده، نه اسلاید', 'بازخورد ذی‌نفعان همین‌جا ثبت شود']),
        A('آنچه تمام نشد', 5, ['چرا؟ به اسپرینت بعد می‌رود یا حذف می‌شود؟']),
        A('به‌روزرسانی Backlog', 10, ['بازخوردها به آیتم تبدیل شوند', 'اولویت‌های بعدی']),
      ],
      outputs: ['بازخورد ذی‌نفعان به آیتم‌های Backlog تبدیل شود.', 'وضعیت آیتم‌های ناتمام تصمیم‌گیری شود.'],
      plan: [], metrics: [], quality: QUALITY.fa,
    },
    retro: {
      agenda: [
        A('تنظیم فضا', 5, ['هدف: بهترکردن روش، نه پیداکردن مقصر']),
        A('Keep — چه چیزی خوب بود', 15, ['چیزهایی که باید نگه داریم']),
        A('Change — چه چیزی را عوض کنیم', 15, ['اصطکاک‌ها و چیزهایی که کند می‌کنند']),
        A('Drop — چه چیزی را کنار بگذاریم', 10, ['فرایند یا عادتی که دیگر ارزش ندارد']),
        A('اقدام‌ها', 10, ['حداکثر ۳ اقدام با پیگیر و موعد']),
      ],
      outputs: ['فهرست Keep / Change / Drop توافق شود.', 'حداکثر ۳ اقدام با پیگیر و موعد.'],
      plan: [], metrics: [], quality: QUALITY.fa,
    },
    blank: { agenda: [A('شروع', 5, ['هدف جلسه'])], outputs: [], plan: [], metrics: [], quality: QUALITY.fa },
  },
  en: {
    alignment: {
      agenda: [
        A('Kickoff and focus', 5, ['Short review of the meeting goal', 'Confirm what we need by the end', 'Agree: anything off-track → Parking Lot']),
        A('Proposed way of working', 20, ['Planning and prioritization model', 'Backlog structure', 'Workflow states', 'Sync, review and retro rhythm', 'Handling change and blockers'], 'Listen and ask here; decide in the next block.'),
        A('Agree on the first version of the way of working', 15, ['Pick only the processes this team really needs', 'Agree on the tool and the source of truth', 'Lock version one for execution', 'Set a review date']),
        A('Working together', 10, ['How to communicate well with each person', 'How to give and receive feedback', 'What reduces friction at the start'], 'No personality typing, labels or role definitions.'),
        A('Backlog, milestones and deadlines', 30, ['Review active products and projects', 'Separate product backlog from client projects', 'Pick near-term priorities', 'Outcome, follower, deadline, dependencies and exit criteria']),
        A('OKR and KPI', 15, ['Agree on a few outcomes that matter', 'Baseline and target', 'Data source', 'Review cadence']),
        A('QA, QC, testing, DoR and DoD', 25, ['QA vs QC', 'Test and review path', 'Definition of Ready', 'Definition of Done', 'Milestone exit criteria']),
        A('Actions and the first two weeks', 15, ['Turn decisions into small actions', 'Companion or follower and due date', 'Schedule the first review', 'Schedule the retro']),
      ],
      outputs: ['Version one of the way of working agreed and locked.', 'Backlog and near-term milestones prioritized.', 'Deadline and follower clear for every output.', 'First-version OKRs and KPIs defined.', 'QA, QC and testing process wrapped up.', 'DoR, DoD and milestone exit criteria clear.', 'First two weeks planned.'],
      plan: [
        plan('Day 1–3', 'Short conversations with each team member; review the real state of work', '', 'Shared picture of active work and friction'),
        plan('Day 1–7', 'Tidy the backlog and prepare Ready items', '', 'Near-term priorities and acceptance criteria are clear'),
        plan('Day 8–14', 'Run the agreed way of working; prepare the first review', '', 'At least one full cycle from Ready to Done'),
        plan('End of day 14', 'Short retro and review of version one', '', 'Keep, Change and Drop decided'),
      ],
      metrics: [metric('Give more time back to people', 'Time returned vs. baseline'), metric('Keep quality while moving fast', 'Rework rate and first-pass QC rate'), metric('Build reliable use', 'Repeat use and satisfaction')],
      quality: QUALITY.en,
    },
    weekly: {
      agenda: [
        A('Last week', 10, ['What got Done', 'What slipped and why']),
        A('Blockers', 10, ['What is in the way', 'Who can unblock it']),
        A('Priorities this week', 15, ['At most 3 priorities', 'Follower and due date for each']),
        A('Decisions and Parking Lot', 5, ['Log decisions', 'Topics for another meeting']),
      ],
      outputs: ['Priorities for the week with a follower.', 'Every open blocker has an owner.'],
      plan: [], metrics: [], quality: QUALITY.en,
    },
    sprintPlanning: {
      agenda: [
        A('Sprint goal', 10, ['One sentence: what does this sprint change?', 'Real team capacity (leave, meetings, support work)']),
        A('Pick items from the backlog', 25, ['Ready items only', 'Order by value and dependencies', 'Each item: acceptance criteria and follower']),
        A('Break down into small tasks', 15, ['One- to two-day tasks', 'Risks and external dependencies']),
        A('Commit and wrap up', 10, ['Does this set of items achieve the goal?', 'Review and retro dates', 'Decisions and Parking Lot']),
      ],
      outputs: ['Sprint goal agreed in one sentence.', 'Sprint items with acceptance criteria and followers locked.', 'Review and retro dates set.'],
      plan: [plan('During the sprint', 'Deliver the committed items', '', 'Sprint goal achieved'), plan('End of sprint', 'Sprint review and retro', '', 'Feedback captured and actions defined')],
      metrics: [metric('Delivery predictability', 'Done items vs. committed items'), metric('Quality', 'Items sent back from review / QC')],
      quality: QUALITY.en,
    },
    standup: {
      agenda: [
        A('Quick round', 10, ['Each person: yesterday, today, what is in my way', 'One minute per person, max']),
        A('Blockers', 5, ['Who can help? Coordinate here, discuss later']),
        A('Sprint goal check', 3, ['Still on track? Anything to reshuffle?']),
        A('After-standup conversations', 2, ['Topics two people should settle separately']),
      ],
      outputs: ['Every open blocker has an owner.', 'If the sprint goal is at risk, a decision is logged.'],
      plan: [], metrics: [], quality: QUALITY.en,
    },
    refinement: {
      agenda: [
        A('Review the top of the backlog', 20, ['Per item: problem, expected outcome, acceptance criteria', 'Open questions and dependencies']),
        A('Estimate and split', 15, ['Big item → several small items', 'Relative sizing, not exact hours']),
        A('Mark as Ready', 5, ['Which items pass the DoR?']),
        A('Prune and archive', 5, ['Items that no longer earn their place']),
      ],
      outputs: ['Enough Ready items for the next sprint.', 'Big items split; stale items archived.'],
      plan: [], metrics: [], quality: QUALITY.en,
    },
    sprintReview: {
      agenda: [
        A('Sprint goal and outcome', 5, ['What did we promise? What happened?']),
        A('Show Done work', 25, ['Only really finished work, no slides', 'Capture stakeholder feedback right here']),
        A('What did not finish', 5, ['Why? Carry over or drop?']),
        A('Update the backlog', 10, ['Turn feedback into items', 'Next priorities']),
      ],
      outputs: ['Stakeholder feedback turned into backlog items.', 'Unfinished items decided: carry over or drop.'],
      plan: [], metrics: [], quality: QUALITY.en,
    },
    retro: {
      agenda: [
        A('Set the tone', 5, ['Goal: improve the method, not find blame']),
        A('Keep — what worked', 15, ['Things to keep doing']),
        A('Change — what to adjust', 15, ['Friction and what slows us down']),
        A('Drop — what to stop', 10, ['Process or habit that no longer earns its place']),
        A('Actions', 10, ['At most 3 actions with follower and due date']),
      ],
      outputs: ['Keep / Change / Drop list agreed.', 'At most 3 actions with follower and due date.'],
      plan: [], metrics: [], quality: QUALITY.en,
    },
    blank: { agenda: [A('Start', 5, ['Meeting goal'])], outputs: [], plan: [], metrics: [], quality: QUALITY.en },
  },
}

export function seedTemplate(id: TemplateId, lang: Lang): { agenda: AgendaItem[]; outputs: OutputItem[]; plan: PlanRow[]; metrics: MetricRow[]; quality: Quality } {
  const s = SEEDS[lang][id]
  return {
    agenda: s.agenda.map(a => ({ id: uid(), title: a.title, minutes: a.minutes, topics: [...a.topics], hint: a.hint, notes: '', summary: '', done: false, spentSec: 0 })),
    outputs: s.outputs.map(item),
    plan: s.plan.map(p => ({ ...p, id: uid() })),
    metrics: s.metrics.map(m => ({ ...m, id: uid() })),
    quality: {
      dor: s.quality.dor.map(q => ({ ...q, id: uid() })),
      dod: s.quality.dod.map(q => ({ ...q, id: uid() })),
      milestone: s.quality.milestone.map(q => ({ ...q, id: uid() })),
    },
  }
}
