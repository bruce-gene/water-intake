// File: functions/api/advice.js
// ULTIMATE PROMPT - Forces AI to base advice on the provided calculation result.

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    if (!env.AI) {
        throw new Error("AI binding is not configured. Please add the 'AI' binding to your Pages project settings.");
    }
    const ai = env.AI;
    
    // We now expect the frontend to send the calculated result along with the user profile.
    const data = await request.json();
    const { userProfile, calculationResult } = data;

    if (!userProfile || !calculationResult) {
        throw new Error("Missing user profile or calculation result in the request.");
    }

    // --- ULTIMATE PROMPT ENGINEERING ---
    const messages = [
      {
        role: 'system',
        content: `You are a professional health and wellness advisor.
        **CRITICAL MISSION:** Your primary goal is to help the user achieve the SPECIFIC hydration target that has been calculated for them. All of your advice must directly support this calculated goal. Do not suggest alternative amounts or general ranges like '8 glasses'.
        
        **CRITICAL INSTRUCTIONS:**
        1.  Base ALL your advice on the provided "Calculated Daily Goal".
        2.  Translate the calculated goal into practical, actionable steps. For example, how to break it down throughout the day.
        3.  Your entire response must be in PLAIN TEXT. DO NOT use any Markdown (no *, -, #, etc.).
        4.  Structure the response into 2-3 short, distinct paragraphs.
        5.  Maintain a professional, encouraging, and trustworthy tone.`
      },
      {
        role: 'user',
        content: `My personalized calculation has determined my **Calculated Daily Goal is: ${calculationResult.displayText} (which is ${calculationResult.totalLiters} Liters)**.
        My profile is: Age: ${userProfile.age}, Gender: ${userProfile.gender}, Weight: ${userProfile.weightLbs.toFixed(0)} lbs, Activity: '${userProfile.activityLevel}', Climate: ${userProfile.isTropical ? 'Tropical' : 'Temperate'}.
        
        Based on my specific goal of **${calculationResult.displayText}**, please give me personalized tips on how to achieve it.`
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
