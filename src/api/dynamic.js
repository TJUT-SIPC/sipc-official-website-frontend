import request from '@/utils/request'

export function getDynamics(page, pageSize) {
  return request({
    url: '/dynamicCenter/getDynamics',
    type: 'get',
    params: {
      page,
      pageSize
    }
  })
}

export function modifyDynamic(data) {
  return request({
    url: '/dynamicCenter/modifyDynamic',
    method: 'post',
    params: data
  })
}

export function delDynamic(id) {
  return request({
    url: '/dynamicCenter/delDynamic',
    method: 'post',
    params: {
      id
    }
  })
}

export function addDynamic(data) {
  return request({
    url: '/dynamicCenter/addDynamic',
    method: 'post',
    params: data
  })
}

export function uploadDynamicImage(file) {
  return request({
    url: '/uploadDynamicImage',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
