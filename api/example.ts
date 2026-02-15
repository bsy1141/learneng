import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const word = String(body?.word ?? "").trim();
    const meaning = String(body?.meaning ?? "").trim();

    if (!word) {
      res.status(400).json({ error: "word is required" });
      return;
    }

    const model = process.env.OPENAI_MODEL || "gpt-5";
    const prompt = `Make one natural English sentence using the word "${word}".${
      meaning ? ` The meaning is "${meaning}".` : ""
    } Keep it concise and suitable for learners.`;

    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const sentence = response.output_text?.trim() || "";

    res.status(200).json({ sentence });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    res.status(500).json({ error: message });
  }
}
