import { sendTelegramMessage } from '../index.js'
import { TELEGRAM_TOKEN, GROUP_CHAT_ID } from '../../globals/index.js'

export function isAllowedGroup(chatId) {
  // const type =
  //   body?.message?.chat?.type || body?.callback_query?.message?.chat?.type
  // return type === 'private'
  return chatId && String(chatId) === GROUP_CHAT_ID
}

export async function isPrivateChat(type, chatId) {
  const isPrivate = type === 'private'
  console.log('isPrivate 2', isPrivate)
  if (isPrivate) {
    await sendTelegramMessage(chatId, `🙅 Бот работает только в группе`)
    console.log('❌ Бот вызван в личке — игнорируем')
  }
  return isPrivate
}

export async function leaveChat(body) {
  const chatId =
    body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
  const type =
    body?.message?.chat?.type || body?.callback_query?.message?.chat?.type

  if (chatId && type && type !== 'private') {
    console.log(`🚫 Бот добавлен в ${type}, выходим из ${chatId}`)
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/leaveChat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId }),
    })
  }
}
