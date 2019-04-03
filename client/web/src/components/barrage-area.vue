<template>
  <div class="area" :style="{'height': height + 'px', 'width': width + 'px'}">
    
    <div v-for="item in list" :key="item.index">
      <barrage
      :fontSize="fontSize"
      :text="item.text"
      :duration="item.duration"
      :text_width="item.width"
      :screen_width="width"
      :top="item.top"></barrage>
    </div>
  </div>
</template>
<script>
import barrage from './barrage.vue'
let line = []
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
  mounted: function() {
    let len = parseInt(this.height / this.fontSize) -1
    line = []
    while(len) {
      line.push(0)
      len--
    }
  },
  watch: {
    fontSize: function() {
      let len = parseInt(this.height / this.fontSize) -1
      line = []
      while(len) {
        line.push(0)
        len--
      }
    }
  },
  methods: {
    shoot: function(msg) {
      let id = this.index++
      let wordConut = this.stringLength(msg)
      let duration = this.duration(wordConut)
      let lineNum = line.indexOf(0)
      if (lineNum == -1) {
        lineNum = parseInt(Math.random() * line.length)
      }
      line[lineNum] = 1
      let s = {
        index: id,
        text: msg,
        width: parseInt(wordConut * this.fontSize / 2),
        top: lineNum * this.fontSize,
        show: true,
        duration: duration
      }
      this.list.push(s)
      setTimeout(() => { // 弹幕飘过后删除
        this.clearAList(id)
      }, duration)
      setTimeout(() => { // 经过一定时间后允许lineNum发送弹幕
        this.resetALine(lineNum)
      }, s.width / (wordConut * 1.8 + 140) * 2000)
    },
    stringLength: function(str) {
      str = str.replace(/[^\x00-\xff]/g, '**')
      return str.length
    },
    duration: function(len) { // 计算弹幕飘过屏幕的时间
      return (this.width / (len * 0.6 + 140)) * 1000
    },
    resetALine: function(n) {
      line[n] = 0
    },
    clearAList: function(id) {
      for (let i=0; i<this.list.length; i++) {
        if (this.list[i].index === id) {
          this.list.splice(i, 1)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.area {
  position: relative;
  overflow: hidden;
}
</style>
