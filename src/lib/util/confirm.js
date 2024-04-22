// ========================================================
// 提供通用的弹出确认逻辑
// @author wangyb
// @createTime 2023-05-26 15:21:12
// ========================================================

import { isString } from 'lodash'

const DEFULT_BUTTONS = [
  {
    title: '取消',
    key: 'cancel'
  },
  {
    title: '确定',
    key: 'confirm',
    type: 'primary'
  }
]

/**
 * 弹出提示框，支持自定义按钮组，并
 * @param {*} ins vue组件
 */
export const confirm = function (ins, { content, buttonAlign = 'right', buttons = DEFULT_BUTTONS, ...options }) {
  // 覆盖默认样式，隐藏默认按钮
  Object.assign(options, {
    okButtonProps: { style: 'display:none' },
    cancelButtonProps: { style: 'display:none' }
  })
  return new Promise((resolve, reject) => {
    let h = ins.$createElement
    if (!h) {
      reject(new Error('$createElement 方法不存在'))
      return
    }
    let _confirm = ins.confirm || ins.$confirm
    if (!_confirm) {
      reject(new Error('confirm 方法不存在'))
      return
    }
    let confirmModel
    let close = function () {
      confirmModel.destroy()
    }
    let buttonClick = function (btn, e) {
      close()
      resolve(btn, e)
    }
    // 处理内容
    if (isString(content)) {
      content = h('p', {}, content)
    }
    // 处理按钮
    buttons = buttons.filter(item => !!item).map((item, index) => {
      return h('a-button',
        {
          props: {
            type: item.type,
            icon: item.icon
          },
          style: {
            'margin-left': index > 0 ? '10px' : ''
          },
          on: { click: (e) => buttonClick(item, e) }
        },
        item.title
      )
    })
    confirmModel = _confirm({
      ...options,
      content: h('div', { class: 'confirm-content--without-btns' }, [
        content,
        h('div', { class: 'confirm-button-group', style: `text-align: ${buttonAlign};` }, buttons)
      ]),
      cancel () {
        resolve({ key: 'cancel' })
      }
    })
  })
}