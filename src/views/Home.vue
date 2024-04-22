<template>
  <div class="ddei_home">
    <div class="ddei_home_header">
      <Headers />
    </div>
    <div class="ddei_home_middle">
      <div class="ddei_home_middle_left">
        <DirTree ref="dirTree" />
      </div>
      <div class="ddei_home_middle_right">
        <FileList ref="fileList" @create-folder="onCreateFolder" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { userinfo } from "@/lib/api/login/index.js";
import Cookies from "js-cookie";
import Headers from "./components/Header.vue";
import FileList from "./components/FileList.vue";
import HomeBar from "./components/HomeBar.vue";
import DirTree from "./components/DirTree.vue";

export default {
  props: {},
  data() {
    return {
      refreshFileList: true,
    };
  },
  //注册组件
  components: {
    Headers,
    FileList,
    HomeBar,
    DirTree,
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    forceRefreshFileList() {
      this.$refs.fileList?.listFile(1)
    },

    /**
     * 获取登录用户信息
     */
    getUserInfo() {
      userinfo()
        .then((response) => {
          let userJSON = response.data.data;
          let user = JSON.stringify(userJSON, null, 4);
          if (userJSON.id == "-99") {
            Cookies.remove("token");
            this.$router.push({
              path: this.$route.query.redirect || "/login",
            });
          }
          Cookies.set("user", user);
        })
        .catch((e) => {
          Cookies.remove("token");
          this.$router.push({
            path: this.$route.query.redirect || "/login",
          });
        });
    },

    onCreateFolder() {
      this.$refs.dirTree?.createFolder()
    }
  },
};
</script>
<style lang="less" scoped>
.ddei_home {
  width: 100%;
  height: calc(100vh);
  background: white;
  display: flex;
  flex-direction: column;
}

.ddei_home_header {
  // flex: 0 0 48px;
}

.ddei_home_bar {
  flex: 0 0 48px;
  // background: #2c2c2c;
}

.ddei_home_middle {
  flex: 1;
  // background: #2c2c2c;
  display: flex;
}

.ddei_home_middle_left {
  // flex: 0 0 300px;
  width: 280px;
  padding-left: 10px;

}

.ddei_home_middle_right {
  flex: 1;
  display: flex;
}
</style>
