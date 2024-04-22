<template>
  <div class="header">
    <div class="header-logo" @click="handleLogoClick">
      <img class="header-logo-icon" src="@/assets/images/logo.png" />
      <span class="header-title">{{ title + (version ? ' - V' + version : '') }}</span>
    </div>
    <div class="header-center">
      <SearchInput></SearchInput>
    </div>
    <div class="header-right">
      <div class="header-right-avator">
        <img v-if="form.avator" :src="form.avator" class="header-right-avator-img" />
        <div v-else class="header-right-avator-img header-right-avator-text">{{ form.username.substring(0, 1) }}</div>
      </div>
      <div class="header-right-username">{{ form.username }}</div>
      <div class="header-right-loginout" @click="loginout">注销</div>
    </div>
  </div>
</template>

<script lang="ts">
import Cookies from 'js-cookie'
import SearchInput from './SearchInput.vue'

export default {
  name: 'Header',
  components: {
    SearchInput
  },
  props: {
    title: { type: String, default: "DDei-在线设计器" },
    version: { type: String, default: "1.0.4" }
  },
  data() {
    return {
      form: {
        username: '',
        rolename: ''
      }
    }
  },
  created() { },
  mounted() {
    let userCookie = Cookies.get('user')
    // 初始化用户信息
    if (userCookie) {
      let user = JSON.parse(userCookie)
      this.form.username = user.name
    }
  },
  methods: {
    handleLogoClick() {
      this.$router.push('/')
    },
    loginout() {
      Cookies.remove('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #DDDDDF;
  color: black;
}

.header-logo {
  margin-left: 20px;
  display: flex;
  align-items: center;
  text-align: left;
  cursor: pointer;
  line-height: 0px;
  min-width: 260px;
}

.header-title {
  font-size: 16px;

}

.header-logo-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: sub;
}

.header-center {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  padding-right: 20px;
}

.header-right-avator {
  width: 32px;
  height: 32px;
}

.header-right-avator-img {
  width: 100%;
  height: 100%;
  background: #176EFF;
  border-radius: 50%;
}

.header-right-avator-text {
  color: #fff;
  font-size: 28px;
  line-height: 28px;
  text-align: center;
}

.header-right-username {
  font-size: 16px;
  margin-left: 10px;
}

.header-right-loginout {
  margin-left: 10px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #3662ec;
  }
}
</style>