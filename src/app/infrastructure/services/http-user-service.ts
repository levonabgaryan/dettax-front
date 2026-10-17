import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface RegisterUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterUserResponse {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export class HttpUserService {
  private readonly httpClient: HttpClient;
  private readonly baseUrl = 'http://localhost:5291';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  public async register(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    return firstValueFrom(
      this.httpClient.post<RegisterUserResponse>(`${this.baseUrl}/users`, request),
    );
  }
}
