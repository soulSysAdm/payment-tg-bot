import moment from 'moment-timezone'
import {getDaysFromToday, getDaysRequestFromToday, getDateByUnknownFormat} from './assets/dateFormat.js'
// import {daysPayment} from './globals/index.js'

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
const dayTest = '19-04-2025'
const daysRequest = getDateByUnknownFormat(dayTest)
const daysPayment = getDateByUnknownFormat(dayTest)
console.log('daysPayment', getDaysFromToday(daysRequest))
console.log('daysRequest ', getDaysRequestFromToday(daysPayment))
console.log('moment ', moment('').tz('Europe/Kyiv'), typeof moment('').tz('Europe/Kyiv'))