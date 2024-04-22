import axios from 'axios'
import Cookies from 'js-cookie'
const request = axios.create({
  baseURL: 'https://www.ddei.top/api',
  // baseURL: 'https://www.hoslay.store:28000/api',
  // baseURL: 'http://localhost:8100',

  timeout: 3000
})
request.interceptors.request.use(
  (config) => {
    if (
      config.url.includes(
        '/refresh/token'
        // config.url.includes('/user/login') ||
        // config.url.includes('/user/register')
      )
    ) {
      return config
    }
    // 验证失效时间
    let tokenExp = Cookies.get('tokenExp')
    let staytimeGap =
      parseInt(tokenExp + '000') - parseInt(new Date().getTime())
    let leave = staytimeGap % (3600 * 1000 * 24)
    let leave1 = leave % (3600 * 1000)
    let stayMin = Math.floor(leave1 / (60 * 1000))
    if (stayMin < 30 && stayMin > 0) {
      // 小于30分钟刷新token
      request
        .post(
          config.baseURL +
          '/v1/refresh/token?refreshToken=' +
          Cookies.get('refreshToken')
        )
        .then((res) => {
          Cookies.set('token', res.data.data.token)
          Cookies.set('tokenExp', res.data.data.tokenExp)
        })
    }
    config.headers['token'] = Cookies.get('token')

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
