import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IaChatSession, IaData } from './dto/iaData.dto';
import * as uuid from 'uuid';

@Injectable()
export class IaService {
  private chatSessions: Map<string, any> = new Map();

  async iniciarChat(iaData: IaData) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });

      const generationConfig = {
        temperature: 0.4,
        topP: 0.8,
        topK: 30,
        maxOutputTokens: 1500,
        responseMimeType: 'text/plain',
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: 'user',
            parts: [
              {
                text: `Hola, este es el proyecto: ${iaData.name}. Descripción: ${iaData.description}`,
              },
            ],
          },
          {
            role: 'model',
            parts: [
              { text: '¡Hola! ¿Cómo estás? ¿En qué puedo ayudarte hoy?\n' },
            ],
          },
        ],
      });

      const sessionId = uuid.v4();
      this.chatSessions.set(sessionId, chatSession);

      return { message: 'Chat iniciado', sessionId };
    } catch (error) {
      this.handleError(error);
    }
  }

  async enviarMensaje(iaChatSession: IaChatSession) {
    try {
      const chatSession = this.chatSessions.get(iaChatSession.sessionId);

      if (!chatSession) {
        throw new BadRequestException('Chat no encontrado');
      }

      const result = await chatSession.sendMessage(iaChatSession.message);

      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  private convertToHtml(text: string): string {
    // Simple conversion to HTML (you can customize this as needed)
    return text.replace(/\n/g, '<br>');
  }

  private handleError(error: any) {
    if (error.code === '23505') {
      const matches = error.detail.match(/\(([^)]+)\)/g);
      const [key, value] = matches;
      throw new ConflictException(`El rol ${value} ya existe!`);
    } else {
      throw new BadRequestException(error.message);
    }
  }
}
