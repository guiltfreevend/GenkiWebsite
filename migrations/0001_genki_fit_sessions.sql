-- Genki Fit — сесии. Cloudflare D1 (SQLite).
--
-- ЗАЩО D1, А НЕ KV
--   Проектът има само KV (GENKI_RATE, GENKI_SCANS). KV е eventually
--   consistent и не е заявим: при прогресивно записване всяка стъпка е
--   read-modify-write, а при KV две бързи стъпки могат да се презапишат
--   взаимно и да изядат вече потвърден отговор. Точно това трябва да е
--   невъзможно. D1 е Cloudflare-native, durable, структуриран, заявим по
--   fit_code и се изнася в SQL/CSV за бъдещ CRM.
--
-- ПРИЛАГАНЕ
--   npx wrangler d1 execute genki-fit --file=migrations/0001_genki_fit_sessions.sql
--   (не е пускано — виж HANDOFF.md, раздела за production setup)

CREATE TABLE IF NOT EXISTS fit_sessions (
  -- Идентичност. fit_code е ПУБЛИЧЕН и се споделя с човека;
  -- session_token е ТАЙНА и никога не напуска браузъра на сесията.
  fit_code              TEXT    PRIMARY KEY,
  session_token         TEXT    NOT NULL,

  status                TEXT    NOT NULL DEFAULT 'in_progress',
  language              TEXT    NOT NULL DEFAULT 'bg',

  -- Машинните моменти са UTC; софийските са за човешко четене.
  created_at_utc        TEXT    NOT NULL,
  updated_at_utc        TEXT    NOT NULL,
  created_at_sofia      TEXT    NOT NULL,
  updated_at_sofia      TEXT    NOT NULL,
  last_completed_step   INTEGER NOT NULL DEFAULT 0,
  completed_at_utc      TEXT,
  completed_at_sofia    TEXT,

  -- Q1. Компанията е задължителна още на първата стъпка: трябва да знаем
  -- чий е офисът дори когато човекът спре по средата.
  company               TEXT    NOT NULL,
  q1_cities             TEXT,              -- JSON масив
  q1_sofia_offices      TEXT,
  largest_office_band   TEXT,              -- подотговорът на Q2 екрана

  q2_size_band          TEXT,

  q3_label              TEXT,
  q3_attendance_min     INTEGER,
  q3_attendance_max     INTEGER,           -- NULL = отворен край, не липса

  q4_current_setup      TEXT,              -- JSON масив
  q5_desired_value      TEXT,

  q6_budget_band        TEXT,              -- id на лентата, както сървърът я е генерирал
  q6_budget_min         INTEGER,
  q6_budget_max         INTEGER,

  -- Изведено от сървъра. Никога не идва от клиента.
  derived_hardware      TEXT,
  derived_route         TEXT,
  derived_ps_level      INTEGER,
  derived_outcome       TEXT,

  -- Доставка към клиента. Попълва се само ако човекът сам я поиска.
  customer_email        TEXT,
  customer_fit_sent_at  TEXT,

  -- Здраве на известяването. Имейлът НЕ е хранилище — това е само
  -- състояние на доставката.
  notify_status         TEXT,
  notify_attempts       INTEGER NOT NULL DEFAULT 0,
  notify_error          TEXT,
  notify_last_at        TEXT
);

-- Обновяването става САМО по таен токен, никога по публичния код.
CREATE UNIQUE INDEX IF NOT EXISTS idx_fit_sessions_token
  ON fit_sessions (session_token);

-- За вътрешни справки и бъдещ износ към CRM.
CREATE INDEX IF NOT EXISTS idx_fit_sessions_status
  ON fit_sessions (status, updated_at_utc);

CREATE INDEX IF NOT EXISTS idx_fit_sessions_company
  ON fit_sessions (company);
