import moment from 'moment-timezone'


const getDaysFromToday = (dateStr) => {
  const target = moment(dateStr).startOf('day')
  const today = moment().startOf('day')
  return target.diff(today, 'days')
}

const tomorrow = moment().subtract(1, 'day').format()

console.log('tomorrow ', tomorrow)
console.log('diff ', getDaysFromToday(tomorrow))