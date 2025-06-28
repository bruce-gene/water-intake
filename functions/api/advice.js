// File: functions/api/advice.js
// --- This now requires an import statement because Pages Functions run in a modern environment ---
import { Ai } from '@cloudflare/ai';

/**
 * AI Advice Endpoint - No longer a proxy.
 * This Pages Function directly accesses the AI binding from its context
 * and returns the AI-generated advice.
 */
export async function onRequestPost(context) {
  // The 'env' object provided to Pages Functions contains all bindings.
  const { request, env } = context;

  try {
    // 1. Initialize AI directly from the environment binding.
    //    This is the most reliable way to access bound services.
    const ai = new Ai(env.AI);
    
    // 2. Get the user's data from the incoming request.
    const data = await request.json();

    // 3. Craft a high-quality prompt for the AI model.
    const messages = [
      { role: 'system', content: 'You are a friendly hydration coach. Provide short, actionable, personalized hydration tips. Do not repeat numbers. Speak directly to the user. Keep the response to 2-3 main points, using bullet points or short paragraphs.' },
      { role: 'user', content: `Here is my data: I am ${data.age} years old, my gender is ${data.gender}, I weigh ${data.weightLbs.toFixed(0)} lbs, my activity level is '${data.activityLevel}', and I am ${data.isTropical ? '' : 'not '}in a tropical climate. Give me some personalized advice.`}
    ];

    // 4. Run the AI model.
    const aiResponse = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
    
    // 5. Return the AI's response directly to the frontend.
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
