import request from '@/utils/request'

export function getMessage(page, pageSize) {
  return request({
    url: '/messageCenter/getMessage',
    method: 'post',
    params: {
      page,
      pageSize
    }
  })
}

export function delMessage(id) {
  return request({
    url: '/messageCenter/delMessage',
    method: 'post',
    params: {
      id
    }
  })
}
