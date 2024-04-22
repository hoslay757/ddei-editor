<template>
  <div class="login">
    <form>
      <img src="../assets/images/login-back.jpg" class="bgimg" />
      <div class="banquan">
        <a href="https://beian.miit.gov.cn/">渝ICP备2024020863号</a>
        <img src="../assets/images/gaba.png" />
        <a href="https://beian.mps.gov.cn/#/query/webSearch?code=50011302222098" rel="noreferrer"
          target="_blank">渝公网安备50011302222098</a>
      </div>
      <div class="content">
        <div class="content_right_login_form" v-show="!regDialogShow">
          <div class="content_right_login_form_title">欢迎来到DDei</div>
          <div class="content_right_login_form_title_split"></div>
          <div class="content_right_form_msg">
            {{ form.validMsg.username }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan413"></use>
            </svg>
            <div class="split"></div>
            <input v-model="form.username" placeholder="手机号/邮箱/账号" autofocus />
          </div>
          <div class="content_right_form_msg">
            {{ form.validMsg.password }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan415"></use>
            </svg>
            <div class="split"></div>
            <input v-model="form.password" placeholder="请输入密码" type="password" @keydown.enter="login" />
          </div>
          <div class="content_right_login_form_chkbox" @click="changeRememberPwd()"
            style="user-select: none;cursor:pointer">
            <input type="checkbox" v-model="rememberPwd" style="pointer-event:none" />记住密码
          </div>
          <div class="content_right_login_form_login" @click="login">
            <span>登录</span>
          </div>
          <div class="regbtn" @click="gotoReg">
            <span>注册</span>
          </div>
        </div>
        <div class="content_right_login_form reg_form" v-show="regDialogShow">
          <div class="content_right_login_form_title">新用户注册</div>
          <div class="content_right_login_form_title_split"></div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.mobile }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan412"></use>
            </svg>
            <div class="split"></div>
            <input v-model="reg.mobile" id="reg_input_id" type="mobile" class="content_right_reg_form_input"
              placeholder="手机号" />
            <span class="content_right_reg_form_input_required">*</span>
          </div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.username }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan413"></use>
            </svg>
            <div class="split"></div>
            <input v-model="reg.username" class="content_right_reg_form_input" placeholder="用户名,4-20位中文、英文、数字、下划线" />
            <span class="content_right_reg_form_input_required">*</span>
          </div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.email }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-youjian-01-01"></use>
            </svg>
            <div class="split"></div>
            <input v-model="reg.email" class="content_right_reg_form_input" placeholder="邮箱地址" type="email" />
          </div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.password }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan415"></use>
            </svg>
            <div class="split"></div>
            <input v-model="reg.password" type="password" autocomplete="on" class="content_right_reg_form_input"
              placeholder="密码" />
            <span class="content_right_reg_form_input_required">*</span>
          </div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.password1 }}
          </div>
          <div class="content_right_login_form_input">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-a-ziyuan414"></use>
            </svg>
            <div class="split"></div>
            <input v-model="reg.password1" type="password" autocomplete="on" class="content_right_reg_form_input"
              placeholder="确认密码" />
            <span class="content_right_reg_form_input_required">*</span>
          </div>

          <div class="content_right_login_form_login" @click="userRegister">
            <span>注册并登录</span>
          </div>
          <div class="regbtn" @click="gotoLogin">
            <span>登录</span>
          </div>
        </div>
      </div>


      <div class="register_dialog" v-show="false && regDialogShow">
        <div class="register_dialog_layer" />
        <div class="register_dialog_content">
          <div class="content_right_reg_form_title">
            新用户注册
          </div>
          <div class="content_right_form_msg">
            {{ reg.validMsg.mobile }}
          </div>

          <input v-model="reg.mobile" id="reg_input_id" type="mobile" class="content_right_reg_form_input"
            placeholder="手机号" />
          <span class="content_right_reg_form_input_required">*</span>
          <div class="content_right_form_msg">
            {{ reg.validMsg.username }}
          </div>
          <input v-model="reg.username" class="content_right_reg_form_input" placeholder="用户名,4-20位中文、英文、数字、下划线" />
          <span class="content_right_reg_form_input_required">*</span>
          <div class="content_right_form_msg">
            {{ reg.validMsg.email }}
          </div>
          <input v-model="reg.email" class="content_right_reg_form_input" placeholder="邮箱地址" type="email" />
          <div class="content_right_form_msg">
            {{ reg.validMsg.password }}
          </div>
          <input v-model="reg.password" type="password" autocomplete="on" class="content_right_reg_form_input"
            placeholder="密码" />
          <span class="content_right_reg_form_input_required">*</span>
          <div class="content_right_form_msg">
            {{ reg.validMsg.password1 }}
          </div>
          <input v-model="reg.password1" type="password" class="content_right_reg_form_input" placeholder="确认密码" />
          <span class="content_right_reg_form_input_required">*</span>
          <div class="content_right_login_form_buttons">
            <div class="content_right_login_form_login" style="margin-top:20px;" @click="userRegister">
              <span>注册并登录</span>
            </div>
            <div class="content_right_login_form_register" style="margin-top:20px;" @click="showRegDialog">
              <span>取消</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { login, userinfo, register } from "@/lib/api/login";
import Cookies from "js-cookie";

export default {
  props: {},
  data() {
    return {
      loginMessage: "",
      user: "",
      form: {
        username: "",
        password: "",
        validMsg: {},
      },
      reg: {
        username: "",
        email: "",
        mobile: "",
        password: "",
        password1: "",
        validMsg: {},
      },
      rememberPwd: false,
      regDialogShow: false,
    };
  },
  mounted() {
    let remUserName = Cookies.get("remUserName");
    let remPassword = Cookies.get("remPassword");
    if (remUserName && remPassword) {
      this.rememberPwd = true
      this.form.username = remUserName;
      this.form.password = remPassword;
    }
    this.getUserInfo();
  },
  methods: {

    changeRememberPwd() {
      this.rememberPwd = !this.rememberPwd
    },

    gotoReg() {
      this.regDialogShow = true;
      this.reg.username = "";
      this.reg.email = "";
      this.reg.mobile = "";
      this.reg.password = "";
      this.reg.password1 = "";
      this.reg.validMsg = {};
      if (this.regDialogShow) {
        setTimeout(() => {
          document.getElementById("reg_input_id").focus();
        }, 20);
      }
    },

    gotoLogin() {
      this.regDialogShow = false;

    },

    //注册并登录
    async userRegister() {
      //校验
      this.reg.validMsg = {};
      if (!this.reg.username) {
        this.reg.validMsg.username = "请输入用户名";
      } else {
        let uPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,20}$/;
        if (!uPattern.test(this.reg.username)) {
          this.reg.validMsg.username = "用户名为4至20位,请勿输入特殊字符";
        }
      }
      if (!this.reg.mobile) {
        this.reg.validMsg.mobile = "请输入手机号码";
      } else {
        let mPattern =
          /^1([3-9])\d{9}$/
        if (!mPattern.test(this.reg.mobile)) {
          this.reg.validMsg.mobile = "请输入正确的手机号码";
        }
      }
      if (this.reg.email) {
        let ePattern =
          /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!ePattern.test(this.reg.email)) {
          this.reg.validMsg.email = "请输入正确的邮箱地址";
        }
      }

      if (
        !this.reg.password ||
        this.reg.password.length < 6 ||
        this.reg.password.length > 20
      ) {
        this.reg.validMsg.password = "请输入6-20位密码";
      } else if (this.reg.password != this.reg.password1) {
        this.reg.validMsg.password1 = "前后输入的密码不一致";
      }
      if (JSON.stringify(this.reg.validMsg) == "{}") {
        //执行注册并登录
        this.reg.validMsg = {};
        let regData = await register(this.reg);
        if (regData.status == 200) {
          //注册成功
          if (regData.data?.code == 0) {
            this.regDialogShow = false;
            this.loginSuccess(regData.data.data);
          } else {
            this.reg.validMsg = { mobile: regData.data.message };
          }
        } else {
          this.reg.validMsg = { mobile: "服务端请求失败，请联系管理员" };
        }
      }
    },

    //登录
    async login() {
      //校验
      this.form.validMsg = {};
      if (!this.form.username) {
        this.form.validMsg.username = "请输入用户名";
      } else {
        let uPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,20}$/;
        if (!uPattern.test(this.form.username)) {
          this.reg.validMsg.username = "用户名为4至20位,请勿输入特殊字符";
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
      this.getUserInfo();
    },

    /**
     * 获取登录用户信息
     */
    getUserInfo() {
      userinfo()
        .then((response) => {
          let userJSON = response.data.data;
          let user = JSON.stringify(userJSON, null, 4);
          Cookies.set("user", user);
          //记住密码
          if (this.rememberPwd) {
            Cookies.set("remUserName", this.form.username);
            Cookies.set("remPassword", this.form.password);
          }
          this.$router.push({
            path: this.$route.query.redirect || "/",
          });
        })
        .catch((e) => {
          Cookies.remove("token");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: calc(100vh);
}

.content {
  width: 100%;
  height: calc(100vh);
  background: url("../assets/images/login-back.jpg");
  background-size: 100% 100%;

}

.bgimg {
  width: 100%;
  height: calc(100vh);
  z-index: 99;
  left: 0px;
  top: 0px;
  position: absolute;
}

.banquan {
  width: 100%;
  z-index: 99;
  left: 0px;
  bottom: 45px;
  text-align: center;
  position: absolute;
  height: 14px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  display: flex;
  justify-content: center;
  align-items: center;

  >a {
    text-decoration: none;
    color: black;
  }

  >img {
    width: 18px;
    height: 18px;
    margin-left: 20px;
  }
}

.content_right_login_form {
  width: 440px;
  height: 500px;
  display: flex;
  flex-direction: column;
  background: #fff;
  text-align: center;
  box-shadow: 0px 0px 35px 0px rgba(34, 115, 191, 0.16);
  border-radius: 10px;
  overflow: hidden;
  position: absolute;
  right: 363px;
  top: 210px;
  z-index: 990;

  .regbtn {
    position: absolute;
    -webkit-font-smoothing: antialiased;
    background-color: #176EFF;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    right: -60px;
    top: -60px;
    width: 120px;
    height: 120px;
    user-select: none;

    cursor: pointer;

    >span {
      font-size: 21px;
      line-height: 21px;
      position: absolute;
      font-weight: bold;
      -webkit-font-smoothing: antialiased;
      color: #fff;
      right: 38px;
      bottom: 11px;
    }
  }
}

.reg_form {
  height: 650px;
  top: 150px;

  .content_right_login_form_login {
    margin-top: 25px;
  }
}



.content_right_login_form_title {
  margin-top: 66px;
  text-align: center;
  flex: 0 0 38px;
  font-size: 24px;
  font-family: "Microsoft YaHei";
  font-weight: bold;
  color: #434343;
}

.content_right_login_form_title_split {
  margin: 3px auto 25px auto;
  width: 40px;
  flex: 0 0 4px;
  background-color: #176EFF;
  border-radius: 4px;
}

.content_right_login_form_input {
  margin: 0px auto 0px auto;
  width: 300px;
  flex: 0 0 52px;
  background: #F2F4F9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;

  .split {
    height: 26px;
    flex: 0 0 1px;
    margin-left: 18px;
    background: #D6DAE7;
  }

  .icon {
    flex: 0 0 22px;
    margin-left: 18px;
    color: #a4b3d0;
  }

  >input {
    margin-left: 18px;
    flex: 1 1 92px;
    height: 26px;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    border: none;
    outline: none;
    background: none;

    &::placeholder {
      /* Chrome, Firefox, Opera, Safari 10.1+ */
      color: #9CA4AF;
    }

    &::-webkit-input-placeholder {
      /* WebKit browsers，webkit内核浏览器 */
      color: #9CA4AF
    }

    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #9CA4AF
    }

    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #9CA4AF
    }

    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #9CA4AF
    }

    &::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #9CA4AF
    }

  }

  >span {
    flex: 0 0 20px;
    text-align: center;
  }
}

.content_right_login_form_chkbox {
  margin: 19px auto 35px auto;
  width: 300px;
  flex: 0 0 15px;
  color: black;
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 14px;

  >* {
    margin-right: 10px;
  }
}

.content_right_form_msg {
  width: 300px;
  flex: 0 0 23px;
  font-size: 14px;
  color: red;
  text-align: right;
  margin: 0 auto;
}

.content_right_login_form_login {
  margin: 0 auto;
  width: 300px;
  flex: 0 0 52px;
  background: #176EFF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.content_right_login_form_login span {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #FFFFFF;
}

/**
 * 注册弹框
 */
.register_dialog {
  z-index: 99;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: calc(100vh);
}

.register_dialog_layer {
  width: 100%;
  height: calc(100vh);
  background-color: black;
  opacity: 90%;
}

.register_dialog_content {
  position: absolute;
  width: 390px;
  height: 460px;
  left: calc(50% - 195px);
  top: calc(50% - 225px);
  background: #fff;
  margin-right: 139px;
  border-radius: 10px;
}

.content_right_reg_form_input_required {
  font-size: 19px;
  color: red;
  text-align: center;
  pointer-events: none;
}

.content_right_reg_form_title {
  width: 80%;
  height: 40px;
  font-size: 20px;
  color: #3662ec;
  text-align: center;
  margin-left: 36px;
  margin-top: 25px;
}

.content_right_reg_form_input {
  width: 80%;
  height: 40px;
  font-size: 14px;
  margin-left: 40px;
}
</style>
