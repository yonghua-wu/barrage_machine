<template>
  <div class="auth">
    <div class="input-group flex-row flex-y-center">
      <span class="input-title">房间号</span>
      <input class="input flex-main" type="text" name="" id="" placeholder="输入房间号">  
    </div>
    <div class="input-group flex-row flex-y-center">
      <span class="input-title flex-row"><span>昵</span><span>称</span></span>
      <input class="input flex-main" type="text" name="" id="" placeholder="你的昵称">
    </div>
    <div class="input-group flex-row flex-y-center">
      <span class="input-title">验证码</span>
      <input class="input flex-main" type="text" name="" id="" placeholder="输入验证码">
      <img class="input-pin" src="../images/pin.png" alt="">
    </div>
    <div class="input-group flex-row flex-x-end flex-y-center">
      <input class="enter-button" type="button" value="进入">
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>
.auth {
  margin-top: 22vh;
  padding: 20px;
  .input-group {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: 0px;
    }
    .input {
      width: 100px;
    }
    .input-title {
      padding: 0px 20px;
      width: 50px;
      flex-shrink: 0;
      justify-content: space-between;
    }
    .input-pin {
      width: 100px;
      height: 35px;
      flex-basis: 100px;
    }
    .enter-button {
      width: 100px;
      height: 35px;
    }
  }
}
input {
  border: 0px;
  &:focus {
    outline: 0px;
  }
}
</style>
