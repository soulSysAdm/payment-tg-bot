import { sendTelegramMessage } from '../index.js'
import { allowedUsersId } from '../../globals/index.js'

export async function isAuthorizedUser(userId, chatId, userName) {
  const authorized = userId && allowedUsersId.includes(userId)
  if (!authorized && chatId) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return authorized
}

export async function isPrivateUser(body) {
  const type =
    body?.message?.chat?.type || body?.callback_query?.message?.chat?.type
  const isPrivate = type === 'private'
  if (isPrivate) {
    await sendTelegramMessage(
      chatId,
      `🚫 ${userName || 'Пользователь'} не имеет доступа к этому боту.`,
    )
    console.log('🚫 Неавторизованный пользователь:', userId, userName)
  }
  return isPrivate
}
