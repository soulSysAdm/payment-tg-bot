import {
  getValidateArray,
  getValidateNumber,
  getValidateString,
} from '../../assets/validateData.js'
import {
  CANCEL_PAID_TYPE_KEY,
  CANCEL_PAY_TYPE_KEY,
  COMMENTS_KEY,
  DAYS_UNTIL_PAYMENT_KEY,
  DAYS_UNTIL_REQUEST_KEY,
  ID_KEY, IS_CHANGE_ID,
  IS_PENDING_KEY,
  LAST_DATE_PAYMENT_KEY,
  NEXT_DATE_PAYMENT_KEY,
  NEXT_DATE_REQUEST_KEY,
  NICKNAME_ANSWERABLE_KEY,
  PAY_KEY,
  RANGE_KEY,
  TRUE_TYPE_KEY,
  VALUES_KEY,
} from '../../constants/index.js'
import {
  getDisplayDate,
  getDisplayDateWithDay,
  getNextDateFormatToLastDate,
  getNextPayment,
} from '../../assets/dateFormat.js'
import { getRangeCell } from './rangeCell.js'
import { updateMultipleSpecificCells } from '../sheets/updateSheet.js'
import { alertDay } from '../../globals/index.js'

const getCorrectNickname = (nickname) => {
  const stringNickname = getValidateString(nickname).trim()
  if (stringNickname.length <= 1) return 'Неизвестно'
  return stringNickname.startsWith('@') ? stringNickname : '@' + stringNickname
}

const getFilteredDataByPay = (data) => {
  const dataArray = getValidateArray(data)

  return dataArray

    .filter(
      (item) =>
        getValidateString(item?.[PAY_KEY]).trim().toLowerCase() ===
        TRUE_TYPE_KEY &&
        getValidateString(item?.[LAST_DATE_PAYMENT_KEY]).trim(),
    )
    .map((item) => ({
      ...item,
      [NICKNAME_ANSWERABLE_KEY]: getCorrectNickname(
        item?.[NICKNAME_ANSWERABLE_KEY],
      ),
    }))
}

export const getInitialDataByAllDate = (data) => {
  const filteredDataByPay = getFilteredDataByPay(data)
  return filteredDataByPay.map((item) => {
    const {
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    } = getNextPayment(item)

    return {
      ...item,
      [IS_PENDING_KEY]: '',
      [NEXT_DATE_PAYMENT_KEY]: nextDatePayment,
      [NEXT_DATE_REQUEST_KEY]: nextDateRequest,
      [DAYS_UNTIL_PAYMENT_KEY]: daysUntilPayment,
      [DAYS_UNTIL_REQUEST_KEY]: daysUntilRequest,
      [LAST_DATE_PAYMENT_KEY]: lastDatePayment,
    }
  })
}

export const getDataByAllDate = (data) => {
  const filteredDataByPay = getFilteredDataByPay(data)
  return filteredDataByPay.map((item) => {
    const {
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    } = getNextPayment(item)

    return {
      ...item,
      [NEXT_DATE_PAYMENT_KEY]: nextDatePayment || '',
      [NEXT_DATE_REQUEST_KEY]: nextDateRequest || '',
      [DAYS_UNTIL_PAYMENT_KEY]: daysUntilPayment ?? -1,
      [DAYS_UNTIL_REQUEST_KEY]: daysUntilRequest ?? -1,
      [LAST_DATE_PAYMENT_KEY]: lastDatePayment || '',
    }
  })
}

const getDataById = (data) => {
  const allIds = data.map((item) => item[ID_KEY]).filter(id => typeof id === 'number')
  let lastId = 1
  if(allIds.length){
    lastId = Math.max(...allIds)
  }
  return data.map((item, index) => {
    const id = getValidateNumber(item?.[ID_KEY])
    const isChangeId = id === 0
    const formattedId = isChangeId ? id + index + 1 + lastId : id
    return {
      ...item,
      [IS_CHANGE_ID]: isChangeId,
      [ID_KEY]: formattedId,
    }
  })
}

const getLowerCase = (value) => {
  return getValidateString(value).trim().toLowerCase()
}

const getIsPendingOrCancel = (pendingStr) => {
  const pendingLower = getLowerCase(pendingStr)
  if (pendingLower === getLowerCase(TRUE_TYPE_KEY)) return true
  if (pendingLower === getLowerCase(CANCEL_PAY_TYPE_KEY)) return true
  if (pendingLower === getLowerCase(CANCEL_PAID_TYPE_KEY)) return true
  return false
}

const getIsCancel = (pendingStr) => {
  const pendingLower = getLowerCase(pendingStr)
  if (pendingLower === getLowerCase(CANCEL_PAY_TYPE_KEY)) return true
  if (pendingLower === getLowerCase(CANCEL_PAID_TYPE_KEY)) return true
  return false
}

export const getDataByAlertRequest = (data) => {
  return data.filter(
    (item) =>
      item?.[DAYS_UNTIL_REQUEST_KEY] <= alertDay &&
      !getIsPendingOrCancel(item?.[IS_PENDING_KEY]),
  )
}

export const getDataByPayRequest = (data) => {
  const dataByAllDate = getDataByAllDate(data)
  const dataByAllDateAndId = getDataById(dataByAllDate)
  return dataByAllDateAndId.filter((item) => !getIsCancel(item?.[IS_PENDING_KEY]))
}

export const getDataByPendingRequest = (data) => {
  return data.filter(
    (item) =>
      getLowerCase(item?.[IS_PENDING_KEY]) === getLowerCase(TRUE_TYPE_KEY),
  )
}

const getFindIndexClick = (data, id) => {
  return getValidateArray(data).findIndex(
    (item) => getValidateNumber(item?.[ID_KEY]) === getValidateNumber(id),
  )
}

export const getSheetDataByPayClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[TRUE_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByCancelPayClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[CANCEL_PAY_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByPaidClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    currentData[LAST_DATE_PAYMENT_KEY] = getNextDateFormatToLastDate(
      currentData[NEXT_DATE_PAYMENT_KEY],
    )
    const {
      nextDatePayment,
      daysUntilPayment,
      daysUntilRequest,
      nextDateRequest,
      lastDatePayment,
    } = getNextPayment(currentData)

    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [['']],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, LAST_DATE_PAYMENT_KEY),
        [VALUES_KEY]: [[getDisplayDate(lastDatePayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, NEXT_DATE_PAYMENT_KEY),
        [VALUES_KEY]: [[getDisplayDateWithDay(nextDatePayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, NEXT_DATE_REQUEST_KEY),
        [VALUES_KEY]: [[getDisplayDateWithDay(nextDateRequest)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, DAYS_UNTIL_PAYMENT_KEY),
        [VALUES_KEY]: [[getValidateNumber(daysUntilPayment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, DAYS_UNTIL_REQUEST_KEY),
        [VALUES_KEY]: [[getValidateNumber(daysUntilRequest)]],
      },
    ]
  } else {
    return null
  }
}

export const getSheetDataByCancelPaidClick = (sheetData, id, comment) => {
  const findIndex = getFindIndexClick(sheetData, id)
  if (findIndex !== -1) {
    const currentData = sheetData[findIndex]
    return [
      {
        [RANGE_KEY]: getRangeCell(currentData, COMMENTS_KEY),
        [VALUES_KEY]: [[getValidateString(comment)]],
      },
      {
        [RANGE_KEY]: getRangeCell(currentData, IS_PENDING_KEY),
        [VALUES_KEY]: [[CANCEL_PAID_TYPE_KEY.toUpperCase()]],
      },
    ]
  } else {
    return null
  }
}
