import request from '../request'


//  创建短链接
export function createshortlink(json = {}) {
  return request.post('/v1/sslink/create', json)
}


// 载入短链接
export function shortlinklogin(url, pwd) {
  return request.post('/v1/ss/load', { url: url, pwd_code: pwd })
}


