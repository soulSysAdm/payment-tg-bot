import { google } from 'googleapis'
import { range, GOOGLE_CREDENTIALS, GOOGLE_SHEET_ID } from '../../globals/index.js'

const auth = new google.auth.GoogleAuth({
  credentials: GOOGLE_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export async function updateSingleCell() {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })

  const rangeSingle = range + '!L5' // 👈 тут указываем нужную ячейку

  const newValue = '✅ Оплачено'

  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: rangeSingle,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[newValue]],
    },
  })

  console.log('✅ Ячейка обновлена:', res.data.updatedRange)
}

// export async function updateMultipleSpecificCells(requests) {
//   const client = await auth.getClient()
//   const sheets = google.sheets({ version: 'v4', auth: client })
//
//   for (const req of requests) {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: req.range,
//       valueInputOption: 'USER_ENTERED',
//       requestBody: {
//         values: req.values,
//       },
//     })
//
//     console.log(`✅ Обновлено: ${req.range}`)
//   }
// }

export async function updateMultipleSpecificCells(requests) {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })

  const res = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: GOOGLE_SHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: requests,
    },
  })

  console.log('✅ Обновлены диапазоны:', res?.data?.totalUpdatedRanges)
}

// updateSingleCell().catch(console.error)
