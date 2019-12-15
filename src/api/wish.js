import request from '@/utils/request'

export function getAllWishes(page, pageSize, status) {
    return request({
        url: '/wishCenter/getAllWishes',
        method: 'get',
        params: {
            page,
            pageSize,
            status
        }
    })
}

export function modifyWish(id, status) {
    return request({
        url: '/wishCenter/modifyWish',
        method: 'post',
        data: {
            id,
            status
        }
    })
}

export function delWish(id) {
    return request({
        url: '/wishCenter/delWish',
        method: 'post',
        data: {
            id
        }
    })
}