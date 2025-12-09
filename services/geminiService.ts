import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { DetectedNumber, DetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyGesture = async (base64Image: string): Promise<DetectionResult> => {
  try {
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this image for a hand gesture representing a number.
            Identify specifically:
            - 0: Closed fist or 'OK' sign or 'O' shape.
            - 1: Index finger up.
            - 2: Index and Middle fingers up (Peace/V sign).
            - 5: Open palm (all 5 fingers).
            
            If the gesture is unclear, ambiguous, or no hand is visible, return null.
            Return a JSON object.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detected: {
              type: Type.INTEGER,
              nullable: true,
              description: "The detected number (0, 1, 2, 5) or null.",
            },
          },
          required: ["detected"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return { detected: null };

    const result = JSON.parse(jsonText);
    
    // Validate result is one of our expected numbers
    const num = result.detected;
    if (num === 0 || num === 1 || num === 2 || num === 5) {
      return { detected: num as DetectedNumber };
    }

    return { detected: null };
  } catch (error) {
    console.error("Gemini detection error:", error);
    return { detected: null };
  }
};
