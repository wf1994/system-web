<template>
  <div>
    <a-button type="primary" @click="addItem">新增</a-button>
  </div>
</template>
<script>
export default {
  name: 'AddComponentButton',
  props: {
    addItem: Function
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style scoped>
</style>