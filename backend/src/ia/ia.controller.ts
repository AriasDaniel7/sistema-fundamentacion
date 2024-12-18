import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaChatSession, IaChatSessionDto, IaData } from './dto/iaData.dto';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('iniciar')
  iniciarChat(@Body() iaData: IaData) {
    return this.iaService.iniciarChat(iaData);
  }

  @Post('enviar/:sessionId')
  enviarMensaje(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() iaChatSessionDto: IaChatSessionDto,
  ) {
    const chat: IaChatSession = {
      sessionId,
      message: iaChatSessionDto.message,
    };

    return this.iaService.enviarMensaje(chat);
  }
}
