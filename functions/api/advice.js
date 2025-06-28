// File: functions/api/advice.js
// FINAL VERSION with Optimized AI Prompt

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env.AI) {
        throw new Error("AI binding is not configured. Please add the 'AI' binding to your Pages project settings.");
    }
    const ai = env.AI;
    const data = await request.json();

    // --- OPTIMIZED PROMPT ENGINEERING ---
    const messages = [
      {
        role: 'system',
        content: `You are a professional health and wellness advisor with deep expertise in nutrition and hydration science. Your persona is knowledgeable, trustworthy, and encouraging. 
        **CRITICAL INSTRUCTIONS:** 
        1. Your entire response must be in PLAIN TEXT.
        2. DO NOT use any Markdown formatting like asterisks for bold (*), dashes for lists (-), or any other special characters.
        3. Structure your response into 2 or 3 short, distinct paragraphs. Each paragraph should be a single block of text.
        4. Provide actionable, personalized advice based on the user's data. Do not repeat their input numbers.
        5. Maintain a professional yet accessible tone.`
      },
      {
        role: 'user',
        content: `Based on my profile (Age: ${data.age}, Gender: ${data.gender}, Weight: ${data.weightLbs.toFixed(0)} lbs, Activity: '${data.activityLevel}', Climate: ${data.isTropical ? 'Tropical' : 'Temperate'}), please provide me with personalized hydration advice.`
      }
    ];

    const aiResponse = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
    
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
