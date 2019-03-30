<template>
  <div class="area" :style="{'height': height + 'px', 'width': width + 'px'}">
    <barrage
    :fontSize="fontSize"
    :text="text"
    :duration="3000"
    :width="680"
    :top="0"></barrage>
  </div>
</template>
<script>
import barrage from './barrage.vue'
export default {
  components: {
    barrage
  },
  props: {
    width: Number,
    height: Number,
    fontSize: Number
  },
  data: function() {
    return {
      text: '你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好你好'
    }
  }
}
</script>
<style lang="scss" scoped>
.area {
  border: 1px solid #ff0000;
  position: relative;
}
</style>
