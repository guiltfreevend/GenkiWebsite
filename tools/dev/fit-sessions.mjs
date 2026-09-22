/* ==========================================================================
   Genki Fit — преглед на записаните сесии. САМО за разработка.

   Пуска се с:
     node tools/dev/fit-sessions.mjs [път-до-sqlite]   # таблица
     node tools/dev/fit-sessions.mjs --json            # суров JSON
     node tools/dev/fit-sessions.mjs --code GF-K7M4-P9Q2

   По подразбиране чете базата, която оставят тестовете:
     tools/dev/.fit-test.sqlite

   ТОВА НЕ Е ADMIN ENDPOINT. Няма публичен адрес, няма HTTP сървър и няма
   достъп до production. Това е локален скрипт върху локален файл.

   Тайният session_token НЕ се показва — дори тук. Той е разрешение, а не
   информация, и няма причина да се чете от човек.
   ========================================================================== */

import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const codeIdx = args.indexOf('--code');
const wantCode = codeIdx !== -1 ? args[codeIdx + 1] : null;

const pathArg = args.find((a) => !a.startsWith('--') && a !== wantCode);
const dbPath = pathArg || fileURLToPath(new URL('./.fit-test.sqlite', import.meta.url));

if (!existsSync(dbPath)) {
  console.error('Няма база на този път: ' + dbPath);
  console.error('Пуснете първо: node tools/dev/test-genki-fit.mjs');
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });

const rows = wantCode
  ? db.prepare('SELECT * FROM fit_sessions WHERE fit_code = ?').all(wantCode)
  : db.prepare('SELECT * FROM fit_sessions ORDER BY updated_at_utc DESC').all();

if (!rows.length) {
  console.log('Няма записани сесии.');
  process.exit(0);
}

// Токенът не напуска базата.
const safe = rows.map(({ session_token, ...rest }) => rest);

if (asJson) {
  console.log(JSON.stringify(safe, null, 2));
  process.exit(0);
}

const dash = (v) => (v === null || v === undefined || v === '' ? '—' : String(v));

console.log('\n' + rows.length + ' сесии · ' + dbPath + '\n');

for (const r of safe) {
  const bar = '█'.repeat(r.last_completed_step) + '░'.repeat(6 - r.last_completed_step);
  console.log('─'.repeat(64));
  console.log(`${r.fit_code}   ${bar}  ${r.last_completed_step}/6   ${r.status}`);
  console.log(`  Компания        ${dash(r.company)}`);
  console.log(`  Q1 градове      ${dash(r.q1_cities)}   офиси в София: ${dash(r.q1_sofia_offices)}`);
  console.log(`  Q2 размер       ${dash(r.q2_size_band)}   най-голям: ${dash(r.largest_office_band)}`);
  // null при неотговорен въпрос е „няма отговор", не „отворен край".
  const attMax = !r.q3_label ? '—' : (r.q3_attendance_max === null ? 'отворен' : r.q3_attendance_max);
  console.log(`  Q3 посещаемост  ${dash(r.q3_label)}   min/max: ${dash(r.q3_attendance_min)}/${attMax}`);
  console.log(`  Q4 в офиса      ${dash(r.q4_current_setup)}`);
  console.log(`  Q5 желано       ${dash(r.q5_desired_value)}`);
  const budMax = !r.q6_budget_band ? '—'
    : (r.q6_budget_band === 'notsure' ? 'не е посочен'
      : (r.q6_budget_max === null ? 'отворен' : r.q6_budget_max));
  console.log(`  Q6 бюджет       ${dash(r.q6_budget_band)}   min/max: ${dash(r.q6_budget_min)}/${budMax}`);
  console.log(`  Изведено        хардуер ${dash(r.derived_hardware)} · маршрут ${dash(r.derived_route)} · PS ${dash(r.derived_ps_level)} · изход ${dash(r.derived_outcome)}`);
  console.log(`  Клиент          ${dash(r.customer_email)}   изпратен: ${dash(r.customer_fit_sent_at)}`);
  console.log(`  Известия        ${dash(r.notify_status)} · опити ${dash(r.notify_attempts)} · ${dash(r.notify_error)}`);
  console.log(`  Създадена       ${dash(r.created_at_sofia)}`);
  console.log(`  Обновена        ${dash(r.updated_at_sofia)}`);
  if (r.completed_at_sofia) console.log(`  Завършена       ${r.completed_at_sofia}`);
}
console.log('─'.repeat(64));
