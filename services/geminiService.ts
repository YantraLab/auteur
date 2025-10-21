import { GoogleGenAI, Part, Modality } from "@google/genai";
import type { Note, Gear, GearType, ProjectSettings, TextNote, ImageNote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert data URL to a generative part
function fileToGenerativePart(dataUrl: string): Part {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL');
  }
  const mimeType = match[1];
  const data = match[2];
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

export async function generateScriptAndRecommendations(notes: Note[], style: string, gear: Gear, settings: Omit<ProjectSettings, 'style'>): Promise<string> {
  const model = "gemini-2.5-pro";
  
  const textNotes = notes.filter(n => n.type === 'text') as TextNote[];
  const imageNotes = notes.filter(n => n.type === 'image') as ImageNote[];

  const notesContent = textNotes.map(n => `- ${n.content}`).join('\n') || "No text notes provided.";
  
  const gearByType = gear.items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<GearType, typeof gear.items>);

  const gearContent = Object.entries(gearByType)
    .map(([type, items]) => {
      const itemsList = items.map(item => `- ${item.name}`).join('\n');
      return `${type}s:\n${itemsList}`;
    })
    .join('\n\n');
  
  const settingsContent = `
- Frame Rate: ${settings.frameRate}
- Aspect Ratio: ${settings.aspectRatio}
- Target Resolution: ${settings.resolution}
  `.trim();

  const promptParts: Part[] = [
    { text: `
You are an expert AI screenwriter and cinematographer. Your task is to help a filmmaker develop a project from their initial ideas.

You will be given the following:
1. A list of fragmented ideas, notes, and potentially inspirational images.
2. A desired cinematic style.
3. The project's technical specifications (frame rate, aspect ratio, resolution).
4. A list of the filmmaker's available equipment (cameras, lenses, tripods, etc.).

Based on ALL this information, you MUST generate a response in a single block of markdown that includes the following sections, in this exact order and with the exact formatting shown below. Use standard markdown for formatting. If images are provided, incorporate their mood, color, and subject matter into your recommendations.

---
# 🎬 SCRIPT

(Generate a complete, professionally formatted script based on the notes and in the requested style. Use markdown for formatting like **bold**, *italics*, and > for blockquotes. The script should be detailed, with scenes, visuals, and narration/dialogue.)

---
# 🎨 VISUAL STYLE

(Provide a concise summary of the visual style. Include notes on color palette, lighting, mood, and overall aesthetic. Consider how the project's aspect ratio and provided images influence the style.)

---
# 🎥 CINEMATOGRAPHY & GEAR

(Provide a detailed shot list and cinematography plan. For key shots or scenes, recommend specific gear from the provided list of available equipment. Your recommendations must be highly specific, practical, and directly reference the project settings. For example: "Given the 2.39:1 aspect ratio, frame this shot wider to emphasize the landscape." Justify your choices by explaining *how* that camera/lens combination achieves the desired look. If a smartphone is listed, provide professional guidance on how to maximize its cinematic potential, including specific settings (e.g., "Shoot in ProRes LOG at 24fps"), which of its built-in lenses to use, and techniques to overcome its limitations.)
---

Here is the user's input:

**NOTES:**
${notesContent}

**STYLE:**
${style}

**PROJECT SETTINGS:**
${settingsContent}

**AVAILABLE GEAR:**
${gearContent || "No gear specified."}

**INSPIRATIONAL IMAGES (if any) follow:**
` },
  ];

  for (const imageNote of imageNotes) {
    try {
      promptParts.push(fileToGenerativePart(imageNote.imageUrl));
      if (imageNote.caption) {
        promptParts.push({ text: `\nImage Caption: ${imageNote.caption}\n` });
      }
    } catch (e) {
      console.error(`Skipping invalid image note ${imageNote.id}:`, e);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: promptParts },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    return "Error: Could not generate content. Please check your API key and network connection.";
  }
}

export async function generateImageFromText(prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-image';

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }

    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image from Gemini API:", error);
    throw new Error("Could not generate image. Please check your prompt and API key.");
  }
}
