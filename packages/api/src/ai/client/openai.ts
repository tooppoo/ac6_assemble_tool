import OpenAI from "openai";
import { AIClient, AIClientError, AIResponse } from "../ai-client";
import { Result } from "@praha/byethrow";

type EnvDTO = Pick<
  Cloudflare.Env,
  'OPENAI_API_KEY' | 'OPENAI_API_ENDPOINT' | 'OPENAI_API_MODEL'
>;

export function createOpenAIClient(env: EnvDTO): Result.Result<OpenAIClient, Error> {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    return Result.fail(new Error("OPENAI_API_KEY is not set in environment variables"));
  }
  const baseURL = env.OPENAI_API_ENDPOINT;
  if (!baseURL) {
    return Result.fail(new Error("OPENAI_API_ENDPOINT is not set in environment variables"));
  }

  const opanAI = new OpenAI({ apiKey, baseURL });
  const model = env.OPENAI_API_MODEL ?? "gpt-5-nano-2025-08-07";

  return Result.succeed(new OpenAIClient(opanAI, model));
}

export class OpenAIClient implements AIClient {
  constructor(
    private readonly client: OpenAI,
    private readonly model: string,
  ) {
  }

  async call(
    systemPrompt: string,
    userQuery: string,
  ): Promise<Result.Result<AIResponse, AIClientError>> {
    try {
      const aiResponse = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery }
        ],
      });

      if (aiResponse.choices.length === 0) {
        return Result.fail(
          new AIClientError("No choices returned from OpenAI", "invalid_format"),
        );
      }

      const response = aiResponse.choices.reduce(
        (acc, choice) => acc + (choice.message.content ?? ""),
        ""
      );

      if (response.trim() === "") {
        return Result.fail(
          new AIClientError("Empty response from OpenAI", "invalid_format"),
        );
      }

      return Result.succeed({ response });
    } catch (error) {
      return Result.fail(
        new AIClientError("Failed to call OpenAI", "api_failed", error),
      );
    }
  }
}