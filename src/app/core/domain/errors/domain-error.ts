import { WeatherForecastError } from '../../../weather-forecast-error';

export abstract class DomainError extends WeatherForecastError {
  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
