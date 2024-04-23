<template>
  <div class="ddei-core-panel-goback">
    <div class="header"></div>
    <div class="content">
      <div class="goback">
        <div class="out">
          <svg class="icon" aria-hidden="true" @click="goBackFileList">
            <use xlink:href="#icon-a-ziyuan476"></use>
          </svg>
        </div>
      </div>
      <div class="logo">
        <img :src="icons['logo']">
      </div>
    </div>
    <div class="tail">
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";

export default {
  name: "ddei-core-panel-goback",
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
      icons: DDeiEditorUtil.ICONS
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.file = this.editor?.files[this.editor?.currentFileIndex];
  },
  methods: {
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
.ddei-core-panel-goback {
  height: 103px;
  width: 120px;
  flex:0 1 120px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

    .goback {
      flex: 0 1 36px;
      display: flex;
      justify-content: center;
      align-items: center;

      .out {
        flex: 0 0 25px;
        height: 36px;
        background: var(--panel-header);//darken(var(--panel-header), 5%);
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;

        >svg:hover {
          color:var(--panel-title)-hover;
          cursor: pointer;
        }
      }


    }

    .logo {
      flex: 0 1 75px;
      display: flex;
      justify-content: center;
      align-items: center;

      >img {
        width: 65px;
        height: 65px;
      }
    }
  }

  .tail {
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
