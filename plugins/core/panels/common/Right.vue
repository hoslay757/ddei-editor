<template>
  <div class="ddei-core-panel-right">
    <div class="header">
      <div class="h1"></div>
      <div class="h3" @click="changeTheme">换肤</div>
      <div class="userinfo" v-show="user?.id != '-99'">{{ userNameFirst }}</div>
      <div class="h4"></div>
      <div class="loginout" v-show="user && user.id != '-99'" @click="loginout">注销</div>
      <div class="registry" v-show="user?.id == '-99'" @click="registry">注册</div>
      <div class="login" v-show="user?.id == '-99' || !user" @click="login">登录</div>
      <div class="h5"></div>
    </div>
    <div class="content">
    </div>
    <div class="tail">
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import Cookies from 'js-cookie'
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";
import {DDeiEditorState} from 'ddei-framework1';
export default {
  name: "ddei-core-panel-right",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      file: {},
      fileNameEditing: false,
      fileDescEditing: false,
      userNameFirst: 'U',
      user: null
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.file = this.editor?.files[this.editor?.currentFileIndex];
    try {
      let userCookie = Cookies.get('user')
      // 初始化用户信息
      if (userCookie) {
        let user = JSON.parse(userCookie)
        if (user.name) {
          this.userNameFirst = user.name.charAt(0).toUpperCase();
        }
        this.user = user
      }
    } catch (e) { }
  },
  methods: {

    changeTheme(){
      if(this.themeIndex >= this.editor.themes.length-1){
        this.themeIndex =0
      } else if (!this.themeIndex && this.themeIndex != 0){
        let themeName = localStorage.getItem("ddei-theme-" + this.editor.id);
        if (themeName){
          for(let i = 0;i < this.editor.themes.length;i++){
            
            if (this.editor.themes[i].name == themeName){
              this.themeIndex = i;
              this.themeIndex++;
              break;
            }
          }
        }
        if (!this.themeIndex || this.themeIndex >= this.editor.themes.length){
          this.themeIndex = 0
        }

      }else{
        this.themeIndex++
      }
      this.editor.changeTheme(this.editor.themes[this.themeIndex].name)
      this.editor.changeState(DDeiEditorState.DESIGNING);
    },

    refreshEditor() {
      this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts);
      this.editor.bus.executeAll()
    },

    registry() {
      //弹出登录弹出框
      DDeiEditorUtil.showDialog("ddei-core-dialog-userregistry", {
        icon: "#icon-a-ziyuan413",
        msg: "新用户注册",
        callback: {
          ok: this.refreshEditor
        },
        background: "white",
        opacity: "1%",
        event: -1
      })
    },

    login() {
      //弹出登录弹出框
      DDeiEditorUtil.showDialog("ddei-core-dialog-relogin", {
        icon: "#icon-a-ziyuan413",
        msg: '用户登录',
        callback: {
          ok: this.refreshEditor
        },
        background: "white",
        opacity: "1%",
        event: -1
      })
    },
    loginout() {
      Cookies.remove('token')
      Cookies.remove('user')

      this.refreshEditor()



      // this.editor.files = files
    },

    goBackFileList() {
      //调用SPI进行保存
      let goBackFileList = DDeiEditorUtil.getConfigValue(
        "EVENT_GOBACK_FILE_LIST",
        this.editor
      );
      if (goBackFileList) {
        goBackFileList();
      }
    },

  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-right {
  height: 103px;
  flex:1;
  display: grid;
  grid-template-rows: 50px 23px 23px;
  grid-template-columns: 1fr;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;

    .h1 {
      flex: 1;
    }

    .h2 {
      flex: 0 0 21px;
      font-size: 22px;
      cursor: pointer;
    }

    .h3 {
      flex: 0 1 50px;
      cursor: pointer;
      
      color:var(--panel-title);
    }

    .h4 {
      flex: 0 1 12px
    }

    .h5 {
      flex: 0 1 42px
    }

    .userinfo {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 28px;
      height: 28px;
      background: var(--dot);
      border-radius: 50%;
      text-align: center;
      flex: 0 0 28px;
      font-size: 16px;
      font-weight: 400;
      color: white;
      cursor: pointer;
    }

    .loginout {
      display: flex;
      white-space: nowrap;
      justify-content: center;
      align-items: center;
      flex: 0 1 28px;
      height: 14px;
      font-size: 16px;
      font-weight: 400;
      color: var(--panel-title);
      cursor: pointer;
    }

    .loginout:hover {
      text-decoration: underline;
    }


    .registry {
      display: flex;
      white-space: nowrap;
      justify-content: center;
      align-items: center;
      flex: 0 1 28px;
      height: 14px;
      font-size: 16px;
      font-weight: 400;
      color: var(--panel-title);
      cursor: pointer;
      margin-right: 10px;
    }

    .registry:hover {
      text-decoration: underline;
    }


    .login {
      display: flex;
      white-space: nowrap;
      justify-content: center;
      align-items: center;
      flex: 0 1 28px;
      height: 14px;
      font-size: 16px;
      font-weight: 400;
      color: var(--panel-title);
      cursor: pointer;
    }

    .login:hover {
      text-decoration: underline;
    }
  }
}
</style>
