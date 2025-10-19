export class BaseCustomError<Args> extends Error {
  constructor(
    protected readonly customArgument: Args,
    ...params: ConstructorParameters<typeof Error>
  ) {
    super(...params)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = this.constructor.name
  }
}
