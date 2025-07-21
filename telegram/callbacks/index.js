import axios from 'axios'
import {
  getDataMessageEmptyButtons,
  getDataMessagePay,
  sendTelegramMessage,
} from '../index.js'
import { getTimeInUkraine } from '../../assets/dateFormat.js'
import {
  CANCEL_PAID_PART_KEY,
  CANCEL_PAY_PART_KEY,
  CHAT_ID_KEY,
  MESSAGE_ID_KEY,
  PAID_PART_KEY,
  PAY_PART_KEY,
} from '../../constants/index.js'

import {
  googleSheetUpdateByCancelPaid,
  googleSheetUpdateByCancelPay,
  googleSheetUpdateByPaid,
  googleSheetUpdateByPay,
} from '../../google/sheets/telegramUpdateSheet.js'
// import { getRedisData, delRedisData } from '../../libs/redis.js'
import {
  allowedUsersId,
  GROUP_CHAT_ID,
  TELEGRAM_TOKEN,
} from '../../globals/index.js'

const sendErrorMassage = async (message) => {
  // for (const chatId of allowedUsersId) {
  //   const messageTelegram = `Ошибка ${message}"`
  //   await sendTelegramMessage(chatId, messageTelegram)
  // }
  const messageTelegram = `Ошибка ${message}"`
  await sendTelegramMessage(GROUP_CHAT_ID, messageTelegram)
}

const deleteMessage = async (item) => {
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`,
    {
      chat_id: item[CHAT_ID_KEY],
      message_id: item[MESSAGE_ID_KEY],
    },
  )
}

const editMessageReplyMarkup = async (item, id) => {
  const data = id
    ? { ...getDataMessagePay(item, id) }
    : { ...getDataMessageEmptyButtons(item) }

  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageReplyMarkup`,
    { ...data },
  )
}

const handlePayClick = async (callbackQuery, id, messageId, user) => {
  try {
    const messageTelegram = `➡️ Сделать запрос | нажал "${user}"`
    const messageSheet = `${messageTelegram} в ${getTimeInUkraine()}`
    // const redisData = await getRedisData(id)
    const item = {
      [CHAT_ID_KEY]: GROUP_CHAT_ID,
      [MESSAGE_ID_KEY]: messageId,
    }
    await editMessageReplyMarkup(item, id)
    // for (const item of redisData) {
    //   await editMessageReplyMarkup(item, id)
    //   // await sendTelegramMessage(
    //   //   item[CHAT_ID_KEY],
    //   //   messageTelegram,
    //   //   null,
    //   //   item[MESSAGE_ID_KEY],
    //   // )
    // }
    await googleSheetUpdateByPay(id, messageSheet)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPayClick = async (callbackQuery, id, messageId, user) => {
  const messageTelegram = `❌ Отменить | (Вместо Оплатить) нажал "${user}"`
  const messageSheet = `${messageTelegram} в ${getTimeInUkraine()}`
  // const redisData = await getRedisData(id)

  const item = {
    [CHAT_ID_KEY]: GROUP_CHAT_ID,
    [MESSAGE_ID_KEY]: messageId,
  }

  try {
    // for (const item of redisData) {
    //   await editMessageReplyMarkup(item, null)
    //   // await deleteMessage(item)
    //   // await sendTelegramMessage(
    //   //   item[CHAT_ID_KEY],
    //   //   messageTelegram,
    //   //   null,
    //   //   item[MESSAGE_ID_KEY],
    //   // )
    // }
    await editMessageReplyMarkup(item, null)
    // await delRedisData(id)
    await googleSheetUpdateByCancelPay(id, messageSheet)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handlePaidClick = async (callbackQuery, id, messageId, user) => {
  const messageTelegram = `✅ Оплачено | нажал "${user}"`
  const messageSheet = `${messageTelegram} в ${getTimeInUkraine()}`
  // const redisData = await getRedisData(id)
  const item = {
    [CHAT_ID_KEY]: GROUP_CHAT_ID,
    [MESSAGE_ID_KEY]: messageId,
  }
  try {
    // for (const item of redisData) {
    //   await editMessageReplyMarkup(item, null)
    //   // await deleteMessage(item)
    //   // await sendTelegramMessage(
    //   //   item[CHAT_ID_KEY],
    //   //   messageTelegram,
    //   //   null,
    //   //   item[MESSAGE_ID_KEY],
    //   // )
    // }
    await editMessageReplyMarkup(item, null)
    // await delRedisData(id)
    await googleSheetUpdateByPaid(id, messageSheet)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

const handleCancelPaidClick = async (callbackQuery, id, messageId, user) => {
  const messageTelegram = `❌ Отменить | (Вместо Оплачено) нажал "${user}"`
  const messageSheet = `${messageTelegram} в ${getTimeInUkraine()}`
  // const redisData = await getRedisData(id)
  const item = {
    [CHAT_ID_KEY]: GROUP_CHAT_ID,
    [MESSAGE_ID_KEY]: messageId,
  }
  try {
    // for (const item of redisData) {
    //   await editMessageReplyMarkup(item, null)
    //   // await deleteMessage(item)
    //   // await sendTelegramMessage(
    //   //   item[CHAT_ID_KEY],
    //   //   messageTelegram,
    //   //   null,
    //   //   item[MESSAGE_ID_KEY],
    //   // )
    // }
    await editMessageReplyMarkup(item, null)
    // await delRedisData(id)
    await googleSheetUpdateByCancelPaid(id, messageSheet)
  } catch (e) {
    await sendErrorMassage(e.message)
  }
}

export async function handleCallbackQuery(callbackQuery) {
  try {
    const data = callbackQuery.data
    // console.log('callbackQuery ', callbackQuery)
    const [action, id] = data.split('_')
    const user = callbackQuery.from.username || callbackQuery.from.first_name
    const messageId = callbackQuery.message.message_id
    // const chatId = callbackQuery.message.chat.id

    if (action === PAY_PART_KEY) {
      await handlePayClick(callbackQuery, id, messageId, user)
    } else if (action === CANCEL_PAY_PART_KEY) {
      await handleCancelPayClick(callbackQuery, id, messageId, user)
    } else if (action === PAID_PART_KEY) {
      await handlePaidClick(callbackQuery, id, messageId, user)
    } else if (action === CANCEL_PAID_PART_KEY) {
      await handleCancelPaidClick(callbackQuery, id, messageId, user)
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callbackQuery:', error.message)
  }
}
