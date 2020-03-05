import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    params: data
  })
}

export function getInfo(id) {
  return request({
    url: '/userCenter/getUserById',
    method: 'post',
    params: {
      id
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserList(page, pageSize, status) {
  return request({
    url: '/userCenter/getUsers',
    method: 'get',
    params: {
      page,
      pageSize,
      status
    }
  })
}

export function editSubmit(data) {
  return request({
    url: '/userCenter/modifyUser',
    method: 'post',
    params: data
  })
}

export function deleteUser(id) {
  return request({
    url: '/userCenter/delUser',
    method: 'post',
    params: {
      id
    }
  })
}

export function addUser(data) {
  return request({
    url: '/userCenter/addUser',
    method: 'post',
    params: data
  })
}

export function uploadHeadImage(file) {
  return request({
    url: '/uploadHeadImage',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
