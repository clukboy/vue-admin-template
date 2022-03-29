import request from '@/utils/request'

export function listRole(data) {
  return request({
    url: 'user/api/roles/v1/list',
    method: 'post',
    data
  })
}

export function createRole(data) {
  return request({
    url: 'user/api/roles/v1/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: 'user/api/roles/v1/update',
    method: 'post',
    data
  })
}

export function removeRole(id) {
  return request({
    url: `user/api/roles/v1/remove/${id}`,
    method: 'post'
  })
}

