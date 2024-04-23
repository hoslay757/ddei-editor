export const checkArgment = function (s) {
  if (s == undefined || s == '') {
    return false
  }
  var pattern = new RegExp("[ \\[ \\] \\^ \\-*×――(^)$%~!＠@＃#$…&%￥—+=<>《》!！??？:：•`·、。，；,.;/\'\"{}（）‘’“”-]")
  // 验证变量是否符合标准
  var p = pattern.test(s)
  if (p || s.indexOf(' ') !== -1) {
    return false
  }
  return true
}

export const checkArgments = function (sl, cloumn) {
  var b = true
  sl.forEach(element => {
    if (!checkArgment(element[cloumn])) {
      b = false
    }
  })
  return b
}