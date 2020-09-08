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
        <div v-for="(item, index) of tagsList" :key="item.id" class="index__body-effTags__one">
          <!-- <el-popover
            popper-class="myPopover"
            placement="bottom-end"
            :offset=-10
            :visible-arrow="false"
            trigger="manual"
            v-model="visible[i]"
          >-->
          <!-- <div>删除</div> -->
          <img :src="item.url" @contextmenu.prevent="chooseTag(index)" />
          <div
            style="display:inline-block"
            @contextmenu.prevent="chooseTag(index)"
            class="index__body-effTags__one-info"
          >
            <div class="index__body-effTags__one-info__name">{{item.name}}</div>
            <div class="index__body-effTags__one-info__msg">{{item.info}}</div>
          </div>
          <!-- </el-popover> -->
        </div>
        <div v-for="j in (tagsList.length%4)" :key="j" class="index__body-effTags__more"></div>
      </div>
      <div v-else class="index__body-conTags">
        <div v-for="(item, index) of tagsList" :key="item.id" class="index__body-conTags__one">
          <img @click="choose(index)" slot="reference" :src="item.url" />
          <span>{{item.name}}</span>
        </div>
        <div v-for="y in (tagsList.length%5)" :key="y" class="index__body-conTags__more"></div>
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
      <div class="index__tags">
        <el-divider>标签管理</el-divider>
        <div class="index__tags-choose">
          <el-radio-group size="mini" v-model="orderType" @change="changeOrder">
            <el-radio-button label="0">时间</el-radio-button>
            <el-radio-button label="1">名称</el-radio-button>
          </el-radio-group>
          <span style="font-size:1.4vw">:</span>
          <el-radio-group style="margin-left:1%" v-model="order" @change="changeOrder">
            <el-radio :label="0">
              <i style="font-size:1.2vw" class="el-icon-top"></i>
            </el-radio>
            <el-radio :label="1">
              <i style="font-size:1.2vw" class="el-icon-bottom"></i>
            </el-radio>
          </el-radio-group>
        </div>
        <div class="index__tags-add">
          <el-button
            type="primary"
            plain
            size="small"
            @click="dialogVisible = true"
            icon="el-icon-circle-plus-outline"
          >添加标签</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog title="添加标签" :visible.sync="dialogVisible" width="40%">
      <div>
        <el-input size="small" clearable v-model="form.address" placeholder="地址"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {sortLikeWin} from '../utils/commen'
export default {
  data () {
    return {
      select: '1', // 搜索源
      searchInfo: '', // 搜索内容
      drawer: false, // 设置项显示隐藏
      eff: true, // 主题选择
      orderType: 0, // 排序类型
      order: 0, // 排序顺序
      dialogVisible: false, // 添加标签弹窗
      form: {
        address: ''
      },
      visible: [],
      bg: localStorage.getItem('bg') == null ? 1 : localStorage.getItem('bg'),
      imageUrl:
        localStorage.getItem('imgData') == null
          ? ''
          : localStorage.getItem('imgData'),
      bgcolor:
        localStorage.getItem('bgcolor') == null
          ? 'rgba(64,158,255,0.6)'
          : localStorage.getItem('bgcolor'),
      tagsList: [
        {
          id: 1,
          url: require('../img/github.png'),
          name: 'GitHub1',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109000'
        },
        {
          id: 2,
          url: require('../img/github.png'),
          name: 'GitHub2',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109001'
        },
        {
          id: 3,
          url: require('../img/github.png'),
          name: 'GitHub3',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109003'
        },
        {
          id: 4,
          url: require('../img/github.png'),
          name: 'GitHub4',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109002'
        },
        {
          id: 5,
          url: require('../img/github.png'),
          name: 'GitHub5',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109005'
        },
        {
          id: 6,
          url: require('../img/github.png'),
          name: 'GitHub6',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109006'
        },
        {
          id: 7,
          url: require('../img/github.png'),
          name: 'GitHub7',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109005'
        },
        {
          id: 8,
          url: require('../img/github.png'),
          name: 'GitHub8',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109007'
        },
        {
          id: 9,
          url: require('../img/github.png'),
          name: 'GitHub10',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109008'
        },
        {
          id: 10,
          url: require('../img/github.png'),
          name: 'GitHub9',
          info: 'GitHub是一个面向开源及私有软件项目的托管平台',
          time: '1599546109009'
        }
      ]
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
    },
    chooseTag (index) {
      this.$forceUpdate()
      for (let i = 0; i < this.visible.length; i++) {
        if (i === index) {
          this.visible[i] = true
        } else {
          this.visible[i] = false
        }
      }
    },
    sortByTime (a, b) {
      return a - b
    },
    changeOrder () {
      if (this.orderType === '1') {
        this.tagsList.sort((a, b) => sortLikeWin(a.name, b.name))
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      } else {
        this.tagsList.sort((a, b) => this.sortByTime(a.time, b.time))
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      }
    }
  },
  mounted () {
    for (let i in 15) {
      this.visible[i] = false
    }
  }
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
      padding: 1%;
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
      &__one:hover {
        box-shadow: 0 0 15px 0 #409eff;
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
          -webkit-transition: -webkit-transform 1s ease-out;
          -moz-transition: -moz-transform 1s ease-out;
          -o-transition: -o-transform 1s ease-out;
          -ms-transition: -ms-transform 1s ease-out;
        }
        img:hover {
          -webkit-transform: rotateZ(360deg);
          -moz-transform: rotateZ(360deg);
          -o-transform: rotateZ(360deg);
          -ms-transform: rotateZ(360deg);
          transform: rotateZ(360deg);
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
  &__tags {
    width: 100%;
    font-size: 1vw;
    &-choose {
      margin-left: 5%;
    }
    &-add {
      margin: 2% 0 0 5%;
    }
  }
}
.myPopover {
  min-width: 65px;
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
.el-input__inner {
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
.el-drawer__open .el-drawer.rtl {
  // 去掉弹出层点击时产生的黑色border
  outline: none;
}
.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
</style>
