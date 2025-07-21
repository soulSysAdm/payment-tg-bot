let ALLOWED_USERS = []
let GOOGLE_CREDENTIALS = {}
let GOOGLE_SHEET_ID = ''
let UPSTASH_REDIS_REST_URL = ''
let UPSTASH_REDIS_REST_TOKEN = ''
let TELEGRAM_TOKEN = ''
let GROUP_CHAT_ID = ''

if (process.env.VERCEL) {
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || {})
  GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || ''
  UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || ''
  UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
  GROUP_CHAT_ID = process.env.GROUP_CHAT_ID || ''
} else {
  const dotenv = await import('dotenv')
  dotenv.config()
  ALLOWED_USERS = JSON.parse(process.env.ALLOWED_USERS || '[]')
  GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS || {})
  GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || ''
  UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || ''
  UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || ''
  TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
  GROUP_CHAT_ID = process.env.GROUP_CHAT_ID || ''
}

const allowedUsersId = Array.isArray(ALLOWED_USERS)
  ? ALLOWED_USERS.map((user) => user?.id).filter((id) => typeof id === 'number')
  : []

// const allowedUsers = [6602497931, 5937309404, 5622459508]
// const allowedUsers = [6602497931, 5622459508]
// const spreadsheetId = '1OgVcSxlN-wf6QOT3brEPvM9VkGZhnaPV4HaRAeQrB-U'
const range = 'Аркуш1'
const daysPayment = [1, 2, 3, 4]
const alertDay = 2

export {
  TELEGRAM_TOKEN,
  GOOGLE_CREDENTIALS,
  GOOGLE_SHEET_ID,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  GROUP_CHAT_ID,
  allowedUsersId,
  range,
  daysPayment,
  alertDay,
}
