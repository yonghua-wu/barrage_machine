<template>
  <div class="area" :style="{'height': height + 'px', 'width': width + 'px'}">
    <input type="button" value="shoot" @click="shoot('你好你好你好你好你好你好你好你好')">
    <div v-for="item in list" :key="item.index">
      <barrage
      :fontSize="fontSize"
      :text="item.text"
      :duration="item.duration"
      :width="item.width"
      :top="item.top"></barrage>
    </div>
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
      list: [],
      index: 0
    }
  },
  methods: {
    shoot: function(msg) {
      let id = this.index++
      let msgLength = this.stringLength(msg)
      let duration = this.duration(msgLength)
      console.log((duration/1000)/this.width)
      let s = {
        index: id,
        text: msg,
        width: parseInt(msgLength * this.fontSize / 2),
        top: 20,
        show: true,
        duration: duration
      }
      this.list.push(s)
      setTimeout(() => {
        for (let i=0; i<this.list.length; i++) {
          if (this.list[i].index === id) {
            this.list.splice(i, 1)
          }
        }
      }, duration)
    },
    stringLength: function(str) {
      str = str.replace(/[^\x00-\xff]/g, '**')
      return str.length
    },
    duration: function(len) {
      return (this.width / (len * 2 + 100)) * 1000
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
