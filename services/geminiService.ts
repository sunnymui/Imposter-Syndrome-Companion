import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const analyzeImposterThought = async (thought: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a compassionate cognitive behavioral therapy coach. A user is sharing a thought related to imposter syndrome. Their thought is: "${thought}". First, identify any cognitive distortions in this thought (e.g., 'all-or-nothing thinking', 'mind reading', 'discounting the positive'). Then, offer a gentle and supportive reframing of this thought. Present your response in a clear, encouraging, and easy-to-understand way. Do not be preachy. Be a supportive friend. Use markdown for formatting, like bolding the identified distortion.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing thought:", error);
    return "I'm having a little trouble connecting right now. Please try again in a moment. Remember, the very fact that you're reflecting on this shows incredible self-awareness.";
  }
};

export const celebrateWin = async (win: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an encouraging mentor. A user just logged a personal or professional achievement: "${win}". Your task is to celebrate this win with them. Write a short, uplifting message (2-3 sentences) that acknowledges their success and helps them recognize the skills, effort, and personal qualities they demonstrated to achieve it. Frame it to counteract imposter syndrome.`
    });
    return response.text;
  } catch (error) {
    console.error("Error celebrating win:", error);
    return "That's a fantastic achievement! Well done.";
  }
};

export const generateAffirmations = async (wins: string[]): Promise<string[]> => {
  if (wins.length === 0) {
    return [
      "I am capable and competent.",
      "I am growing and learning every day.",
      "I belong in the spaces I occupy."
    ];
  }
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert in positive psychology. Based on the following list of a user's achievements: ${wins.join(', ')}. Generate an array of 3 unique, powerful, first-person affirmations that will help them internalize their competence and overcome imposter syndrome. The affirmations should be short and directly related to the skills and successes demonstrated in their achievements.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    affirmations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        }
    });
    
    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return result.affirmations || [];

  } catch (error) {
    console.error("Error generating affirmations:", error);
    return [
      "I trust in my abilities and skills.",
      "My hard work leads to meaningful results.",
      "I acknowledge my accomplishments and celebrate them."
    ];
  }
};

export const getQuickPepTalk = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'You are a supportive friend. A user needs a quick confidence boost to a fight off a wave of imposter syndrome. Provide a very short (1-2 sentence), powerful, and encouraging pep talk. Be direct and uplifting.'
        });
        return response.text;
    } catch (error) {
        console.error("Error getting pep talk:", error);
        return "You are more capable than you think. Take a deep breath. You've got this."
    }
};

export const analyzeProgress = async (weeklyData: { label: string; count: number }[]): Promise<string> => {
  try {
    const prompt = `You are a positive and insightful coach. A user is tracking their "wins" to combat imposter syndrome. Here is their data for the number of wins they've logged over the past several weeks: ${JSON.stringify(weeklyData)}.
    
    Write a short (2-4 sentences), encouraging summary of their progress. Focus on consistency, effort, and the value of tracking accomplishments, regardless of the numbers. If they have a week with zero wins, frame it positively as a normal part of the process or an opportunity for reflection. Do not be overly data-driven; be human and supportive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing progress:", error);
    return "I'm having a little trouble connecting right now, but looking at your chart, you're putting in the work to recognize your own value. That's a huge win in itself. Keep going!";
  }
};