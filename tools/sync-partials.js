#!/usr/bin/env node
/* ==========================================================================
   Genki 2.0 — синхронизация на header и footer

   Проблемът: 6 страници без build стъпка означава 6 копия на хедъра и
   футъра. Старият сайт носеше по ~170 реда дублиран markup на страница и
   всяка промяна в навигацията беше 9 отделни редакции.

   Решението: истината живее в tools/partials/. Страниците съдържат реален,
   статичен HTML между маркери, а този скрипт го преписва от партиала.

   Защо не JS вмъкване по време на изпълнение: навигацията трябва да е в
   изходния HTML — заради индексиране, заради работа без JavaScript и за да
   не мига страницата. Тук HTML-ът си остава пълен и статичен.

   Защо това не е build стъпка: сайтът се отваря и работи без да е пускан
   скриптът. Скриптът се пуска САМО когато се променя хедърът или футърът.

   Употреба:
     node tools/sync-partials.js          презаписва страниците
     node tools/sync-partials.js --check  само проверява (код 1 при разлика)
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PARTIALS_DIR = path.join(ROOT, 'tools', 'partials');
const PAGES_DIR = path.join(ROOT, 'v2');

const PARTIALS = ['header', 'footer'];
const checkOnly = process.argv.includes('--check');

function indentBlock(text, indent) {
  return text
    .replace(/\s+$/, '')
    .split('\n')
    .map((line) => (line.trim() === '' ? '' : indent + line))
    .join('\n');
}

function run() {
  const partials = {};
  for (const name of PARTIALS) {
    partials[name] = fs.readFileSync(path.join(PARTIALS_DIR, name + '.html'), 'utf8');
  }

  const pages = fs
    .readdirSync(PAGES_DIR)
    /* Файлове с префикс __ са временни/помощни и нямат партиали. */
    .filter((f) => f.endsWith('.html') && !f.startsWith('__'))
    .sort();

  let changed = 0;
  let missing = 0;

  for (const file of pages) {
    const full = path.join(PAGES_DIR, file);
    const original = fs.readFileSync(full, 'utf8');
    let next = original;

    for (const name of PARTIALS) {
      /* Маркерите се пазят — те са закотвянето за следващото пускане. */
      const re = new RegExp(
        '([ \\t]*)<!-- genki:' + name + ' -->[\\s\\S]*?<!-- /genki:' + name + ' -->',
        'g'
      );

      if (!re.test(next)) {
        console.error(`  ! ${file}: липсва маркер genki:${name}`);
        missing++;
        continue;
      }
      re.lastIndex = 0;

      next = next.replace(re, (match, indent) =>
        `${indent}<!-- genki:${name} -->\n` +
        `${indentBlock(partials[name], indent)}\n` +
        `${indent}<!-- /genki:${name} -->`
      );
    }

    if (next !== original) {
      changed++;
      if (checkOnly) {
        console.error(`  ✗ ${file} не е синхронизиран`);
      } else {
        fs.writeFileSync(full, next, 'utf8');
        console.log(`  ✓ ${file}`);
      }
    } else if (!checkOnly) {
      console.log(`  = ${file} (без промяна)`);
    }
  }

  if (missing) {
    console.error(`\nГрешка: ${missing} липсващи маркера.`);
    process.exit(1);
  }

  if (checkOnly) {
    if (changed) {
      console.error(`\n${changed} страници се разминават с партиалите. Пуснете: node tools/sync-partials.js`);
      process.exit(1);
    }
    console.log(`Всички ${pages.length} страници съвпадат с партиалите.`);
    return;
  }

  console.log(`\nГотово. ${pages.length} страници, ${changed} променени.`);
}

run();
