import { getTimeInUkraine } from '../assets/dateFormat.js'
import {
  handleInitialCommand,
  handleCallbackQuery,
  handleStartCommand,
  isAuthorizedUser,
  sendTelegramMessage,
} from '../telegram/index.js'
import { handleCheckCommand } from '../telegram/index.js'
import {
  isAllowedGroup,
  isPrivateChat,
  leaveChat,
} from '../telegram/utils/checkGroup.js'
import { GROUP_CHAT_ID } from '../globals/index.js'

export default async function telegramHandler(req, res) {
  console.log('🔥 Webhook вызван в', getTimeInUkraine())
  try {
    const body = req.body
    console.log('🔥 body', body)
    console.log('🔥 body.message.chat.id', body.message?.chat.id)
    console.log(
      '🔥 body.callback_query.message.chat.id',
      body.callback_query?.message?.chat.id,
    )

    const userId = body?.message?.from?.id || body?.callback_query?.from?.id
    const chatId =
      body?.message?.chat?.id || body?.callback_query?.message?.chat?.id
    const type =
      body?.message?.chat?.type || body?.callback_query?.message?.chat?.type
    const userName =
      body?.message?.from?.username ||
      body?.message?.from?.first_name ||
      body?.callback_query?.from?.username ||
      body?.callback_query?.from?.first_name

    console.log('🔥 userId', userId)
    console.log('🔥 chatId', chatId)
    console.log('🔥 type', type)
    console.log('🔥 userName', userName)
    console.log('🔥 GROUP_CHAT_ID', GROUP_CHAT_ID)

    if (!isAllowedGroup(chatId)) {
      //Выход с группы
      console.log('isAllowedGroup')
      await leaveChat(body)
      res.status(200).send('⛔️ Добавлен бот в запрещенную группу')
      return
    }

    const isPrivate = type === 'private'
    console.log('isPrivate 1', isPrivate)

    if (await isPrivateChat(type, chatId)) {
      await sendTelegramMessage(
        GROUP_CHAT_ID,
        `❌ Бот вызван в личке. chatId - ${chatId}, userName - ${userName}`,
      )
      console.log(
        `❌ Бот вызван в личке. chatId - ${chatId}, userName - ${userName}`,
      )
      return res.status(200).send('🚫 Бот работает только в группе')
    }

    // if (!(await isAuthorizedUser(userId, chatId, userName))) {
    //   return res.status(200).send('🚫 Доступ запрещён')
    // }
    //asdasdasd

    if (body.message?.text === '/start') {
      await handleStartCommand(chatId, userName)
    }

    // if (body.message?.text === '/initial') {
    //   await handleInitialCommand(userName)
    // }

    if (body.message?.text === '/check') {
      await handleCheckCommand(userName)
    }

    if (body.callback_query) {
      await handleCallbackQuery(body.callback_query, chatId)
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error('❌ Ошибка основного webhook:', error.message)
    res.status(500).send('Ошибка сервера')
  }
}
