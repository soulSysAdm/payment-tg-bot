import {
  getDataByPayRequest,
  getDataByPendingRequest,
  getDataSheetPay,
  readSheet,
} from '../index.js'
import { getDataByAlertRequest } from '../utils/payData.js'
import { getDataSheetPending } from '../utils/rangeCell.js'
import { updateMultipleSpecificCells } from './updateSheet.js'
import {
  getDataMessagesPending,
  sendTelegramMessage,
} from '../../telegram/index.js'
import { alertDay, allowedUsersId, GROUP_CHAT_ID } from '../../globals/index.js'
import { delaySeconds } from '../../assets/dateFormat.js'
import {
  CHAT_ID_KEY,
  ID_KEY,
  INLINE_KEYBOARD_KEY,
  MESSAGE_ID_KEY,
  PAY_PART_KEY,
  REDIS_PAYMENT_PART_KEY,
  TEXT_KEY,
  TYPE_BUTTONS_KEY,
} from '../../constants/index.js'
// import { setRedisData } from '../../libs/redis.js'

const sendTelegramMessageByPending = async (dataPending) => {
  let message = ''
  if (dataPending.length > 0) {
    message = `Ближайшие "${alertDay}" дня Есть **${dataPending.length}** запросов в ожидании. Дополнительных запросов Нет!`
  } else {
    message = `Ближайшие "${alertDay}" дня Нет запросов в ожидании. Дополнительных запросов на проплату Нет!`
  }
  // for (const chatId of allowedUsersId) {
  //   await sendTelegramMessage(chatId, message)
  // }
  await sendTelegramMessage(GROUP_CHAT_ID, message)
}

const sendTelegramMessageByRequest = async (dataByAlert) => {
  const telegramMessages = getDataMessagesPending(dataByAlert)
  // const redisData = {}
  for (const message of telegramMessages) {
    //Этот Вариант заменяю на Вариант ниже так как у меня будет не много личек , а теперь все сообщения в группе
    // for (const chatId of allowedUsersId) {
    //   const messageId = await sendTelegramMessage(chatId, message[TEXT_KEY], {
    //     [INLINE_KEYBOARD_KEY]: message[INLINE_KEYBOARD_KEY],
    //   })
    //   if (messageId) {
    //     const redisKey = `${REDIS_PAYMENT_PART_KEY}_${message[ID_KEY]}`
    //
    //     if (!redisData[redisKey]) {
    //       redisData[redisKey] = []
    //     }
    //
    //     redisData[redisKey].push(
    //       JSON.stringify({
    //         [CHAT_ID_KEY]: chatId,
    //         [MESSAGE_ID_KEY]: messageId,
    //       }),
    //     )
    //     await delaySeconds(0.1)
    //   }
    // }
    //Заменяю на этот вариант - но его нужно переделать
    const messageId = await sendTelegramMessage(
      GROUP_CHAT_ID,
      message[TEXT_KEY],
      {
        [INLINE_KEYBOARD_KEY]: message[INLINE_KEYBOARD_KEY],
      },
    )
    if (messageId) {
      // const redisKey = `${REDIS_PAYMENT_PART_KEY}_${message[ID_KEY]}`
      //
      // redisData[String(messageId)] = message[ID_KEY]

      // if (!redisData[redisKey]) {
      //   redisData[redisKey] = []
      // }

      // redisData[redisKey].push(
      //   JSON.stringify({
      //     [CHAT_ID_KEY]: GROUP_CHAT_ID,
      //     [MESSAGE_ID_KEY]: messageId,
      //   }),
      // )
      await delaySeconds(0.1)
    }
  }

  // await setRedisData(redisData)
}

export async function repeatSheet() {
  const sheetData = await readSheet()
  const dataByPay = getDataByPayRequest(sheetData)
  const dataByAlert = getDataByAlertRequest(dataByPay)
  const dataPending = getDataByPendingRequest(dataByPay)

  if (!dataByAlert.length) {
    await sendTelegramMessageByPending(dataPending)
  } else {
    await sendTelegramMessageByRequest(dataByAlert)
  }
  const dataByAlertSheet = getDataSheetPending(dataByAlert)
  const dataByPaySheet = getDataSheetPay(dataByPay)
  const dataRequestSheet = [...dataByAlertSheet, dataByPaySheet]

  await updateMultipleSpecificCells(dataRequestSheet)
}
