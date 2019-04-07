<template>
  <div class="modal">
    <div class="title">
      <div class="text">{{title}}</div>
      <img src="../images/close.png" alt="" class="close" @click="$emit('close')">
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="arrow" :style="'bottom:'+ arrowBottom +'px'"></div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    arrowBottom: Number
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
  color: #333;
}
.modal {
  position: fixed;
  left: 15px;
  bottom: 65px;
  width: calc(100% - 100px);
  // padding: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
  background-color: #fff;
  .title {
    border-bottom: 1px solid #f5f5f5;
    padding: 10px;
    width: 100%;
    .text {
      text-align: center;
    }
    .close {
      float: right;
      transform: translateY(-100%);
      width: 20px;
      height: 20px;
    }
  }
  .content {
    padding: 10px;
    min-height: 73px;
  }
  .arrow {
    position: absolute;
    right: -10px;
    bottom: 15px;
    transform: rotate(45deg);
    border: 10px solid #fff;
    border-top-right-radius: 5px;
    box-shadow: 2px -2px 4px -2px rgba(0,0,0,0.1);
    background-color: #fff;
  }
}
</style>
