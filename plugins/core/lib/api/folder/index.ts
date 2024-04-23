import request from '../request'

// 加载目录
export function loadfolder(json = {}) {
  return request.post('/v1/folder/load', json)
}

// 创建目录
export function createfolder(json = {}) {
  return request.post('/v1/folder/create', json)
}

// 删除目录
export function removefolder(json = {}) {
  return request.post('/v1/folder/del', json)
}

// 重命名目录
export function renamefolder(json = {}) {
  return request.post('/v1/folder/rename', json)
}

