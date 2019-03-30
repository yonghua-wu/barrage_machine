<template>
    <div class="text" :style="{ 'font-size': fontSize + 'px', 'animation-duration': duration + 'ms', 'width': width + 'px', 'top': top + 'px' }">
      {{text}}
    </div>
</template>
<script>
export default {
  props: {
    fontSize: Number,
    text: Number,
    duration: Number,
    width: Number,
    top: Number
  }
}
</script>
<style lang="scss" scoped>
.text {
  position: absolute;
  animation-name: shoot;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}
@keyframes shoot {
  0% {
    right: 0px;
  }
  100% {
    right: 100%;
  }
}
</style>
