// ВРЕМЕННА диагностика. Махни я веднага след употреба.
//
// Отговаря на въпроса „вижда ли Pages Function средата RESEND_API_KEY и
// GENKI_RATE" — и дали проблемът е грешно име, или грешна среда.
//
// НИКОГА не връща стойности. Само дали ключът съществува, какъв е типът му
// и дължината му. Дължината различава празен низ от истински ключ, без да
// издава нищо от него.

const json = (b) => new Response(JSON.stringify(b, null, 2), {
  status: 200,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function onRequest({ env }) {
  const e = env || {};

  const describe = (k) => {
    const v = e[k];
    if (v === undefined) return 'липсва';
    if (v === null) return 'null';
    if (typeof v === 'object') {
      // KV namespace се познава по това, че има get/put.
      const kv = typeof v.get === 'function' && typeof v.put === 'function';
      return kv ? 'KV binding' : 'обект';
    }
    if (typeof v === 'string') return v.length > 0 ? 'зададен' : 'ПРАЗЕН';
    return typeof v;
  };

  return json({
    expected: {
      RESEND_API_KEY: describe('RESEND_API_KEY'),
      GENKI_RATE: describe('GENKI_RATE'),
      PREVIEW_TOKEN: describe('PREVIEW_TOKEN'),
      COMING_SOON: describe('COMING_SOON'),
    },
    // Брой на зададените неща в средата. Помага да се види дали изобщо
    // нещо е стигнало дотук. Имена и стойности не се изнасят.
    total: Object.keys(e).length,
  });
}
