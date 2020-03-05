import Cookies from 'js-cookie'

const TokenKey = 'sipc-token'
const IdKey = 'id';
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get(IdKey)
}

export function setId(token) {
  return Cookies.set(IdKey, token)
}

export function removeId() {
  return Cookies.remove(IdKey)
}
