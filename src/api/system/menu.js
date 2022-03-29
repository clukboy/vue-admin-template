import request from '@/utils/request'

export function listMenu(data) {
  return request({
    url: 'user/api/menus/v1/list',
    method: 'post',
    data
  })
}

export function createMenu(data) {
  return request({
    url: 'user/api/menus/v1/add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: 'user/api/menus/v1/update',
    method: 'post',
    data
  })
}

export function removeMenu(id) {
  return request({
    url: `user/api/menus/v1/remove/${id}`,
    method: 'post'
  })
}

