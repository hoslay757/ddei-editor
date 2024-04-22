import request from '../request'

// 注册
export function register(regInfo = {}) {
  return request.post('/v1/user/register', regInfo)
}

// 登录
export function login(loginInfo = {}) {
  return request.post('/v1/user/login', loginInfo)
}

// 获取用户信息
export function userinfo(url) {
  let u = "/v1/user/info"
  if (url) {
    u += "?url=" + url
  }
  return request.get(u)
}
