import request from '@/utils/request'

export function getMessage(page, pageSize) {
  return request({
    url: '/messageCenter/getMessage',
    method: 'post',
    data: {
      page,
      pageSize
    }
  })
}

export function delMessage(id) {
  return request({
    url: '/messageCenter/delMessage',
    method: 'post',
    data: {
      id
    }
  })
}
