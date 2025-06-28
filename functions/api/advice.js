// File: functions/api/advice.js
// FINAL CORRECTED VERSION - NO IMPORT STATEMENTS.

/**
 * AI Advice Endpoint - Accesses AI directly from the environment binding.
 * This version is guaranteed to be compatible with all Cloudflare Pages environments.
 */
export async function onRequestPost(context) {
  // The 'env' object provided to Pages Functions contains all bindings, including AI.
  const { request, env } = context;

  try {
    // --- CRITICAL FIX: Access AI directly from the 'env' object. ---
    // The Ai class constructor is available on the binding itself.
    // This is the correct way to do it without using `import`.
    if (!env.AI) {
        throw new Error("AI binding is not configured. Please add the 'AI' binding to your Pages project settings.");
    }
    const ai = env.AI;
    
    // Get the user's data from the incoming request.
    const data = await request.json();

    // Craft a high-quality prompt for the AI model.
    const messages = [
      { role: 'system', content: 'You are a friendly hydration coach. Provide short, actionable, personalized hydration tips. Do not repeat numbers. Speak directly to the user. Keep the response to 2-3 main points, using bullet points or short paragraphs.' },
      { role: 'user', content: `Here is my data: I am ${data.age} years old, my gender is ${data.gender}, I weigh ${data.weightLbs.toFixed(0)} lbs, my activity level is '${data.activityLevel}', and I am ${data.isTropical ? '' : 'not '}in a tropical climate. Give me some personalized advice.`}
    ];

    // Run the AI model.
    const aiResponse = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
    
    // Return the AI's response directly to the frontend.
    return new Response(JSON.stringify(aiResponse), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e) {
    console.error("AI Advice Function Error:", e);
    return new Response(JSON.stringify({ error: 'Failed to get AI advice.', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
