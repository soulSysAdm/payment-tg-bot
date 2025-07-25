import moment from 'moment-timezone'
import {
  getDaysFromToday,
  getDaysRequestFromToday,
  getDateByUnknownFormat,
} from './assets/dateFormat.js'
import {
  getDataByPayRequest,
  getDataSheetPay,
  readSheet,
} from './google/index.js'
import {
  TELEGRAM_TOKEN,
  GOOGLE_CREDENTIALS,
  GOOGLE_SHEET_ID,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  allowedUsersId,
  range,
  daysPayment,
  alertDay,
  GROUP_CHAT_ID,
} from './globals/index.js'

// export const daysPayment = [1, 2, 3, 4]
//
// const getDaysRequestFromToday = (dateStr) => {
//   const target = moment(dateStr).startOf('day')
//   const today = moment().startOf('day')
//   const diffDays = target.diff(today, 'days')
//   let count = 0
//
//   const step = diffDays >= 0 ? 1 : -1
//
//   for (let i = 1; i <= Math.abs(diffDays); i++) {
//     const current = moment(today).add(i * step, 'days')
//     const weekday = current.isoWeekday() // Пн=1, Вс=7
//     if (daysPayment.includes(weekday)) {
//       count += step
//     }
//   }
//   return count
// }

const yesterday = moment().subtract(5, 'day').format()
const tomorrow = moment().add(2, 'day').format()

// console.log('tomorrow ', moment(tomorrow).format('DD-MM-YYYY dddd')) //08-04-2025 Tuesday
// console.log('yesterday ', moment(yesterday).format('DD-MM-YYYY dddd')) //02-04-2025 Wednesday
// console.log('diff ', getDaysRequestFromToday(tomorrow))

const test = moment('15-04-2025', 'DD-MM-YYYY').format()

// console.log('test ', test)
// console.log('getDaysFromToday ', getDaysFromToday(test))
const dayTest = '05-05-2025'
const daysRequest = getDateByUnknownFormat(dayTest)
const daysPayment1 = getDateByUnknownFormat(dayTest)
// console.log('daysPayment', getDaysFromToday(daysRequest))
// console.log('daysRequest ', getDaysRequestFromToday(daysPayment))
// console.log('moment ', moment('').tz('Europe/Kyiv'), typeof moment('').tz('Europe/Kyiv'))

const initial = async () => {
  const sheetData = await readSheet()
  // console.log("sheetData ", sheetData)
  // console.log("sheetData[0] ", sheetData[0])
  const dataByPay = getDataByPayRequest(sheetData)
  console.log('dataByPay ', dataByPay)
  console.log('dataByPay[0] ', dataByPay[0])
  const dataByPaySheet = getDataSheetPay(dataByPay)
  console.log('dataByPaySheet ', dataByPaySheet)
  console.log('dataByPaySheet[0] ', dataByPaySheet[0])
}

// initial()
console.log('allowedUsersId ', allowedUsersId)
console.log('TELEGRAM_TOKEN ', TELEGRAM_TOKEN)
console.log('GOOGLE_CREDENTIALS ', GOOGLE_CREDENTIALS)
console.log('GOOGLE_SHEET_ID ', GOOGLE_SHEET_ID)
console.log('UPSTASH_REDIS_REST_URL ', UPSTASH_REDIS_REST_URL)
console.log('UPSTASH_REDIS_REST_TOKEN ', UPSTASH_REDIS_REST_TOKEN)
console.log('range ', range)
console.log('daysPayment ', daysPayment)
console.log('alertDay ', alertDay)
console.log('GROUP_CHAT_ID ', GROUP_CHAT_ID)
