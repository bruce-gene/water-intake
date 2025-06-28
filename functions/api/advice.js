// File: functions/api/advice.js
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    // We still use a "sanitized" request for maximum compatibility.
    const body = await request.json();

    // IMPORTANT: Create a new URL with the /advice path for our internal router in the worker.
    const url = new URL(request.url);
    url.pathname = '/advice'; // This tells the worker to use the handleAiAdvice function.

    const cleanRequest = new Request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // We call the SAME worker, but it will follow the new path.
    return await env.API_WORKER.fetch(cleanRequest);
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Proxy for AI advice failed.', details: e.message }), { status: 400 });
  }
}
