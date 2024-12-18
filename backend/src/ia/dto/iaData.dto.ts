import { IsString } from 'class-validator';

export class IaData {
  @IsString()
  name: string;

  @IsString()
  description: string;
}

export class IaChatSessionDto {
  @IsString()
  message: string;
}

export interface IaChatSession {
  sessionId: string;
  message: string;
}
