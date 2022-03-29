import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'user/api/users/v1/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: 'user/api/users/v1/userinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function listUser(data) {
  return request({
    url: 'user/api/users/v1/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: 'user/api/users/v1/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: 'user/api/users/v1/update',
    method: 'post',
    data
  })
}

export function removeUser(id) {
  return request({
    url: `user/api/users/v1/remove/${id}`,
    method: 'post'
  })
}

