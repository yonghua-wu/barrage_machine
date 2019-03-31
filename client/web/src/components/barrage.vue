<template>
    <div class="text"
    :style="{ 'font-size': fontSize + 'px', 'animation-duration': duration + 'ms',  'top': top + 'px', 'width': width + 'px' }">
      <span>{{text}}</span>
    </div>
</template>
<script>
export default {
  props: {
    fontSize: Number,
    text: String,
    duration: Number,
    top: Number,
    width: Number
  }
}
</script>
<style lang="scss" scoped>
.text {
  position: absolute;
  animation-name: shoot;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  right: 0px;
  transform: translateX(100%);
}
@keyframes shoot {
  0% {
    
  }
  100% {
    right: 100%;
    transform: translateX(-100%);
  }
}
</style>
