
import { OpenAI } from "openai";
import { getRealTimeContext } from "@/lib/context-engine";
import { NextResponse } from "next/server";

// Initialize OpenAI client
// Note: In a real deployment, ensure OPENAI_API_KEY is set in .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

export async function POST() {
    try {
        const context = await getRealTimeContext();

        // If no API key, return a "real-time" but deterministic mock based on weather
        if (!process.env.OPENAI_API_KEY) {
            // Simple mock logic based on context
            const mockVibes = [
                `It is ${context.time} and ${context.weather}. The timeline feels fragile.`,
                `Current mood: ${context.weather} with a chance of existential dread.`,
                `Campus creates a ${context.weather} texture. We are all just polygons.`,
            ];
            return NextResponse.json({
                vibe: mockVibes[Math.floor(Math.random() * mockVibes.length)],
                context
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are the consciousness of a Gen-Z art university. Be brief, poetic, ironic, and use lowercase. Describe the current mood based on the provided weather and time context."
                },
                {
                    role: "user",
                    content: `Current Context: ${JSON.stringify(context)}`
                },
            ],
        });

        const vibe = completion.choices[0].message.content;
        return NextResponse.json({ vibe, context });

    } catch (error) {
        console.error("Vibe generation error:", error);
        return NextResponse.json({
            vibe: "Static noise in the void. (Error generating vibe)",
            context: null
        }, { status: 500 });
    }
}
