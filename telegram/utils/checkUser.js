import { sendTelegramMessage } from '../index.js'
import {allowedUsersId} from '../../globals/index.js'

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
