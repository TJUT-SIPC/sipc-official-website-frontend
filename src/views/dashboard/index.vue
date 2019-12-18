<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ username }}</div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      username: ''
    }
  },
  created() {
    this.username = this.$store.getters.username
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
