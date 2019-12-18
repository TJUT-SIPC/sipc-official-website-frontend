import request from '@/utils/request'

export function getAllAwards(page, pageSize) {
  return request({
    url: '/awardCenter/getAllAwards',
    method: 'post',
    data: {
      page,
      pageSize
    }
  })
}

export function addAward(data) {
  return request({
    url: '/awardCenter/addAward',
    method: 'post',
    data
  })
}

export function modifyAward(data) {
  return request({
    url: '/awardCenter/modifyAward',
    method: 'post',
    data
  })
}

export function delAward(id) {
  return request({
    url: '/awardCenter/delAward',
    method: 'post',
    data: {
      id
    }
  })
}
