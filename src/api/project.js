import request from '@/utils/request'
export function getProjects(page, pageSize) {
  return request({
    url: '/projectCenter/getProjects',
    method: 'post',
    params: {
      page,
      pageSize
    }
  })
}

export function modifyProject(data) {
  return request({
    url: '/projectCenter/modifyProject',
    method: 'post',
    data
  })
}

export function delProject(id) {
  return request({
    url: '/projectCenter/delProject',
    method: 'post',
    data: {
      id
    }
  })
}

export function addProject(data) {
  return request({
    url: '/projectCenter/addProject',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadProjectImage(file) {
  return request({
    url: '/uploadProjectImage',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
