export function statusFilter(data) {
  if (data === 0) {
    return '审核不通过'
  } else if (data === 1) {
    return '待审核'
  } else if (data === 2) {
    return '审核通过待发布'
  } else if (data === 3) {
    return '已发布'
  }
}
