<template>
  <div class="text move" v-bind:style="dynamic_style">
    <span>{{text}}</span>
  </div>
</template>
<script>
export default {
  props: {
    fontSize: Number,
    text: String,
    screen_width: Number,
    duration: Number,
    top: Number,
    text_width: Number
  },
  computed: {
    dynamic_style: function() {
      return {
        'font-size': this.fontSize + 'px',
        'animation-duration': this.duration + 'ms',
        'top': this.top + 'px',
        'width': this.text_width + 'px',
        'transform': 'translateX(' + this.screen_width + 'px)',
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  position: absolute;
  animation-name: shoot;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  will-change: transform;
  white-space: nowrap;
}
@keyframes shoot {
  100% {
    transform: translateX(-100%);
  }
}
</style>
