<template>
  <div
    class="index"
    :style="(bg == 0 && imageUrl != '')? {'background': 'url(' + imageUrl + ')', 'background-size': '100% 100%'} : {background: bgcolor}"
  >
    <div class="index__body">
      <!-- 显示设置项 -->
      <div style="position:fixed;width:10px;height:100vh;right:0" @mouseenter="drawer = true"></div>
      <!-- 搜索栏 -->
      <div class="index__body-search">
        <el-input v-model="searchInfo" placeholder="搜索" style="width:60%">
          <el-select v-model="select" slot="prepend">
            <el-option label="百度" value="1"></el-option>
            <el-option label="Google" value="2"></el-option>
            <el-option label="搜狐" value="3"></el-option>
          </el-select>
        </el-input>
      </div>
      <!-- 标签展示栏 -->
      <div v-if="eff" class="index__body-effTags">
        <div v-for="i in 15" :key="i" class="index__body-effTags__one">
          <img src="../img/github.png" />
          <div class="index__body-effTags__one-info">
            <div class="index__body-effTags__one-info__name">GitHub</div>
            <div class="index__body-effTags__one-info__msg">GitHub是一个面向开源及私有软件项目的托管平台</div>
          </div>
        </div>
        <div v-for="j in (15%4)" :key="j" class="index__body-effTags__more"></div>
      </div>
      <div v-else class="index__body-conTags">
        <div v-for="x in 11" :key="x" class="index__body-conTags__one">
          <el-popover placement="top-start" width="100" trigger="hover">
            <div style="font-size:0.6vw">GitHub是一个面向开源及私有软件项目的托管平台</div>
            <img slot="reference" src="../img/github.png" />
          </el-popover>
          <span>GitHub</span>
        </div>
        <div v-for="y in (11%5)" :key="y" class="index__body-conTags__more"></div>
      </div>
    </div>
    <!-- 设置项 -->
    <el-drawer
      size="25%"
      :with-header="false"
      :modal="false"
      :visible.sync="drawer"
      direction="rtl"
    >
      <div class="index__bg">
        <el-divider>背景设置</el-divider>
        <div class="index__bg-choose">
          <el-radio-group size="mini" v-model="bg" @change="changeBG">
            <el-radio-button label="0">壁纸</el-radio-button>
            <el-radio-button label="1">纯色</el-radio-button>
          </el-radio-group>
        </div>
        <!-- 壁纸显示 -->
        <div class="index__bg-img" v-show="bg == 0">
          <input
            id="getImg"
            type="file"
            accept=".jpg, .png, .gif, .bmp, .jpeg"
            style="display:none"
            @change="clickF"
          />
          <div class="avatar-uploader">
            <img v-if="imageUrl" @click="toclickF" :src="imageUrl" class="avatar" />
            <i v-else @click="toclickF" class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
        <!-- 纯色显示 -->
        <div class="index__bg-color" v-show="bg == 1">
          <el-color-picker v-model="bgcolor" @active-change="colorChange" show-alpha></el-color-picker>
        </div>
      </div>
      <div class="index__theme">
        <el-divider>主题选择</el-divider>
        <div class="index__theme-list">
          <div
            @click="eff = !eff"
            :style="eff? {'background':'#409eff'} : {'background':'#606266'}"
            class="index__theme-list__eff"
          >
            <div class="index__theme-list__eff-search"></div>
            <div class="index__theme-list__eff-tags">
              <div v-for="m in 8" :key="m" class="index__theme-list__eff-tags__one">
                <div class="index__theme-list__eff-tags__one-left"></div>
                <div class="index__theme-list__eff-tags__one-right"></div>
              </div>
            </div>
          </div>
          <div
            @click="eff = !eff"
            :style="!eff? {'background':'#409eff'} : {'background':'#606266'}"
            class="index__theme-list__con"
          >
            <div class="index__theme-list__con-search"></div>
            <div class="index__theme-list__con-tags">
              <div v-for="n in 10" :key="n" class="index__theme-list__con-tags__one"></div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data () {
    return {
      select: '1', // 搜索源
      searchInfo: '', // 搜索内容
      drawer: false, // 设置项显示隐藏
      eff: true, // 主题选择
      bg: localStorage.getItem('bg') == null ? 1 : localStorage.getItem('bg'),
      imageUrl:
        localStorage.getItem('imgData') == null
          ? ''
          : localStorage.getItem('imgData'),
      bgcolor:
        localStorage.getItem('bgcolor') == null
          ? 'rgba(64,158,255,0.6)'
          : localStorage.getItem('bgcolor')
    }
  },
  methods: {
    toChangeColor () {
      document.getElementById('color').click()
    },
    changeBG (e) {
      localStorage.setItem('bg', e)
    },
    colorChange (e) {
      // 动态改变背景颜色
      this.bgcolor = e
      localStorage.setItem('bgcolor', e)
    },
    toclickF () {
      document.getElementById('getImg').click()
    },
    clickF (event) {
      let file = event.target.files[0]
      var fReader = new FileReader()
      fReader.onload = () => {
        // 将图片转码为base64存储localStorage
        this.imageUrl = fReader.result
        localStorage.setItem('imgData', fReader.result)
      }
      fReader.readAsDataURL(file)
    }
  },
  mounted () {}
}
</script>
<style lang="less">
html,
body .index {
  font-family: "微软雅黑";
  width: 100%;
  height: 100vh;
  &__body {
    box-sizing: border-box;
    padding: 5% 5% 5% 5%;
    width: 90%;
    height: 100vh;
    margin-left: 5%;
    &-search {
      text-align: center;
    }
    &-effTags::-webkit-scrollbar {
      display: none;
    }
    &-effTags {
      height: 90%;
      margin-top: 2vw;
      overflow-y: scroll;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow-y: scroll;
      overflow: hidden;
      &__one {
        width: 23%;
        height: 14vh;
        margin-top: 1.5vw;
        display: flex;
        flex-direction: row;
        img {
          cursor: pointer;
          width: 14vh;
          height: 14vh;
          background: #409eff;
          border-radius: 5px 0 0 5px;
        }
        &-info {
          cursor: pointer;
          background: #fff;
          opacity: 0.85;
          border-radius: 0 5px 5px 0;
          box-sizing: border-box;
          padding: 3% 3% 3% 3%;
          &__name {
            font-size: 1.2vw;
            color: #303133;
          }
          &__msg {
            margin-top: 0.5vw;
            font-size: 1vw;
            color: #606266;
          }
        }
      }
      &__more {
        width: 23%;
        height: 14vh;
      }
    }
    &-conTags::-webkit-scrollbar {
      display: none;
    }
    &-conTags {
      width: 90%;
      height: 90%;
      overflow-y: scroll;
      margin-left: 5%;
      margin-top: 2vw;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      &__one {
        cursor: pointer;
        width: 14vw;
        height: 14vw;
        margin-top: 1vw;
        text-align: center;
        img {
          width: 9vw;
          height: 9vw;
          background: #409eff;
          border-radius: 10px;
        }
        span {
          display: block;
          font-size: 1.2vw;
          color: #f2f6fc;
          margin-top: 1vw;
          font-weight: bold;
        }
      }
      &__more {
        width: 14vw;
        height: 14vw;
      }
    }
  }
  &__bg {
    width: 100%;
    font-size: 1vw;
    &-choose {
      margin-left: 5%;
    }
    &-img {
      width: 100%;
      margin-top: 0.6vw;
      text-align: center;
    }
    &-color {
      width: 100%;
      margin-top: 0.6vw;
      text-align: center;
    }
  }
  &__theme {
    width: 100%;
    font-size: 1vw;
    &-list {
      width: 80%;
      margin-left: 10%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &__eff {
        box-sizing: border-box;
        width: 8vw;
        height: 5vw;
        padding: 2% 2% 2% 2%;
        cursor: pointer;
        &-search {
          width: 60%;
          margin-left: 20%;
          height: 10%;
          background: #8c939d;
          border-radius: 5px;
        }
        &-tags {
          margin-top: 2%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          height: 80%;
          &__one {
            width: 1.5vw;
            height: 24%;
            margin-top: 10%;
            display: flex;
            flex-direction: row;
            &-left {
              width: 40%;
              border-radius: 2px 0 0 2px;
              background: #d9d9d9;
            }
            &-right {
              width: 60%;
              border-radius: 0 2px 2px 0;
              background: #f2f6fc;
            }
          }
        }
      }
      &__con {
        box-sizing: border-box;
        width: 8vw;
        height: 5vw;
        padding: 2% 2% 2% 2%;
        cursor: pointer;
        &-search {
          width: 60%;
          margin-left: 20%;
          height: 10%;
          background: #8c939d;
          border-radius: 5px;
        }
        &-tags {
          margin-top: 2%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          height: 80%;
          &__one {
            width: 1vw;
            margin-left: 0.3vw;
            height: 1vw;
            margin-top: 8%;
            background: #d9d9d9;
            border-radius: 2px;
          }
        }
      }
    }
  }
}
.avatar-uploader {
  display: inline-block;
  width: 80%;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 178px;
  display: inline-block;
}
.el-color-picker__trigger {
  height: 4vw;
  width: 4vw;
}
.el-radio-button--mini .el-radio-button__inner {
  font-size: 1vw;
}
.el-divider__text,
.el-link {
  font-size: 1vw;
}
.el-select .el-input {
  width: 8vw;
}
.el-input__inner{
  height: 3.4vw;
  font-size: 1.2vw;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-input-group__append,
.el-input-group__prepend {
  background: #f2f6fc;
  color: #409eff;
  font-weight: bold;
}
.el-drawer__open .el-drawer.rtl { // 去掉弹出层点击时产生的黑色border
    outline: none;
}
</style>
