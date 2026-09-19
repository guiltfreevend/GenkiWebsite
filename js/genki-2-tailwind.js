/* ==========================================================================
   Genki 2.0 — Tailwind конфигурация
   Не дефинира собствени стойности. Всяка стойност тук сочи към токен от
   css/genki-tokens.css. Ако цвят трябва да се смени — сменя се в токените,
   този файл не се пипа.

   Цветовете минават през rgb(var(--x-rgb) / <alpha-value>), за да работят
   Tailwind opacity модификаторите (bg-green-500/10 и т.н.).

   Внимание: theme.screens дублира breakpoint-ите от коментара в токените,
   защото CSS не приема var() в media query. Сменят се на двете места.
   ========================================================================== */

const ch = (name) => `rgb(var(${name}) / <alpha-value>)`;

tailwind.config = {
  /* Preflight се изключва нарочно. css/genki-2.css носи собствен base слой;
     ако preflight остане, неговият reset (h1 { font-size: inherit }) се
     инжектира СЛЕД нашия CSS и изяжда типографската скала. Редът на каскадата
     става: токени -> наш base -> наши компоненти -> Tailwind утилити. */
  corePlugins: { preflight: false },
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        /* Двете котви, достъпни под брандовите си имена */
        brand: ch('--genki-green-rgb'),
        accent: ch('--genki-green-vivid-rgb'),

        green: {
          50: ch('--green-50-rgb'),
          100: ch('--green-100-rgb'),
          200: ch('--green-200-rgb'),
          300: ch('--green-300-rgb'),
          400: ch('--green-400-rgb'),
          500: ch('--green-500-rgb'),
          600: ch('--green-600-rgb'),
          700: ch('--green-700-rgb'),
          800: ch('--green-800-rgb'),
          900: ch('--green-900-rgb'),
        },
        cream: {
          50: ch('--cream-50-rgb'),
          100: ch('--cream-100-rgb'),
          200: ch('--cream-200-rgb'),
          300: ch('--cream-300-rgb'),
        },
        ink: {
          50: ch('--ink-50-rgb'),
          100: ch('--ink-100-rgb'),
          200: ch('--ink-200-rgb'),
          300: ch('--ink-300-rgb'),
          400: ch('--ink-400-rgb'),
          500: ch('--ink-500-rgb'),
          600: ch('--ink-600-rgb'),
          700: ch('--ink-700-rgb'),
          800: ch('--ink-800-rgb'),
          900: ch('--ink-900-rgb'),
        },
        danger: ch('--danger-rgb'),
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        jp: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic',
             'Yu Gothic UI', 'Meiryo', 'Noto Sans JP', 'MS PGothic', 'sans-serif'],
      },

      fontSize: {
        xs:   'var(--text-xs)',
        sm:   'var(--text-sm)',
        base: 'var(--text-base)',
        lg:   'var(--text-lg)',
        xl:   'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
      },

      lineHeight: {
        tight:   'var(--leading-tight)',
        snug:    'var(--leading-snug)',
        normal:  'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
      },

      letterSpacing: {
        tight:  'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        wide:   'var(--tracking-wide)',
      },

      spacing: {
        gutter: 'var(--gutter)',
        'section-sm': 'var(--section-y-sm)',
        'section-md': 'var(--section-y-md)',
        'section-lg': 'var(--section-y-lg)',
        'header': 'var(--header-h)',
        'tap': 'var(--tap-min)',
      },

      maxWidth: {
        container: 'var(--container-max)',
        narrow: 'var(--container-narrow)',
        measure: 'var(--measure)',
        'measure-wide': 'var(--measure-wide)',
      },

      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        header: 'var(--shadow-header)',
        focus: 'var(--focus-ring)',
      },

      transitionTimingFunction: {
        out: 'var(--ease-out)',
      },

      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
      },

      zIndex: {
        header: 'var(--z-header)',
        menu: 'var(--z-menu)',
        skip: 'var(--z-skip)',
      },
    },
  },
};
