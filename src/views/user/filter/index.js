export function statusFilter(data) {
  if (data === 0) {
    return '普通用户'
  } else if (data === 1) {
    return '管理员'
  } else if (data === 2) {
    return '超级管理员'
  }
}
