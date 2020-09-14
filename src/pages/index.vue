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
        <div v-for="(item, index) of tagsList" :key="item.id" @click="choose(item.address, index)" class="index__body-effTags__one">
          <el-popover
            popper-class="myPopover"
            placement="bottom-end"
            :offset=-10
            :visible-arrow="false"
            trigger="manual"
            v-model="visible[index]"
          >
          <div class="popper">
            <el-link href="#" :underline="false">前移</el-link>
            <el-divider></el-divider>
            <el-link href="#" :underline="false">后移</el-link>
            <el-divider></el-divider>
            <el-link href="#" :underline="false" type="primary">编辑</el-link>
            <el-divider></el-divider>
            <el-link href="#" :underline="false" type="danger">删除</el-link>
          </div>
          <div slot="reference" style="display:flex;flex-direction:row">
            <img :src="item.imgUrl" @contextmenu.prevent="chooseTag(index)" :style="{'background': item.bgColor}" style="display:inline-block" />
            <div
              @contextmenu.prevent="chooseTag(index)"
              class="index__body-effTags__one-info"
            >
              <div class="index__body-effTags__one-info__name">{{item.name}}</div>
              <div class="index__body-effTags__one-info__msg">{{item.info}}</div>
            </div>
          </div>
          </el-popover>
        </div>
        <div v-for="j in (tagsList.length%4)" :key="j" class="index__body-effTags__more"></div>
      </div>
      <div v-else class="index__body-conTags">
        <div v-for="(item, index) of tagsList" :key="item.id" class="index__body-conTags__one">
          <img @click="choose(item.address, index)" slot="reference" :style="{'background': item.bgColor}" :src="item.imgUrl" />
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
            @click="addTag"
            icon="el-icon-circle-plus-outline"
          >添加标签</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <div class="index__dialog">
        <el-tabs size="mini" v-model="activeName" type="card">
          <el-tab-pane label="手动添加" name="first">
            <div class="index__dialog-form">
              <div>
              <span>地址：</span>
              <el-input v-model="form.address" style="width:50%" size="small" clearable placeholder="请输入地址(必填)"></el-input>
              </div>
              <div style="margin-top:1vw">
              <span>名称：</span>
              <el-input v-model="form.name" style="width:50%" size="small" clearable placeholder="请输入名称(必填)"></el-input>
              </div>
              <div style="margin-top:1vw">
              <span>描述：</span>
              <el-input v-model="form.info" style="width:50%" size="small" clearable placeholder="相关描述(选填)"></el-input>
              </div>
              <div  style="margin-top:1vw">
                <span style="vertical-align:top">logo：</span>
                <input
                  id="getLogo"
                  type="file"
                  accept=".jpg, .png, .gif, .bmp, .jpeg"
                  style="display:none"
                  @change="clickF1"
                />
                <div class="avatar-uploader1">
                  <img v-if="form.logoUrl" @click="toclickF1" :src="form.logoUrl" class="avatar1" />
                  <i v-else @click="toclickF1" class="el-icon-plus avatar-uploader-icon1"></i>
                </div>
              </div>
              <span slot="foot">
              <div style="margin-top:1vw;text-align:right">
                <el-button size="small" type="primary">确定</el-button>
              </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane label="搜索添加" name="second">
        <div>
            <el-input size="small" style="width:50%" v-model="searchTag" placeholder="搜索" @keyup.enter.native="searchTagsByName"></el-input>
        </div>
        <div class="index__dialog-list"
         v-loading="loading"
         element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
          <div class="index__dialog-list__one" v-for="(item, index) in allTags" :key="item.id" @click="choose(index)">
            <img :src=item.imgUrl :style="{'background': item.bgColor}">
            <div class="index__dialog-list__one-info">
              <div class="index__dialog-list__one-info__name">{{item.name}}</div>
              <div class="index__dialog-list__one-info__msg">{{item.info}}</div>
            </div>
          </div>
        </div>
        </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {sortLikeWin} from '../utils/commen'
import {getTags, getUsualTags, searchTags} from '../utils/api'
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
      allTags: [],
      activeName: 'first',
      loading: true,
      searchTag: '', // 搜索标签
      logoUrl: '',
      form: {
        address: '',
        name: '',
        info: '',
        logoUrl: ''
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
      tagsList:
        localStorage.getItem('tags') == null
          ? []
          : JSON.parse(localStorage.getItem('tags'))
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
    toclickF () { // 背景图片
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
    toclickF1 () {
      document.getElementById('getLogo').click()
    },
    clickF1 (event) {
      let file = event.target.files[0]
      var fReader = new FileReader()
      fReader.onload = () => {
        // 将图片转码为base64存储localStorage
        this.form.logoUrl = fReader.result
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
    choose (url, index) {
      window.location.href = url
    },
    sortByTime (a, b) {
      return a - b
    },
    changeOrder () {
      if (this.orderType === '1') { // 根据名称排序
        this.tagsList.sort((a, b) => sortLikeWin(a.name, b.name))
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      } else { // 根据时间排序
        this.tagsList.sort((a, b) => this.sortByTime(a.updateTime, b.updateTime))
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      }
    },
    addTag () {
      getTags().then(res => {
        if (res.code === 200) {
          this.allTags = res.data
          this.loading = false
        }
      })
      this.dialogVisible = true
      this.drawer = false
    },
    searchTagsByName () {
      let params = {
        name: this.searchTag
      }
      searchTags(params).then(res => {
        if (res.code === 200) {
          this.allTags = res.data
        }
      })
    }
  },
  mounted () {
    if (this.tagsList.length === 0) {
      getUsualTags().then(res => {
        if (res.code === 200) {
          this.tagsList = res.data
          localStorage.setItem('tags', JSON.stringify(this.tagsList))
        }
      })
    }
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
      &__one {
        width: 23%;
        height: 14vh;
        margin-top: 1.5vw;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        img {
          cursor: pointer;
          width: 14vh;
          height: 14vh;
          border-radius: 5px 0 0 5px;
        }
        &-info {
          width: 11.6vw;
          cursor: pointer;
          background: #fff;
          opacity: 0.85;
          border-radius: 0 5px 5px 0;
          box-sizing: border-box;
          padding: 3% 3% 3% 3%;
          height: 14vh;
          overflow: hidden;
          text-overflow:ellipsis;
          &__name {
            width: 100%;
            font-size: 1.2vw;
            color: #303133;
          }
          &__msg {
            width: 100%;
            margin-top: 0.5vw;
            font-size: 1vw;
            color: #606266;
          }
        }
      }
      &__one:hover {
        border-radius: 5px;
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
  &__dialog{
    height: 65vh;
    &-list::-webkit-scrollbar {
      display: none;
    }
    &-list{
      height: 50vh;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      overflow-y: scroll;
      &__one {
        width: 40%;
        height: 10vh;
        margin-top: 1vw;
        display: flex;
        flex-direction: row;
        img {
          cursor: pointer;
          width: 10vh;
          height: 10vh;
          border-radius: 5px 0 0 5px;
        }
        &-info{
          cursor: pointer;
          background: #E4E7ED;
          width: 100%;
          opacity: 0.85;
          border-radius: 0 5px 5px 0;
          box-sizing: border-box;
          padding: 3% 3% 3% 3%;
          overflow: hidden;
          &__name {
            font-size: 1vw;
            color: #303133;
          }
          &__msg {
            margin-top: 0.1vw;
            font-size: 0.6vw;
            color: #606266;
          }
        }
      }
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
.avatar-uploader1 {
  display: inline-block;
  width: 10vw;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader1:hover {
  border-color: #409eff;
}
.avatar-uploader-icon1 {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 10vw;
  line-height: 10vw;
  text-align: center;
}
.avatar1 {
  width: 10vw;
  height: 10vw;
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
.el-popover{
  padding: 0;
}
.el-popper[x-placement^="bottom"] {
  margin-top: -10px;
}
.el-popper[x-placement^="top"] {
  margin-bottom: -10px;
}
.popper{
  text-align: center;
  /deep/ .el-divider--horizontal{
    margin: 0;
  }
}
.el-tabs__item {
  height: 2vw;
  line-height: 2vw;
}
</style>
