<template>
  <div class="page">
    <div class="barrage-list">
      <div class="item">
        <div class="nickname">昵称：</div>
        <div class="barrage">文字文字文字文字文字文字文字文字文字文字</div>
      </div>
      <div class="item">
        <div class="nickname">昵称：</div>
        <div class="barrage">文字文字</div>
      </div>
      <div class="item">
        <div class="nickname">昵称：</div>
        <div class="barrage">文字文字文字文字文字文字文字文字文字文字文字文字文字文字文字</div>
      </div>
    </div>
    <div class="room-info">
      <div class="num">1234</div>
      <div class="text">房间</div>
    </div>
    <div class="user-info">
      <img src="../images/pin.png" alt="">
    </div>
    <div class="input-group flex-row flex-y-center">
      <input class="input flex-main" type="text" name="" id="">
      <input class="button" type="button" value="发送">
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss" scoped>
.page {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #fcfcfc;
  .barrage-list {
    padding: 15px;
    .item {
      padding: 2px 0px;
      .nickname {
        float: left;
        color: #888;
      }
      .text {
        float: left;
        color: #333;
      }
    }
  }
  .room-info {
    box-sizing: border-box;
    position: absolute;
    bottom: 65px;
    right: 15px;
    background-color: #fff;
    height: 50px;
    width: 50px;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    border-radius: 10px;
    padding: 5px;
    .num {
      text-align: center;
      // font-size: 18px;
      color: #333;
      height: 24px;
      line-height: 25px;
    }
    .text {
      // display: inline;
      font-size: 12px;
      color: #888;
      height: 25px;
      line-height: 20px;
      border-top: 1px solid #ccc;
      width: 30px;
      text-align: center;
      margin: 0 auto;
    }
  }
  .user-info {
    position: absolute;
    right: 15px;
    bottom: 130px;
    height: 50px;
    width: 50px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    text-align: center;
    img {
      margin-top: 7px;
      width: 35px;
      height: 35px;
      border-radius: 6px;
    }
  }
  .input-group {
    box-sizing: border-box;
    position: absolute;
    bottom: 0px;
    height: 50px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    padding: 0px 15px;
    .input {
      border: 0px;
      background-color: #f5f5f5;
      height: 35px;
      border-radius: 35px;
      padding: 0px 15px;
      &:focus {
        outline: 0px;
      }
    }
    .button {
      border: 0px;
      height: 35px;
      padding: 0px 10px;
      border-radius: 35px;
      margin-left: 10px;
    }
  }
}
</style>

