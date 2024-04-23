import request from '../request'


// 加载文件
export function listfile(json = {}) {
  return request.get('/v1/file/list', {
    params: json
  })
}

// 创建文件
export function createfile(json = {}) {
  return request.post('/v1/file/create', json)
}

// 删除文件
export function removefile(json = {}) {
  return request.post('/v1/file/del', json)
}

// 修改文件基本信息
export function savefilebasic(json = {}) {
  return request.post('/v1/file/savebasic', json)
}

// 复制文件
export function copyfile(json = {}) {
  return request.post('/v1/file/copy', json)
}


// 加载文件内容，包括设计信息
export function loadfile(json = {}) {
  return request.post('/v1/file/load', json)
}



// 保存文件内容，包括设计信息
export function savefile(json = {}) {
  return request.post('/v1/file/save', json)
}

// 收藏文件到自己的私人文件夹
export function collfile(json = {}) {
  return request.post('/v1/file/coll', json)
}

// 保存文件内容，包括设计信息，然后发布文件
export function publishfile(json = {}) {
  return request.post('/v1/file/publish', json)
}

