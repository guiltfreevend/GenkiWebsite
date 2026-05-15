// Temporary probe — does Cloudflare Pages run Functions for this project?
// Hit https://www.genki.bg/_pages_functions_probe → expect "ok" if yes.
// Delete this file once the answer is recorded.
export const onRequest = () => new Response("ok", {
  headers: { "content-type": "text/plain" },
});
