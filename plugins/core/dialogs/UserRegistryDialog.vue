<template>
  <div :id="dialogId" class="ddei-core-dialog-userregistry" v-if="forceRefresh">
    <form>
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

        <div class="content-right-login-form">
          <div class="content-right-form-msg">
            {{ form.validMsg.mobile }}
          </div>
          <div class="content-right-reg-form-input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan412"></use>
            </svg>

            <input v-model="form.mobile" ref="reg_input_id" type="mobile" class="content-right-reg-form-input"
              placeholder="手机号" />
            <span class="content-right-reg-form-input-required">*</span>
          </div>
          <div class="content-right-form-msg">
            {{ form.validMsg.username }}
          </div>
          <div class="content-right-reg-form-input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan413"></use>
            </svg>

            <input v-model="form.username" class="content-right-reg-form-input" placeholder="用户名,4-20位中文、英文、数字、下划线" />
            <span class="content-right-reg-form-input-required">*</span>
          </div>
          <div class="content-right-form-msg">
            {{ form.validMsg.email }}
          </div>
          <div class="content-right-reg-form-input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-youjian-01-01"></use>
            </svg>

            <input v-model="form.email" class="content-right-reg-form-input" placeholder="邮箱地址" type="email" />
          </div>
          <div class="content-right-form-msg">
            {{ form.validMsg.password }}
          </div>
          <div class="content-right-reg-form-input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan415"></use>
            </svg>

            <input v-model="form.password" type="password" autocomplete="on" class="content-right-reg-form-input"
              placeholder="密码" />
            <span class="content-right-reg-form-input-required">*</span>
          </div>
          <div class="content-right-form-msg">
            {{ form.validMsg.password1 }}
          </div>
          <div class="content-right-reg-form-input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan414"></use>
            </svg>

            <input v-model="form.password1" type="password" autocomplete="on" class="content-right-reg-form-input"
              placeholder="确认密码" />
            <span class="content-right-reg-form-input-required">*</span>
          </div>

        </div>
        <div class="tail">
          <div class="button button-main" @click="ok">注册</div>
          <div class="button" @click="abort">取消</div>
        </div>

      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import { register, userinfo } from "@/lib/api/login";
import Cookies from "js-cookie";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-userregistry",
  extends: null,
  mixins: [DialogBase],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-userregistry',
      icon: null,
      loginMessage: "",
      user: "",
      form: {
        mobile: "",
        username: "",
        email: "",
        password: "",
        password1: "",
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
      if (this.$refs.reg_input_id) {
        setTimeout(() => {
          this.$refs.reg_input_id.focus()
        }, 100);
      }
    },

    ok() {
      this.registry()
    },

    abort() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.abort) {
        this.editor.tempDialogData[this.dialogId].callback.abort();
      }
      DDeiEditorUtil.closeDialog('ddei-core-dialog-userregistry');
    },

    //注册并登录
    async registry() {
      //校验
      this.form.validMsg = {};
      if (!this.form.username) {
        this.form.validMsg.username = "请输入用户名";
      } else {
        let uPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,20}$/;
        if (!uPattern.test(this.form.username)) {
          this.form.validMsg.username = "用户名为4至20位,请勿输入特殊字符";
        }
      }
      if (!this.form.mobile) {
        this.form.validMsg.mobile = "请输入手机号码";
      } else {
        let mPattern =
          /^1([3-9])\d{9}$/
        if (!mPattern.test(this.form.mobile)) {
          this.form.validMsg.mobile = "请输入正确的手机号码";
        }
      }
      if (this.form.email) {
        let ePattern =
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!ePattern.test(this.form.email)) {
          this.form.validMsg.email = "请输入正确的邮箱地址";
        }
      }

      if (
        !this.form.password ||
        this.form.password.length < 6 ||
        this.form.password.length > 20
      ) {
        this.form.validMsg.password = "请输入6-20位密码";
      } else if (this.form.password != this.form.password1) {
        this.form.validMsg.password1 = "前后输入的密码不一致";
      }
      if (JSON.stringify(this.form.validMsg) == "{}") {
        //执行注册并登录
        this.form.validMsg = {};
        let regData = await register(this.form);
        if (regData.status == 200) {
          //登录成功
          if (regData.data?.code == 0) {
            this.loginSuccess(regData.data.data);
          } else {
            this.form.validMsg = { username: regData.data.message };
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
          DDeiEditorUtil.closeDialog('ddei-core-dialog-userregistry');
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
.ddei-core-dialog-userregistry {
  width: 320px;
  height: 380px;
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
    width: 320px;
    height: 380px;
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
      height: 300px;
      background: var(--panel-background);
      border-radius: 10px;
      text-align: center;
    }

    .content-right-reg-form-input {

      height: 30px;
      font-size: 18px;
      float: left;
      display: flex;
      justify-content: start;
      align-items: center;
      background: var(--panel-background);
      .icon {
        flex: 0 0 30px;
      }

      >input {
        flex: 0 0 220px;
        background: transparent;
        border:0.5px solid var(--panel-border);
        color:var(--panel-title);
      }

      >span {
        flex: 0 0 10px;
        color: red;
      }

    }

    .content-right-form-msg {
      width: 90%;
      height: 24px;
      font-size: 16px;
      color: red;
      text-align: right;
      margin-left: 36px;
      float: left;
      padding-right: 30px;
    }

    .content-right-login-form-login {
      width: 45%;
      height: 50px;
      background-color: var(--dot);
      border-color: var(--dot);
      cursor: pointer;
      border-radius: 2px;
      text-align: center;
      float: left;
      padding-top: 15px;
    }

    .content-right-login-form-register {
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

    .content-right-login-form-register span {
      font-size: 19px;
      color: var(--panel-title);
      text-align: center;
      pointer-events: none;
    }

    .content-right-login-form-login span {
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
