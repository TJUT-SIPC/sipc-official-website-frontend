import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
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
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/userCenter/delUser',
    method: 'post',
    data: {
      id
    }
  })
}

export function uploadHeadImage(file) {
  return request({
    url: '/uploadHeadImage',
    method: 'post',
    data: {
      file
    }
  })
}
