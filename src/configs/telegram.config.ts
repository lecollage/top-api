import { ConfigService } from '@nestjs/config';

import { ITelegramOptions } from '../telegram/telegram.interface';

export const getTelegramConfig = async (
  configService: ConfigService,
): Promise<ITelegramOptions> => {
  const token = configService.get('TELEGRAM_TOKEN');

  if (!token) {
    throw new Error('TELEGRAM_TOKEN is not set');
  }

  return {
    token,
    chatId: configService.get('TELEGRAM_CHAT_ID') ?? '',
  };
};
