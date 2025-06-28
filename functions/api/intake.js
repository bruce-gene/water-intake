/**
 * Defensive Pages Function Proxy
 * This version does NOT perfectly forward the original request.
 * Instead, it extracts the JSON body and creates a BRAND NEW, clean
 * request to send to the backend worker. This isolates it from any
 * potential issues with the original request's headers or properties.
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // 1. Extract the JSON body from the original incoming request.
    const body = await request.json();

    // 2. Create a brand new, clean Request object.
    //    We only forward the essential parts: the body and the method.
    //    The URL here is a dummy placeholder, it's not used when calling a bound service.
    const cleanRequest = new Request(request.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // Use the extracted body
    });

    // 3. Send this new, clean request to the worker.
    return await env.API_INTAKE.fetch(cleanRequest);

  } catch (e) {
    // This will catch errors if the original request's body is not valid JSON.
    return new Response(JSON.stringify({ error: 'Failed to process request in proxy.', details: e.message }), {
      status: 400, // Bad Request, as the input from browser was likely bad.
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
