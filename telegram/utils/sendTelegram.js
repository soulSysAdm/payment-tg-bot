import axios from 'axios'
import {TELEGRAM_TOKEN } from '../../globals/index.js'


export async function sendTelegramMessage(
  chatId,
  text,
  replyMarkup,
  replyToMessageId,
) {
  try {
    const res = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
        ...(replyMarkup && { reply_markup: replyMarkup }),
        ...(replyToMessageId && { reply_to_message_id: replyToMessageId }),
        allow_sending_without_reply: true, // 👈 чтобы не падало
      },
    )
    return res.data.result?.message_id
  } catch (error) {
    console.error('❌ Ошибка отправки сообщения:', error.message)
  }
}
