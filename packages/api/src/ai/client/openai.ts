import { logger } from '@ac6_assemble_tool/shared/logger'
import { Result } from '@praha/byethrow'
import OpenAI from 'openai'

import type { AIClient, AIResponse } from '../ai-client'
import { AIClientError } from '../ai-client'

type EnvDTO = Pick<Cloudflare.Env, 'OPENAI_API_KEY'> &
  Partial<Pick<Cloudflare.Env, 'OPENAI_API_MODEL'>>

export function createOpenAIClient(
  env: EnvDTO,
): Result.Result<OpenAIClient, Error> {
  try {
    const apiKey = env.OPENAI_API_KEY
    if (!apiKey) {
      return Result.fail(
        new Error('OPENAI_API_KEY is not set in environment variables'),
      )
    }

    const openAI = new OpenAI({
      apiKey,
    })
    const model = env.OPENAI_API_MODEL ?? 'gpt-5-nano'

    return Result.succeed(new OpenAIClient(openAI, model))
  } catch (error) {
    return Result.fail(
      new Error(`Failed to create OpenAI client: ${(error as Error).message}`),
    )
  }
}

export class OpenAIClient implements AIClient {
  constructor(
    private readonly client: OpenAI,
    private readonly model: string,
  ) {}

  async call(
    systemPrompt: string,
    userQuery: string,
  ): Promise<Result.Result<AIResponse, AIClientError>> {
    try {
      logger.debug('Calling OpenAI API', { model: this.model })

      const aiResponse = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery },
        ],
      })

      if (aiResponse.choices.length === 0) {
        return Result.fail(
          new AIClientError(
            'No choices returned from OpenAI',
            'invalid_format',
          ),
        )
      }

      const response = aiResponse.choices.reduce(
        (acc, choice) => acc + (choice.message.content ?? ''),
        '',
      )

      if (response.trim() === '') {
        return Result.fail(
          new AIClientError('Empty response from OpenAI', 'invalid_format'),
        )
      }

      return Result.succeed({ response })
    } catch (error) {
      return Result.fail(
        new AIClientError('Failed to call OpenAI', 'api_failed', error),
      )
    }
  }
}
