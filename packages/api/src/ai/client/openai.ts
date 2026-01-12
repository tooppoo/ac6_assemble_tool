import OpenAI from "openai";
import { AIClient, AIClientError, AIResponse } from "../ai-client";
import { Result } from "@praha/byethrow";

let client: OpenAI;
let model: string;

type EnvDTO = Pick<
  Cloudflare.Env,
  'OPENAI_API_KEY' | 'OPENAI_API_ENDPOINT' | 'OPENAI_API_MODEL'
>;

export class OpenAIClient implements AIClient {
  constructor(env: EnvDTO) {
    if (!client) {
      client = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        baseURL: env.OPENAI_API_ENDPOINT,
      });
    }
    if (!model) {
      model = env.OPENAI_API_MODEL ?? "gpt-5-nano-2025-08-07";
    }
  }

  async call(
    systemPrompt: string,
    userQuery: string,
  ): Promise<Result.Result<AIResponse, AIClientError>> {
    try {
      const aiResponse = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ],
      });

      const response = aiResponse.choices.reduce(
        (acc, choice) => acc + (choice.message.content ?? ""),
        ""
      );

      return Result.succeed({ response });
    } catch (error) {
      return Result.fail(
        new AIClientError("Failed to call OpenAI", "api_failed", error),
      );
    }
  }
}