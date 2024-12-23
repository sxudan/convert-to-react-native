import { ChatCompletionResponse } from "../types/gpt";

export async function generateCode(raw: string): Promise<string> {
    const apiKey =
    global.OPEN_AI; // Store your API key in environment variables
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            {
              role: "user",
              content: `Generate React Native typescript code with this DSL. Only provide the code, no explanation.:\n\n${raw}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });
      const json = (await response.json()) as object;
      if ("error" in json) {
        return (json.error as Error).message;
      }
      const data = json as ChatCompletionResponse;
      console.log("response", data);
      return data.choices[0].message.content;
    } catch (error) {
      console.error(error);
      return "Error generating code";
    }
  }