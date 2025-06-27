/**
 * This is a Pages Function that will handle POST requests to /api/calculate.
 */
export async function onRequestPost(context) {
  // context.env CONTAINS ALL YOUR BINDINGS, INCLUDING THE ONE WE JUST MADE.
  const { env } = context;

  // Forward the original request to our bound Worker service.
  // env.API_WORKER is our bound service. The .fetch() method calls it.
  // This is a zero-latency internal call, not a public HTTP request.
  try {
    // We call the bound worker service and pass the request to it.
    const response = await env.API_WORKER.fetch(context.request);
    
    // Return the response from the worker directly to the browser.
    return response;

  } catch (error) {
    console.error("Error calling the API_WORKER:", error);
    return new Response(JSON.stringify({ error: 'Failed to communicate with the calculation service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}