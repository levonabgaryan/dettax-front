export abstract class WeatherForecastError extends Error {
  public readonly timestamp: Date;

  protected constructor(message: string, cause?: unknown) {
    super(message, { cause: cause });
    this.name = new.target.name;
    this.timestamp = new Date();
  }

  public getTimestampIso(): string {
    return this.timestamp.toISOString();
    // "2026-09-17T12:00:00.000Z"
  }
}
