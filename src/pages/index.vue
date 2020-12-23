<template>
  <div
    class="index"
    :style="
      bg == 0 && imageUrl != ''
        ? {
            background: 'url(' + imageUrl + ')',
            'background-size': '100% 100%',
          }
        : { background: bgcolor }
    "
  >
    <div class="index__body">
      <!-- 显示设置项 -->
      <div
        style="position: fixed; width: 10px; height: 100vh; right: 0"
        @mouseenter="drawer = true"
      ></div>
      <!-- 搜索栏 -->
      <div class="index__body-search">
        <el-input
          v-model="searchInfo"
          clearable
          @keyup.enter.native="toSearch"
          placeholder="搜索"
          style="width: 60%"
        >
          <el-select v-model="select" @change="changeSelect" slot="prepend">
            <el-option
              v-for="item in webs"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </div>
      <!-- 标签展示栏 -->
      <div v-if="eff == '0'" class="index__body-effTags">
        <div
          v-for="(item, index) of tagsList"
          v-dragging="{ item: item, list: tagsList, group: 'tag' }"
          :key="item.id"
          @click="choose(item.address, index)"
          class="index__body-effTags__one"
        >
          <el-popover
            transition="el-zoom-in-top"
            popper-class="myPopover"
            placement="bottom-end"
            :offset="-10"
            :visible-arrow="false"
            trigger="manual"
            v-model="visible[index]"
          >
            <div class="popper">
              <el-link
                @click.native="choose(item.address, index)"
                :underline="false"
                >当前页打开</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="chooseNew(item.address, index)"
                :underline="false"
                >新窗口打开</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="editTag(item, index)"
                :underline="false"
                type="primary"
                >编辑</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="deleteTag(item, index)"
                :underline="false"
                type="danger"
                >删除</el-link
              >
            </div>
            <div
              @mouseleave="clearPopover(index)"
              slot="reference"
              style="display: flex; flex-direction: row"
            >
              <img
                :src="item.imgUrl"
                @contextmenu.prevent="chooseTag(index)"
                :style="{ background: item.bgColor }"
                style="display: inline-block"
              />
              <div
                @contextmenu.prevent="chooseTag(index)"
                class="index__body-effTags__one-info"
              >
                <div class="index__body-effTags__one-info__name">
                  {{ item.name }}
                </div>
                <div
                  class="index__body-effTags__one-info__msg"
                  show-overflow-tooltip="true"
                >
                  {{ item.info }}
                </div>
              </div>
            </div>
          </el-popover>
        </div>
        <div @click="addTag" class="index__body-effTags__add">
          <i class="el-icon-plus"></i>
        </div>
        <div
          v-for="j in 4 - ((tagsList.length + 1) % 4)"
          :key="j + 'x'"
          class="index__body-effTags__more"
        ></div>
      </div>
      <div v-else class="index__body-conTags" ref="parentNode">
        <div
          v-for="(item, index) of tagsList"
          v-dragging="{ item: item, list: tagsList, group: 'tag' }"
          :key="item.id"
          class="index__body-conTags__one"
        >
          <el-popover
            transition="el-zoom-in-top"
            popper-class="myPopover"
            placement="bottom-end"
            :offset="-10"
            :visible-arrow="false"
            trigger="manual"
            v-model="visible[index]"
          >
            <div class="popper">
              <el-link
                @click.native="choose(item.address, index)"
                :underline="false"
                >当前页打开</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="chooseNew(item.address, index)"
                :underline="false"
                >新窗口打开</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="editTag(item, index)"
                :underline="false"
                type="primary"
                >编辑</el-link
              >
              <el-divider></el-divider>
              <el-link
                @click.native="deleteTag(item, index)"
                :underline="false"
                type="danger"
                >删除</el-link
              >
            </div>
            <div
              @mouseleave="clearPopover(index)"
              @contextmenu.prevent="chooseTag(index)"
              slot="reference"
            >
              <img
                @click="choose(item.address, index)"
                :style="{ background: item.bgColor }"
                :src="item.imgUrl"
              />
              <span :style="{color: fontColor}">{{ item.name }}</span>
            </div>
          </el-popover>
        </div>
        <div class="addDiv">
          <div @click="addTag" class="index__body-conTags__add">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <div
          v-for="y in 6 - ((tagsList.length + 1) % 6)"
          :key="y + 'y'"
          class="index__body-conTags__more"
        ></div>
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
            style="display: none"
            @change="clickF"
          />
          <div class="avatar-uploader">
            <img
              v-if="imageUrl"
              @click="toclickF"
              :src="imageUrl"
              class="avatar"
            />
            <i
              v-else
              @click="toclickF"
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </div>
        </div>
        <!-- 纯色显示 -->
        <div class="index__bg-color" v-show="bg == 1">
          <el-color-picker
            v-model="bgcolor"
            @active-change="colorChange"
            show-alpha
          ></el-color-picker>
        </div>
      </div>
      <div class="index__theme">
        <el-divider>主题选择</el-divider>
        <div class="index__theme-list">
          <div
            @click="chooseEff('0')"
            :style="
              eff == '0' ? { background: '#409eff' } : { background: '#606266' }
            "
            class="index__theme-list__eff"
          >
            <div class="index__theme-list__eff-search"></div>
            <div class="index__theme-list__eff-tags">
              <div
                v-for="m in 8"
                :key="m"
                class="index__theme-list__eff-tags__one"
              >
                <div class="index__theme-list__eff-tags__one-left"></div>
                <div class="index__theme-list__eff-tags__one-right"></div>
              </div>
            </div>
          </div>
          <div
            @click="chooseEff('1')"
            :style="
              eff == '1' ? { background: '#409eff' } : { background: '#606266' }
            "
            class="index__theme-list__con"
          >
            <div class="index__theme-list__con-search"></div>
            <div class="index__theme-list__con-tags">
              <div
                v-for="n in 10"
                :key="n"
                class="index__theme-list__con-tags__one"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="index__font" v-show="eff == 1">
        <el-divider>字体颜色</el-divider>
        <div class="index__bg-color">
          <el-color-picker
            v-model="fontColor"
            @active-change="fontColorChange"
          ></el-color-picker>
        </div>
      </div>
      <div class="index__tags">
        <el-divider>标签排序</el-divider>
        <div class="index__tags-choose">
          <el-radio-group size="mini" v-model="orderType" @change="changeOrder">
            <el-radio-button label="0">时间</el-radio-button>
            <el-radio-button label="1">名称</el-radio-button>
          </el-radio-group>
          <span style="font-size: 1.4vw">:</span>
          <el-radio-group
            style="margin-left: 1%"
            v-model="order"
            @change="changeOrder"
          >
            <el-radio :label="0">
              <i style="font-size: 1.2vw" class="el-icon-top"></i>
            </el-radio>
            <el-radio :label="1">
              <i style="font-size: 1.2vw" class="el-icon-bottom"></i>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      title="添加标签"
    >
      <div class="index__dialog">
        <el-tabs size="mini" v-model="activeName" type="card">
          <el-tab-pane label="搜索添加" name="first">
            <div>
              <el-input
                size="small"
                clearable
                style="width: 50%"
                v-model="searchTag"
                placeholder="搜索"
                prefix-icon="el-icon-search"
                @keyup.enter.native="searchTagsByName"
              ></el-input>
            </div>
            <div
              class="index__dialog-list"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
            >
              <div
                class="index__dialog-list__one"
                v-for="(item, index) in allTags"
                :key="item.id"
                @click="addOneTag(item, index)"
              >
                <img :src="item.imgUrl" :style="{ background: item.bgColor }" />
                <div class="index__dialog-list__one-info">
                  <div class="index__dialog-list__one-info__name">
                    {{ item.name }}
                  </div>
                  <div class="index__dialog-list__one-info__msg">
                    {{ item.info }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="手动添加" name="second">
            <div class="index__dialog-form">
              <div>
                <span style="color: #e82b1f">*</span>
                <span>地址：</span>
                <el-input
                  style="width: 50%"
                  size="small"
                  placeholder="网站地址"
                  clearable
                  v-model="form.address"
                  class="input-with-select"
                >
                  <el-select
                    v-model="selectHttp"
                    slot="prepend"
                    placeholder="请选择"
                  >
                    <el-option label="http://" value="1"></el-option>
                    <el-option label="https://" value="2"></el-option>
                  </el-select>
                </el-input>
              </div>
              <div style="margin-top: 1vw">
                <span style="color: #e82b1f">*</span>
                <span>名称：</span>
                <el-input
                  v-model="form.name"
                  style="width: 50%"
                  size="small"
                  clearable
                  placeholder="网站名称"
                ></el-input>
              </div>
              <div style="margin-top: 1vw">
                <span style="vertical-align: top">&ensp;&nbsp;描述：</span>
                <el-input
                  v-model="form.info"
                  type="textarea"
                  resize="none"
                  style="width: 50%"
                  size="small"
                  placeholder="网站描述"
                  aria-required="true"
                ></el-input>
              </div>
              <div style="margin-top: 1vw">
                <div style="display: inline-block">
                  <span style="color: #e82b1f; vertical-align: top">*</span>
                  <span style="vertical-align: top">logo：</span>
                  <input
                    id="getLogo"
                    type="file"
                    accept=".jpg, .png, .gif, .bmp, .jpeg"
                    style="display: none"
                    @change="clickF1"
                  />
                  <div class="avatar-uploader1">
                    <img
                      v-if="form.imgUrl"
                      @click="toclickF1"
                      :src="form.imgUrl"
                      :style="{ background: form.bgColor }"
                      class="avatar1"
                    />
                    <i
                      v-else
                      @click="toclickF1"
                      class="el-icon-plus avatar-uploader-icon1"
                    ></i>
                  </div>
                </div>
                <div
                  style="
                    display: inline-block;
                    vertical-align: top;
                    margin-left: 20px;
                  "
                >
                  <span style="vertical-align: top">背景颜色：</span>
                  <el-color-picker
                    v-model="form.bgColor"
                    @active-change="logoColorChange"
                  ></el-color-picker>
                </div>
              </div>
              <div style="float: right; margin-top: 6vh">
                <el-button @click="addMyTag" type="primary">确定</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <el-dialog
      title="编辑标签"
      :close-on-click-modal="false"
      :visible.sync="dialogVisibleEdit"
      width="50%"
    >
      <div class="index__dialog-form">
        <div>
          <span style="color: #e82b1f">*</span>
          <span>地址：</span>
          <el-input
            style="width: 50%"
            size="small"
            placeholder="网站地址"
            clearable
            v-model="editForm.address"
            class="input-with-select"
          >
          </el-input>
        </div>
        <div style="margin-top: 1vw">
          <span style="color: #e82b1f">*</span>
          <span>名称：</span>
          <el-input
            v-model="editForm.name"
            style="width: 50%"
            size="small"
            clearable
            placeholder="网站名称"
          ></el-input>
        </div>
        <div style="margin-top: 1vw">
          <span style="vertical-align: top">&ensp;&nbsp;描述：</span>
          <el-input
            v-model="editForm.info"
            type="textarea"
            resize="none"
            style="width: 50%"
            size="small"
            placeholder="网站描述"
            aria-required="true"
          ></el-input>
        </div>
        <div style="margin-top: 1vw">
          <div style="display: inline-block">
            <span style="color: #e82b1f; vertical-align: top">*</span>
            <span style="vertical-align: top">logo：</span>
            <input
              id="getLogo2"
              type="file"
              accept=".jpg, .png, .gif, .bmp, .jpeg"
              style="display: none"
              @change="clickF2"
            />
            <div class="avatar-uploader1">
              <img
                v-if="editForm.imgUrl"
                @click="toclickF2"
                :src="editForm.imgUrl"
                :style="{ background: editForm.bgColor }"
                class="avatar1"
              />
              <i
                v-else
                @click="toclickF2"
                class="el-icon-plus avatar-uploader-icon1"
              ></i>
            </div>
          </div>
          <div
            style="
              display: inline-block;
              vertical-align: top;
              margin-left: 20px;
            "
          >
            <span style="vertical-align: top">背景颜色：</span>
            <el-color-picker
              v-model="editForm.bgColor"
              @active-change="logoColorChange2"
            ></el-color-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisibleEdit = false"
          >取 消</el-button
        >
        <el-button size="small" @click="saveEdit" type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="教程"
      :visible.sync="dialogVisibleUse"
      width="60%"
      :close-on-click-modal="false"
      @close="setFlag"
    >
      <div style="height: 70vh; overflow: hidden; overflow-y: scroll">
        <div>
          &emsp;&emsp;&emsp;感谢您使用本标签页，首先请您耐心阅读相关使用教程。
        </div>
        <div style="margin: 10px 0 4px 0">
          <span style="color: #409eff"
            ><i class="el-icon-help"></i>搜索引擎切换</span
          >--支持多款主流搜索，简单便捷。
        </div>
        <img src="../img/1.png" style="width: 90%" />
        <div style="margin: 10px 0 4px 0">
          <span style="color: #409eff"
            ><i class="el-icon-help"></i>自定义设置(鼠标移至最右侧显示)</span
          >--支持自定义背景、主题、排序(可拖拽排序)等功能。
        </div>
        <img src="../img/2.png" style="width: 90%" />
        <img src="../img/6.jpg" style="width: 90%" />
        <div style="margin: 10px 0 4px 0">
          <span style="color: #409eff"
            ><i class="el-icon-help"></i>添加标签</span
          >--支持搜索添加以及手动添加。
        </div>
        <img src="../img/3.png" style="width: 90%" />
        <img src="../img/4.jpg" style="width: 90%" />
        <div style="margin: 10px 0 4px 0">
          <span style="color: #409eff"
            ><i class="el-icon-help"></i>编辑标签(点击鼠标右键)</span
          >--支持编辑、删除等功能。
        </div>
        <img src="../img/5.png" style="width: 90%" />
        <div style="margin: 10px 0 4px 0; color: #409eff">
          <i class="el-icon-s-opportunity"></i>更多功能敬请期待!
        </div>
        <!-- <img style="position: absolute; top: 0; left: 0; border: 0;"
        src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
        alt="Fork me on GitHub"
        @click="toGitHub"> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { sortLikeWin, timeJS, isNullAndEmpty, objectJS } from '../utils/commen'
import { getTags, getUsualTags, searchTags } from '../utils/api'
import {search} from './search'
import {webs} from './webs'
export default {
  data: () => ({
    webs: webs,
    dialogVisibleUse: true,
    select:
        localStorage.getItem('select') == null
          ? '1'
          : localStorage.getItem('select'), // 搜索源
    searchInfo: '', // 搜索内容
    drawer: false, // 设置项显示隐藏
    eff:
        localStorage.getItem('eff') == null ? '0' : localStorage.getItem('eff'), // 主题选择
    orderType:
        localStorage.getItem('orderType') == null
          ? 0
          : localStorage.getItem('orderType'), // 排序类型
    order:
        localStorage.getItem('order') == null
          ? 0
          : localStorage.getItem('order'), // 排序顺序
    dialogVisible: false, // 添加标签弹窗
    dialogVisibleEdit: false, // 编辑标签弹窗
    editForm: {}, // 编辑表单
    editIndex: 0, // 编辑标签的数组下标
    page: 0,
    allTags: [], // 所有标签
    activeName: 'first', // 添加标签方式
    loading: true,
    searchTag: '', // 搜索标签
    selectHttp: '1',
    form: {
      // 手动添加标签表单
      address: '',
      name: '',
      info: '',
      imgUrl: '',
      bgColor: '#409eff',
      updateTime: ''
    },
    visible: [],
    bg: localStorage.getItem('bg') == null ? 1 : localStorage.getItem('bg'), // 背景选择
    // 背景图片
    imageUrl:
        localStorage.getItem('imgData') == null
          ? ''
          : localStorage.getItem('imgData'),
    // 背景颜色
    bgcolor:
        localStorage.getItem('bgcolor') == null
          ? 'rgba(64,158,255,0.6)'
          : localStorage.getItem('bgcolor'),
    // 标签
    tagsList:
        localStorage.getItem('tags') == null
          ? []
          : JSON.parse(localStorage.getItem('tags')),
    fontColor: localStorage.getItem('fontColor') == null
      ? '#fff'
      : localStorage.getItem('fontColor')
  }),
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      localStorage.setItem('tags', JSON.stringify(value.list))
    })
  },
  methods: {
    toGitHub () {
      window.open('https://github.com/qiaolufei/TagsPage/issues')
    },
    setFlag () {
      localStorage.setItem('readFirst', 0)
    },
    changeSelect (value) {
      // 搜索引擎
      localStorage.setItem('select', value)
    },
    toSearch () {
      search(this.select, this.searchInfo)
    },
    // 存储背景选择
    changeBG (e) {
      localStorage.setItem('bg', e)
    },
    // 动态改变背景颜色
    colorChange (e) {
      this.bgcolor = e
      localStorage.setItem('bgcolor', e)
    },
    // 动态改变背景颜色
    fontColorChange (e) {
      this.fontColor = e
      localStorage.setItem('fontColor', e)
    },
    logoColorChange (e) {
      // 添加标签
      this.form.bgColor = e
    },
    logoColorChange2 (e) {
      // 编辑标签
      this.editForm.bgColor = e
    },
    // 改变背景图片
    toclickF () {
      // 背景图片
      document.getElementById('getImg').click()
    },
    clearPopover (index) {
      // 自动关闭标签选项
      setTimeout(() => {
        this.$forceUpdate()
        this.visible[index] = false
      }, 3000)
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
    chooseEff (value) {
      // 主题选择
      this.eff = value
      localStorage.setItem('eff', this.eff)
    },
    // 手动添加标签时选择logo
    toclickF1 () {
      document.getElementById('getLogo').click()
    },
    clickF1 (event) {
      let file = event.target.files[0]
      var fReader = new FileReader()
      fReader.onload = () => {
        // 将图片转码为base64存储localStorage
        this.form.imgUrl = fReader.result
      }
      fReader.readAsDataURL(file)
    },
    // 手动添加标签时选择logo
    toclickF2 () {
      document.getElementById('getLogo2').click()
    },
    clickF2 (event) {
      let file = event.target.files[0]
      var fReader = new FileReader()
      fReader.onload = () => {
        // 将图片转码为base64存储localStorage
        this.editForm.imgUrl = fReader.result
      }
      fReader.readAsDataURL(file)
    },
    // 点击右键显示popover选项
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
    // 选择标签页跳转
    choose (url, index) {
      window.location.href = url
    },
    chooseNew (url, index) {
      // 新窗口打开
      window.open(url)
    },
    // 标签排序
    sortByTime (a, b) {
      return a - b
    },
    changeOrder () {
      if (this.orderType === '1') {
        // 根据名称排序
        this.tagsList.sort((a, b) => sortLikeWin(a.name, b.name))
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      } else {
        // 根据时间排序
        this.tagsList.sort((a, b) =>
          this.sortByTime(a.updateTime, b.updateTime)
        )
        if (this.order === 1) {
          this.tagsList.reverse()
        }
      }
      localStorage.setItem('orderType', this.orderType)
      localStorage.setItem('order', this.order)
    },
    // 打开添加标签弹窗
    addTag () {
      this.dialogVisible = true
      this.drawer = false
      getTags().then((res) => {
        if (res.code === 200) {
          this.allTags = res.data
          this.loading = false
        }
      })
    },
    // 搜索标签
    searchTagsByName () {
      this.loading = true
      if (!isNullAndEmpty(this.searchTag)) {
        let params = {
          name: this.searchTag
        }
        searchTags(params).then((res) => {
          if (res.code === 200) {
            this.allTags = res.data
            this.loading = false
          } else if (res.code === 201) {
            this.$message.warning(
              '抱歉！未能查询到' + this.searchTag + ',请重新输入'
            )
            this.searchTag = ''
            getTags().then((res) => {
              if (res.code === 200) {
                this.allTags = res.data
                this.loading = false
              }
            })
          }
        })
      } else {
        getTags().then((res) => {
          if (res.code === 200) {
            this.allTags = res.data
            this.loading = false
          }
        })
      }
    },
    // 手动添加
    addMyTag () {
      let b = this.tagsList.some((item1, index) => {
        return this.form.name === item1.name
      })
      if (!b) {
        if (isNullAndEmpty(this.form.address)) {
          this.$notify.error('请填写网站地址')
        } else if (isNullAndEmpty(this.form.name)) {
          this.$notify.error('请填写网站名称')
        } else if (isNullAndEmpty(this.form.imgUrl)) {
          this.$notify.error('请上传网站Logo')
        } else {
          this.dialogVisible = false
          this.$message.success('添加成功！')
          this.form.updateTime = timeJS.getNowTime('timestamp')
          let m = this.selectHttp === '1' ? 'http://' : 'https://'
          this.form.address = m + this.form.address
          let { ...obj } = this.form
          this.tagsList.push(obj)
          this.setVisible()
          localStorage.setItem('tags', JSON.stringify(this.tagsList))
          objectJS.clearValue(this.form)
        }
      } else {
        this.$message.warning(this.form.name + '标签已存在！')
      }
    },
    // 在“搜索添加”中添加
    addOneTag (item, index) {
      let b = this.tagsList.some((item1, index) => {
        return item.name === item1.name
      })
      if (!b) {
        item.updateTime = timeJS.getNowTime('timestamp')
        this.tagsList.push(item)
        this.setVisible()
        localStorage.setItem('tags', JSON.stringify(this.tagsList))
        this.dialogVisible = false
        this.$message.success('添加成功！')
        this.searchTag = ''
        getTags().then((res) => {
          if (res.code === 200) {
            this.allTags = res.data
            this.loading = false
          }
        })
      } else {
        this.$message.warning(item.name + '标签已存在！')
      }
    },
    // 删除标签页
    deleteTag (item, index) {
      this.$forceUpdate()
      this.tagsList.splice(index, 1)
      localStorage.setItem('tags', JSON.stringify(this.tagsList))
      this.$message.success('删除成功！')
      this.visible[index] = false
      this.setVisible()
    },
    setVisible () {
      // 设置popover
      let l = this.tagsList
      for (let i = 0; i < l; i++) {
        this.visible[i] = false
      }
    },
    editTag (item, index) {
      this.dialogVisibleEdit = true
      this.editForm = item
      this.editIndex = this.tagsList.find((t) => {
        t.name = this.this.editForm
      })
    },
    saveEdit () {
      // 编辑标签
      if (isNullAndEmpty(this.editForm.address)) {
        this.$notify.error('请填写网站地址')
      } else if (isNullAndEmpty(this.editForm.name)) {
        this.$notify.error('请填写网站名称')
      } else if (isNullAndEmpty(this.editForm.imgUrl)) {
        this.$notify.error('请上传网站Logo')
      } else {
        this.dialogVisibleEdit = false
        this.$message.success('编辑成功！')
        this.tagsList[this.index] = this.editForm
        this.setVisible()
        localStorage.setItem('tags', JSON.stringify(this.tagsList))
      }
    }
  },
  created () {
    if (localStorage.getItem('readFirst') !== null) {
      this.dialogVisibleUse = false
    }
    this.order = Number(this.order)
    this.setVisible()
    // 获取默认的标签页
    if (this.tagsList.length === 0) {
      getUsualTags().then((res) => {
        if (res.code === 200) {
          this.tagsList = res.data
          localStorage.setItem('tags', JSON.stringify(this.tagsList))
        }
      })
    }
  }
}
</script>
<style lang="less">
div {
  outline: none;
}
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
      .el-input__inner {
        height: 3.4vw;
        font-size: 1.2vw;
      }
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
      align-content: flex-start;
      &__one {
        width: 23%;
        height: 14vh;
        margin-top: 2vw;
        box-sizing: border-box;
        img {
          cursor: pointer;
          width: 14vh;
          height: 14vh;
          display: block;
          border-radius: 8px 0 0 8px;
          float: left;
        }
        &-info {
          width:100%;
          cursor: pointer;
          background: #fff;
          border-radius: 0 8px 8px 0;
          box-sizing: border-box;
          padding: 3% 3% 3% 3%;
          overflow: hidden;
          text-overflow: ellipsis;
          &__name {
            font-size: 1.2vw;
            color: #303133;
            box-sizing: border-box;
          }
          &__msg {
            margin-top: 0.5vw;
            box-sizing: border-box;
            font-size: 1vw;
            line-height: 1.2vw;
            color: #909399;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
      &__one:hover {
        border-radius: 8px;
        box-shadow: 0 0 15px 0 #409eff;
      }
      &__add {
        width: 23%;
        height: 14vh;
        color: #fff;
        font-size: 4vw;
        line-height: 14vh;
        box-sizing: border-box;
        border-radius: 8px;
        text-align: center;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        margin-top: 2vw;
      }
      &__add:hover {
        background: rgba(255, 255, 255, 0.8);
        color: #409eff;
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
      align-content: flex-start;
      &__one {
        cursor: pointer;
        width: 12vw;
        height: 12vw;
        text-align: center;
        img {
          width: 50%;
          height: 50%;
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
          margin-top: 1vw;
          font-weight: bold;
        }
      }
      .addDiv {
        cursor: pointer;
        width: 12vw;
        height: 12vw;
        margin-top: 1vw;
        text-align: center;
      }
      &__add {
        width: 6vw;
        height: 6vw;
        color: #fff;
        font-size: 4vw;
        line-height: 6vw;
        box-sizing: border-box;
        border-radius: 10px;
        text-align: center;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        margin-left: 3vw;
      }
      &__add:hover {
        background: rgba(255, 255, 255, 0.8);
        color: #409eff;
      }
      &__more {
        width: 12vw;
        height: 12vw;
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
          align-content: flex-start;
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
          align-content: flex-start;
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
  }
  &__dialog {
    height: 65vh;
    &-list::-webkit-scrollbar {
      display: none;
    }
    &-list {
      height: 50vh;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: flex-start;
      overflow-y: scroll;
      padding: 8px;
      &__one:hover {
        border-radius: 5px;
        box-shadow: 0 0 15px 0 #409eff;
      }
      &__one {
        width: 40%;
        height: 10vh;
        margin-top: 1vw;
        display: flex;
        flex-direction: row;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        img {
          cursor: pointer;
          width: 10vh;
          height: 10vh;
          border-radius: 5px 0 0 5px;
        }
        &-info {
          cursor: pointer;
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
            margin-top: 0.4vw;
            font-size: 0.6vw;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
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
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-input-group__append,
.el-input-group__prepend {
  background: #f2f6fc;
  color: #409eff;
  // font-weight: bold;
}
.el-drawer__open .el-drawer.rtl {
  // 去掉弹出层点击时产生的黑色border
  outline: none;
}
.el-popover {
  padding: 0;
}
.el-popper[x-placement^="bottom"] {
  margin-top: -10px;
}
.el-popper[x-placement^="top"] {
  margin-bottom: -10px;
}
.popper {
  text-align: center;
  /deep/ .el-divider--horizontal {
    margin: 0;
  }
}
.el-tabs__item {
  height: 2vw;
  line-height: 2vw;
}
.el-form-item__label {
  line-height: 10px;
}
.el-select-dropdown__list {
  font-family: "微软雅黑";
}
</style>
