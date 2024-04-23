<template>
  <div :id="dialogId" class="ddei-core-dialog-relogin" v-if="forceRefresh">
    <div class="content">
      <div class="header">
        <svg class="icon warn" aria-hidden="true">
          <use :xlink:href="icon"></use>
        </svg>
        <span class="msg">
        </span>
        <div style="flex:1"></div>
        <svg class="icon close" aria-hidden="true" @click="abort">
          <use xlink:href="#icon-a-ziyuan422"></use>
        </svg>
      </div>
      <form>
        <div class="content-right-login-form">
          <div class="content_right_form_msg">
            {{ form.validMsg.username }}
          </div>
          <div class="content-right-login-form-title">用户名：</div>
          <input v-model="form.username" ref="usernameinput" class="content-right-login-form_input"
            placeholder="手机号/邮箱/账号" autofocus />
          <div class="content_right_form_msg">
            {{ form.validMsg.password }}
          </div>
          <div class="content-right-login-form-title">密码：</div>
          <input v-model="form.password" class="content-right-login-form_input" placeholder="请输入密码" type="password"
            @keydown.enter="login" autocomplete="on" />

        </div>
        <div class="tail">
          <div class="button button-main" @click="ok">登录</div>
          <div class="button" @click="registry">注册</div>
          <div class="button" @click="abort">取消</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import { login, userinfo } from "../lib/api/login";
import Cookies from "js-cookie";
import {DDeiEditorState} from "ddei-framework";
import DialogBase from "./dialog"
export default {
  name: "ddei-core-dialog-relogin",
  extends: null,
  mixins: [DialogBase],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-relogin',
      icon: null,
      loginMessage: "",
      user: "",
      form: {
        username: "",
        password: "",
        validMsg: {},
      },
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData();
  },
  methods: {

    refreshData(){
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.icon) {
        this.icon = this.editor?.tempDialogData[this.dialogId].icon
      }
      setTimeout(() => {
        this.$refs.usernameinput?.focus()
      }, 100);
      this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
    },

    registry() {
      let callback = this.editor?.tempDialogData[this.dialogId]?.callback;
      DDeiEditorUtil.closeDialog("ddei-core-dialog-relogin");
      setTimeout(() => {
        //弹出登录弹出框
        DDeiEditorUtil.showDialog("ddei-core-dialog-userregistry", {
          icon: "#icon-a-ziyuan413",
          msg: "新用户注册",
          callback: callback,
          background: "white",
          opacity: "1%",
          event: -1
        })
      }, 50);
    },

    ok() {
      this.login()
    },

    abort() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.abort) {
        this.editor.tempDialogData[this.dialogId].callback.abort();
      }
      DDeiEditorUtil.closeDialog("ddei-core-dialog-relogin");
    },

    //登录
    async login() {
      //校验
      this.form.validMsg = {};
      if (!this.form.username) {
        this.form.validMsg.username = "请输入用户名";
      } else {
        let uPattern = /^[a-zA-Z0-9_-]{6,20}$/;
        if (!uPattern.test(this.form.username)) {
          this.form.validMsg.username = "用户名为6至20位数字、字母下划线组合";
        }
      }
      //密码
      if (
        !this.form.password ||
        this.form.password.length < 6 ||
        this.form.password.length > 20
      ) {
        this.form.validMsg.password = "请输入6-20位密码";
      }

      if (JSON.stringify(this.form.validMsg) == "{}") {
        //执行登录
        this.form.validMsg = {};
        let loginData = await login(this.form);
        if (loginData.status == 200) {
          //登录成功
          if (loginData.data?.code == 0) {
            this.loginSuccess(loginData.data.data);
          } else {
            this.form.validMsg = { username: loginData.data.message };
          }
        } else {
          this.form.validMsg = {
            username: "服务端请求失败，请联系管理员",
          };
        }
      }
    },

    loginSuccess(response) {
      // 缓存 token
      Cookies.set('token', response.token)
      Cookies.set('refreshToken', response.refreshToken)
      Cookies.set('tokenExp', response.tokenExp)
      this.getUserInfo().then(user => {
        if (user) {
          let files = this.editor.files;
          let ssLinks = user.sslinks
          //修改文件的owner状态

          files?.forEach(file => {
            if (file.extData?.owner != 1) {
              for (let i = 0; i < ssLinks?.length; i++) {
                if (ssLinks[i].file_id == file.id && ssLinks[i].owner == 1) {
                  file.extData.owner = 1
                  break;
                }
              }
            }
          });

          if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
            this.editor.tempDialogData[this.dialogId].callback.ok();
          }
          DDeiEditorUtil.closeDialog("ddei-core-dialog-relogin");
        }
      })

    },

    /**
     * 获取登录用户信息
     */
    getUserInfo() {
      return new Promise((resolve, rejected) => {
        userinfo()
          .then((response) => {
            let userJSON = response.data.data;
            let user = JSON.stringify(userJSON, null, 4);
            Cookies.set("user", user);
            resolve(userJSON)

          })
          .catch((e) => {
            Cookies.remove("token");
            rejected()
          });
      })

    },
  }
};
</script>

<style lang="less" scoped>
/**以下为询问框的样式 */
.ddei-core-dialog-relogin {
  width: 420px;
  height: 210px;
  background: var(--panel-background);
  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 12px;
  display: none;
  position: absolute;
  overflow: hidden;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .content {
    width: 420px;
    height: 210px;
    display: flex;
    flex-direction: column;
    padding: 0 24px;

    .header {
      flex: 0 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 400;
      margin-top: 10px;
      color: var(--panel-title);

      >span {
        margin: 0 2px;
      }


      .close {
        font-size: 22px;
      }

      .warn {
        font-size: 20px !important;
      }
    }


    .content-right-login-form {
      width: 90%;
      height: 120px;
      background: var(--panel-background);
      border-radius: 10px;
      text-align: center;
    }

    .content-right-login-form-title {
      width: 100px;
      height: 30px;
      font-size: 18px;
      float: left;
      text-align: right;
      color: var(--panel-title);
    }

    .content-right-login-form_input {
      width: 70%;
      height: 30px;
      font-size: 18px;
      background-color: var(--panel-background);
      color: var(--panel-title);
      float: left;
    }

    .content_right_form_msg {
      width: 90%;
      height: 24px;
      font-size: 16px;
      color: red;
      text-align: right;
      margin-left: 36px;
      float: left;
    }

    .content-right-login-form_login {
      width: 45%;
      height: 50px;
      background-color: var(--dot);
      border-color: var(--dot);;
      cursor: pointer;
      border-radius: 2px;
      text-align: center;
      float: left;
      padding-top: 15px;
    }

    .content-right-login-form_register {
      width: 45%;
      height: 50px;
      background-color: var(--panel-background);
      border-color: var(--panel-border);
      cursor: pointer;
      border-radius: 2px;
      text-align: center;
      float: right;
      padding-top: 15px;
    }

    .content-right-login-form_register span {
      font-size: 19px;
      color: var(--panel-title);
      text-align: center;
      pointer-events: none;
    }

    .content-right-login-form_login span {
      font-size: 19px;
      color: var(--panel-title);
      text-align: center;
      pointer-events: none;
    }


    .tail {
      flex: 0 0 65px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: end;
    }

    .button {
      flex: 0 0 80px;
      height: 36px;
      background: var(--panel-header);
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      font-size: 17px;
      font-weight: 400;
      color: var(--panel-title);
      margin-left: 13px;
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .button:hover {
      color: white;
      background: var(--dot);
      cursor: pointer;
    }

    .button-main {
      color: white;
      background: var(--dot);

    }
  }
}
</style>
