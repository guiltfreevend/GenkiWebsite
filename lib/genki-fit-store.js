// Genki Fit — сесиите. Достъп до Cloudflare D1.
//
// ПРИНЦИП
//   Имейлът НЕ е хранилище. Каноничната истина за една Fit сесия е този
//   запис. Известието към Genki тръгва СЛЕД успешен запис и провалът му
//   никога не отменя вече записани отговори.
//
// ЕДНА СЕСИЯ = ЕДИН КОД
//   fit_code се ражда при първата потвърдена стъпка и живее до края —
//   през Q2–Q6, през завършването и през изпращането на имейл до клиента.
//
// ДВА ИДЕНТИФИКАТОРА, РАЗЛИЧНИ РОЛИ
//   • fit_code       — публичен. Човекът го вижда, казва го по телефона.
//                      Това е РЕФЕРЕНЦИЯ, не разрешение.
//   • session_token  — таен, висока ентропия. Само с него се променя
//                      сесия. Никога не влиза в имейл към клиента, нито
//                      в URL.

import { machineTimestamp, formatSofiaDateTime } from './genki-time.js';
import {
  attendanceBounds, budgetBands, findBand, hardwareCandidate, recommend,
} from './genki-fit-logic.js';

export const STATUS = { IN_PROGRESS: 'in_progress', COMPLETED: 'completed' };

/* ==========================================================================
   1. Таен токен за обновяване
   ========================================================================== */

/**
 * 32 шестнайсетични знака ≈ 128 бита. Нарочно не е четим от човек:
 * не бива да се бърка с Genki Fit кода и не бива да се преписва.
 */
export function newSessionToken(randomSource) {
  const bytes = new Uint8Array(16);
  const src = randomSource || (typeof crypto !== 'undefined' && crypto.getRandomValues
    ? (arr) => crypto.getRandomValues(arr) : null);
  if (src) src(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);

  let out = '';
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

/* ==========================================================================
   2. Изведените полета

   Смятат се ТУК, от вече валидираните отговори. Нищо изведено не се
   приема от клиента — нито хардуер, нито PS ниво, нито препоръка.
   ========================================================================== */

/**
 * Каквото е детерминирано с наличното. След Q3 вече знаем вероятния
 * хардуер; пълната препоръка изисква Q6.
 */
export function deriveFields(a) {
  const out = {
    hardware: null, route: null, psLevel: null, outcome: null,
    attendanceMin: null, attendanceMax: null,
    budgetMin: null, budgetMax: null,
  };

  const bounds = a.q3 ? attendanceBounds(a.q3) : null;
  if (bounds) {
    out.attendanceMin = bounds.min;
    out.attendanceMax = bounds.max;
    out.hardware = hardwareCandidate(bounds.min);
  }

  if (a.q2 && a.q3 && a.q5 && a.q6) {
    const set = budgetBands(a.q2, a.q3, a.q5);
    const band = set ? findBand(set, a.q6) : null;
    if (band) {
      out.budgetMin = band.min;
      out.budgetMax = band.max;
    }
    const rec = recommend(a);
    if (rec) {
      out.route = rec.approach;
      out.psLevel = rec.psLevel;
      out.outcome = rec.outcome;
      out.hardware = rec.hardware;
    }
  }

  return out;
}

/* ==========================================================================
   3. Ред ↔ обект
   ========================================================================== */

const parseList = (v) => {
  if (!v) return [];
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch (e) { return []; }
};

export function rowToSession(row) {
  if (!row) return null;
  return {
    fitCode: row.fit_code,
    status: row.status,
    language: row.language,

    createdAtUtc: row.created_at_utc,
    updatedAtUtc: row.updated_at_utc,
    createdAtSofia: row.created_at_sofia,
    updatedAtSofia: row.updated_at_sofia,
    lastCompletedStep: row.last_completed_step,
    completedAtUtc: row.completed_at_utc,
    completedAtSofia: row.completed_at_sofia,

    company: row.company,
    q1: { cities: parseList(row.q1_cities), sofiaOffices: row.q1_sofia_offices },
    largestOffice: row.largest_office_band,
    q2: row.q2_size_band,
    q3: row.q3_label,
    attendanceMin: row.q3_attendance_min,
    attendanceMax: row.q3_attendance_max,
    q4: parseList(row.q4_current_setup),
    q5: row.q5_desired_value,
    q6: row.q6_budget_band,
    budgetMin: row.q6_budget_min,
    budgetMax: row.q6_budget_max,

    hardware: row.derived_hardware,
    route: row.derived_route,
    psLevel: row.derived_ps_level,
    outcome: row.derived_outcome,

    customerEmail: row.customer_email,
    customerFitSentAt: row.customer_fit_sent_at,

    notifyStatus: row.notify_status,
    notifyAttempts: row.notify_attempts,
    notifyError: row.notify_error,
    notifyLastAt: row.notify_last_at,
  };
}

/* ==========================================================================
   4. Заявки

   Нарочно малко и фиксирани. Нищо не се сглобява от потребителски вход.
   ========================================================================== */

const SQL_INSERT = `
INSERT INTO fit_sessions (
  fit_code, session_token, status, language,
  created_at_utc, updated_at_utc, created_at_sofia, updated_at_sofia,
  last_completed_step, company,
  q1_cities, q1_sofia_offices, largest_office_band,
  q2_size_band, q3_label, q3_attendance_min, q3_attendance_max,
  q4_current_setup, q5_desired_value,
  q6_budget_band, q6_budget_min, q6_budget_max,
  derived_hardware, derived_route, derived_ps_level, derived_outcome
) VALUES (?,?,?,?, ?,?,?,?, ?,?, ?,?,?, ?,?,?,?, ?,?, ?,?,?, ?,?,?,?)`;

// Целият набор отговори се презаписва наведнъж. Така връщането назад и
// смяната на Q2 наистина изчиства зависимите Q3 и Q6, вместо да оставя
// сесията вътрешно противоречива.
const SQL_UPDATE = `
UPDATE fit_sessions SET
  status = ?, language = ?,
  updated_at_utc = ?, updated_at_sofia = ?,
  last_completed_step = ?,
  completed_at_utc = ?, completed_at_sofia = ?,
  company = ?,
  q1_cities = ?, q1_sofia_offices = ?, largest_office_band = ?,
  q2_size_band = ?, q3_label = ?, q3_attendance_min = ?, q3_attendance_max = ?,
  q4_current_setup = ?, q5_desired_value = ?,
  q6_budget_band = ?, q6_budget_min = ?, q6_budget_max = ?,
  derived_hardware = ?, derived_route = ?, derived_ps_level = ?, derived_outcome = ?
WHERE session_token = ?`;

const SQL_BY_TOKEN = 'SELECT * FROM fit_sessions WHERE session_token = ?';
const SQL_BY_CODE = 'SELECT * FROM fit_sessions WHERE fit_code = ?';

const SQL_SET_EMAIL = `
UPDATE fit_sessions SET
  customer_email = ?, customer_fit_sent_at = ?,
  updated_at_utc = ?, updated_at_sofia = ?
WHERE session_token = ?`;

const SQL_SET_NOTIFY = `
UPDATE fit_sessions SET
  notify_status = ?, notify_attempts = ?, notify_error = ?, notify_last_at = ?
WHERE fit_code = ?`;

export const STATEMENTS = {
  insert: SQL_INSERT, update: SQL_UPDATE, byToken: SQL_BY_TOKEN,
  byCode: SQL_BY_CODE, setEmail: SQL_SET_EMAIL, setNotify: SQL_SET_NOTIFY,
};

function sofia(ts) {
  return formatSofiaDateTime(ts, 'bg', { seconds: true, suffix: true });
}

function answerValues(a, derived) {
  return [
    a.q1 && a.q1.cities && a.q1.cities.length ? JSON.stringify(a.q1.cities) : null,
    (a.q1 && a.q1.sofiaOffices) || null,
    a.largestOffice || null,
    a.q2 || null,
    a.q3 || null,
    derived.attendanceMin, derived.attendanceMax,
    a.q4 && a.q4.length ? JSON.stringify(a.q4) : null,
    a.q5 || null,
    a.q6 || null,
    derived.budgetMin, derived.budgetMax,
    derived.hardware, derived.route, derived.psLevel, derived.outcome,
  ];
}

/**
 * Създава сесията при ПЪРВАТА потвърдена стъпка. Не при зареждане на
 * страницата, не при фокус и не при първия натиснат клавиш.
 */
export async function createSession(db, { fitCode, token, company, answers, step, lang }) {
  const now = machineTimestamp();
  const nowSofia = sofia(now);
  const derived = deriveFields(answers);
  const status = step >= 6 ? STATUS.COMPLETED : STATUS.IN_PROGRESS;

  await db.prepare(SQL_INSERT).bind(
    fitCode, token, status, lang,
    now, now, nowSofia, nowSofia,
    step, company,
    ...answerValues(answers, derived)
  ).run();

  return getSessionByToken(db, token);
}

export async function getSessionByToken(db, token) {
  if (!token) return null;
  const row = await db.prepare(SQL_BY_TOKEN).bind(token).first();
  return rowToSession(row);
}

export async function getSessionByCode(db, code) {
  if (!code) return null;
  const row = await db.prepare(SQL_BY_CODE).bind(code).first();
  return rowToSession(row);
}

/**
 * Обновява СЪЩАТА сесия. Идентичността (fit_code, created_at) е
 * непроменима — не е сред колоните, които заявката пипа.
 */
export async function updateSession(db, token, { company, answers, step, lang, existing }) {
  const now = machineTimestamp();
  const nowSofia = sofia(now);
  const derived = deriveFields(answers);
  const completed = step >= 6;

  // Веднъж завършена, сесията не се „раззавършва" при по-ранна стъпка.
  const status = completed || existing.status === STATUS.COMPLETED
    ? STATUS.COMPLETED : STATUS.IN_PROGRESS;
  const completedUtc = completed && !existing.completedAtUtc ? now : existing.completedAtUtc;
  const completedSofia = completed && !existing.completedAtSofia
    ? nowSofia : existing.completedAtSofia;

  // Стъпката не се връща назад: „докъде е стигнал" е най-далечната
  // потвърдена стъпка, а не последната пипната.
  const lastStep = Math.max(step, existing.lastCompletedStep || 0);

  await db.prepare(SQL_UPDATE).bind(
    status, lang,
    now, nowSofia,
    lastStep,
    completedUtc, completedSofia,
    company,
    ...answerValues(answers, derived),
    token
  ).run();

  return getSessionByToken(db, token);
}

/** Адресът на клиента се пази само ако човекът сам го е дал. */
export async function setCustomerEmail(db, token, email) {
  const now = machineTimestamp();
  await db.prepare(SQL_SET_EMAIL).bind(email, now, now, sofia(now), token).run();
  return getSessionByToken(db, token);
}

/** Състояние на известяването. Не отменя нито един записан отговор. */
export async function setNotifyState(db, fitCode, { status, attempts, error }) {
  await db.prepare(SQL_SET_NOTIFY).bind(
    status, attempts, error ? String(error).slice(0, 300) : null,
    machineTimestamp(), fitCode
  ).run();
}

/* ==========================================================================
   5. Моментна снимка за известието

   Всяко известие носи ВСИЧКО, което се знае дотук — не само новата
   стъпка. Ако човек спре след Q3, писмото пак съдържа Q1 + Q2 + Q3.
   ========================================================================== */

export function sessionSnapshot(session) {
  return {
    fitCode: session.fitCode,
    status: session.status,
    lastCompletedStep: session.lastCompletedStep,
    language: session.language,
    company: session.company,
    q1: session.q1,
    largestOffice: session.largestOffice,
    q2: session.q2,
    q3: session.q3,
    attendanceMin: session.attendanceMin,
    attendanceMax: session.attendanceMax,
    q4: session.q4,
    q5: session.q5,
    q6: session.q6,
    budgetMin: session.budgetMin,
    budgetMax: session.budgetMax,
    hardware: session.hardware,
    route: session.route,
    psLevel: session.psLevel,
    outcome: session.outcome,
    customerEmail: session.customerEmail,
    customerFitSentAt: session.customerFitSentAt,
    createdAtSofia: session.createdAtSofia,
    updatedAtSofia: session.updatedAtSofia,
    completedAtSofia: session.completedAtSofia,
    createdAtUtc: session.createdAtUtc,
    updatedAtUtc: session.updatedAtUtc,
  };
}
