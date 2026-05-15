import OpenAI from "openai";

const BASE_URL = "https://api.deepseek.com";
const MODEL = "deepseek-chat";

export function getDeepseekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "your_deepseek_api_key_here") {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: BASE_URL,
    timeout: 28000,
    maxRetries: 0,
  });
}

export { MODEL };
