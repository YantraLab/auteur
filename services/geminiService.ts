import { GoogleGenAI, Part, Modality, Type } from "@google/genai";
import type { Note, Gear, GearType, ProjectSettings, TextNote, ImageNote, Board } from '../types';

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

export interface GenerationContext {
  notes: Note[];
  settings: ProjectSettings;
  gear: Gear;
  boards: Board[];
}

// Helper to build the common context prompt for all generation functions
const buildContextPrompt = (context: GenerationContext): Part[] => {
  const { notes, settings, gear, boards } = context;

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

  // Extract content from other relevant boards
  const characterProfileContent = boards.find(b => b.type === 'DOCUMENT_CHARACTER_PROFILE')?.content || "No character profiles provided.";
  const storyTreatmentContent = boards.find(b => b.type === 'DOCUMENT_STORY_TREATMENT')?.content || "No story treatment provided.";
  
  const promptParts: Part[] = [
    { text: `
You are an expert AI screenwriter and cinematographer. Your task is to help a filmmaker develop a project from their initial ideas.

You will be given a comprehensive context of their project, including:
1. Fragmented ideas, notes, and potentially inspirational images.
2. A desired cinematic style.
3. The project's technical specifications.
4. A list of their available equipment.
5. Detailed character profiles.
6. A story treatment or outline.

Based on ALL this information, you will generate a specific part of the production plan as requested.

---
**PROJECT CONTEXT:**

**NOTES & IDEAS:**
${notesContent}

**CINEMATIC STYLE:**
${settings.style}

**PROJECT SETTINGS:**
${settingsContent}

**AVAILABLE GEAR:**
${gearContent || "No gear specified."}

**CHARACTER PROFILES:**
${characterProfileContent}

**STORY TREATMENT:**
${storyTreatmentContent}

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

  return promptParts;
}

export async function generateScript(context: GenerationContext): Promise<string> {
    const model = "gemini-2.5-pro";
    const existingScript = context.boards.find(b => b.type === 'DOCUMENT_SCRIPT')?.content;

    const promptParts = buildContextPrompt(context);
    promptParts.push({ text: `
---
**YOUR TASK:**

Generate a complete script based on all the provided context.
Use simple markdown for formatting. For scene elements, use standard screenplay conventions: scene headings in all caps (INT. LOCATION - TIME), character names in all caps before their dialogue, and parentheticals in parentheses. This format is similar to Fountain syntax.
${existingScript 
    ? `An existing script draft has been provided below. Your task is to refine, expand, and improve upon this draft using the other notes and style guides provided. Do not start from scratch. Incorporate the new ideas into this existing structure.
---
**EXISTING DRAFT:**
${existingScript}
---`
    : ''
}
    `});

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: promptParts },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating script from Gemini API:", error);
        return "Error: Could not generate script. Please check your API key and network connection.";
    }
}

export async function generateVisualStyle(context: GenerationContext): Promise<string> {
    const model = "gemini-2.5-pro";
    const promptParts = buildContextPrompt(context);
    promptParts.push({ text: `
---
**YOUR TASK:**

Provide a concise summary of the visual style for this project based on all the provided context. 
Include notes on color palette, lighting, mood, and overall aesthetic. 
Consider how the project's aspect ratio, style description, and any provided images should influence the style.
Format your output as a single block of markdown.
---
    `});

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: promptParts },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating visual style from Gemini API:", error);
        return "Error: Could not generate visual style. Please check your API key and network connection.";
    }
}

export async function generateCinematography(context: GenerationContext): Promise<string> {
    const model = "gemini-2.5-pro";
    const promptParts = buildContextPrompt(context);
    promptParts.push({ text: `
---
**YOUR TASK:**

Provide a detailed shot list and cinematography plan based on all the provided context. 
For key shots or scenes, recommend specific gear from the provided list of available equipment. 
Your recommendations must be highly specific, practical, and directly reference the project settings and script. For example: "Given the 2.39:1 aspect ratio, frame this shot wider to emphasize the landscape." 
Justify your choices by explaining *how* that camera/lens combination achieves the desired look. If a smartphone is listed, provide professional guidance on how to maximize its cinematic potential.
Format your output as a single block of markdown.
---
    `});

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: promptParts },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating cinematography from Gemini API:", error);
        return "Error: Could not generate cinematography plan. Please check your API key and network connection.";
    }
}


export async function generateScriptBreakdown(scriptContent: string): Promise<string> {
  const model = 'gemini-2.5-pro';

  const prompt = `
You are an expert First Assistant Director (1st AD) in the film industry. Your task is to perform a detailed script breakdown of the provided screenplay content.

Analyze the script scene by scene and extract all the essential elements required for production planning.

For each scene, you MUST identify the following elements:
- sceneNumber: The sequential number of the scene.
- setting: The location setting (e.g., "INT. WAREHOUSE - NIGHT").
- characters: A list of all characters present in the scene.
- props: A list of all physical objects that are handled or are significant to the action.
- wardrobe: A list of specific clothing items or costumes mentioned.
- sfx: A list of any sound effects described.
- vfx: A list of any visual effects required.
- notes: Any other important production notes (e.g., specific camera actions, stunts, important story beats).

The provided script content is in a Fountain-like markdown format. Please parse it carefully.

Here is the script:
---
${scriptContent}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            breakdown: {
              type: Type.ARRAY,
              description: "An array of scene breakdown objects.",
              items: {
                type: Type.OBJECT,
                properties: {
                  sceneNumber: { type: Type.NUMBER, description: "Scene number." },
                  setting: { type: Type.STRING, description: "Scene heading (e.g., INT. LOCATION - TIME)." },
                  characters: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of characters." },
                  props: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of props." },
                  wardrobe: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of wardrobe items." },
                  sfx: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of sound effects." },
                  vfx: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of visual effects." },
                  notes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of production notes." },
                },
                required: ["sceneNumber", "setting", "characters", "props", "wardrobe", "sfx", "vfx", "notes"],
              }
            }
          }
        }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating script breakdown from Gemini API:", error);
    return JSON.stringify({ error: "Could not generate script breakdown. Please check your script content and API connection." });
  }
}

export async function generateCallSheet(breakdownContent: string, projectName: string): Promise<string> {
    const model = 'gemini-2.5-pro';

    const prompt = `
You are an expert Line Producer and First Assistant Director. Your task is to create a professional one-day call sheet for a film shoot based on the provided script breakdown data.

**Key Instructions:**
1.  **Analyze the Breakdown:** The provided JSON data contains a list of scenes with their settings, characters, and other details.
2.  **Create a Schedule:** Logically group scenes to create an efficient shooting day. Prioritize grouping scenes that share the same location to minimize company moves.
3.  **Assign Call Times:** Create a realistic schedule. The general crew call should be first, followed by specific call times for cast members based on when they are needed for their first scene of the day.
4.  **Fill in Details:** Populate all fields in the JSON schema. Use realistic placeholder data for information not present in the breakdown (e.g., actor names, crew names, weather forecast). The date should be tomorrow's date.
5.  **Output Format:** The final output MUST be a valid JSON object that adheres to the provided schema.

**Project Name:** ${projectName}

**Script Breakdown Data:**
---
${breakdownContent}
---
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        projectName: { type: Type.STRING, description: "The name of the project." },
                        date: { type: Type.STRING, description: "Date of the shoot (e.g., 'Tuesday, July 23, 2024')." },
                        generalCallTime: { type: Type.STRING, description: "General call time for most crew (e.g., '8:00 AM')." },
                        weather: { type: Type.STRING, description: "Brief weather forecast for the day (e.g., 'Sunny, High 75°F / 24°C')." },
                        nearestHospital: { type: Type.STRING, description: "Name and address of the nearest hospital to the primary location." },
                        scenes: {
                            type: Type.ARRAY,
                            description: "List of scenes scheduled for the day.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sceneNumber: { type: Type.NUMBER },
                                    setting: { type: Type.STRING, description: "INT./EXT. LOCATION - DAY/NIGHT" },
                                    description: { type: Type.STRING, description: "A brief one-line summary of the scene's action." },
                                    cast: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Character names in the scene." },
                                },
                            },
                        },
                        cast: {
                            type: Type.ARRAY,
                            description: "List of cast members for the day.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    characterName: { type: Type.STRING },
                                    actorName: { type: Type.STRING },
                                    callTime: { type: Type.STRING, description: "Individual call time (e.g., '9:30 AM')." },
                                },
                            },
                        },
                        crew: {
                            type: Type.ARRAY,
                            description: "Key crew positions and names.",
                             items: {
                                type: Type.OBJECT,
                                properties: {
                                    role: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                },
                            },
                        },
                    },
                },
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating call sheet from Gemini API:", error);
        return JSON.stringify({ error: "Could not generate call sheet. Please check the breakdown data and API connection." });
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