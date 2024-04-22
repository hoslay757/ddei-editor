
import moment from 'moment'

/**
 * 格式化时间
 * @param date 传入的时间
 * @param format 要转换的格式 例如：YYYY-MM-DD HH:mm:ss
 * */
export const formatDate = (date, format) => {
  return moment(date).format(format)
}