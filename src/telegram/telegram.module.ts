// src/telegram/telegram.module.ts
import { Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Global()
@Module({
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
