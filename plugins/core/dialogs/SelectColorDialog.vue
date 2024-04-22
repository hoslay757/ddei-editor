<template>
  <div :id="dialogId" class="ddei-core-dialog-selectcolor" v-if="forceRefresh">
    <div class="content">
      <div class="group">
        <div class="title">最近使用的颜色</div>
        <div class="group_content color1">
          <div :class="{ 'item': true, 'item-selected': color == value }" v-for="color in ds1"
            @click="selectColor($event)" :style="{ 'background': color }" @dblclick="selectConfirmColor($event)">
          </div>
        </div>
      </div>
      <div class="group">
        <div class="group_content color2">
          <div :class="{ 'item': true, 'item-selected': color == value }" v-for="color in ds2"
            @click="selectColor($event)" :style="{ 'background': color }" @dblclick="selectConfirmColor($event)">
          </div>
        </div>
      </div>
      <div class="group">
        <div class="title">标准颜色</div>
        <div class="group_content color1">
          <div :class="{ 'item': true, 'item-selected': color == value }" v-for="color in ds3"
            @click="selectColor($event)" :style="{ 'background': color }" @dblclick="selectConfirmColor($event)">
          </div>
        </div>
      </div>
      <div class="group">
        <div class="title">已选颜色</div>
        <div class=".group_content color3">
          <input type="color" v-model="value" class="colorinput" autocomplete="off">
          <input type="text" v-model="value" autocomplete="off">
          <div class="button button-small" @click="clear">清空</div>
        </div>
      </div>
      <div class="tail">
        <div class="button button-main" @click="ok">确定</div>
        <div class="button" @click="cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-selectcolor",
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
      dialogId: 'ddei-core-dialog-selectcolor',
      dataSource: null,
      value: "#000000",
      //最近使用的颜色
      ds1: [
        DDeiUtil.rgb2hex("rgb(255,255,255)"),
        "#000000",
        DDeiUtil.rgb2hex("rgb(78,215,197)"),
        DDeiUtil.rgb2hex("rgb(70,125,254)"),
        DDeiUtil.rgb2hex("rgb(66,185,198)"),
        DDeiUtil.rgb2hex("rgb(255,126,121)"),
        DDeiUtil.rgb2hex("rgb(255,204,83)"),
        DDeiUtil.rgb2hex("rgb(141,192,255)"),
        DDeiUtil.rgb2hex("rgb(121,145,255)"),
        DDeiUtil.rgb2hex("rgb(254,157,23)")
      ],
      //备选色
      ds2: [
        DDeiUtil.rgb2hex("rgb(255,255,255)"),
        "#000000",
        DDeiUtil.rgb2hex("rgb(78,215,197)"),
        DDeiUtil.rgb2hex("rgb(70,125,254)"),
        DDeiUtil.rgb2hex("rgb(66,185,198)"),
        DDeiUtil.rgb2hex("rgb(255,126,121)"),
        DDeiUtil.rgb2hex("rgb(255,204,83)"),
        DDeiUtil.rgb2hex("rgb(141,192,255)"),
        DDeiUtil.rgb2hex("rgb(121,145,255)"),
        DDeiUtil.rgb2hex("rgb(254,157,23)"),

        DDeiUtil.rgb2hex("rgb(235,235,235)"),
        DDeiUtil.rgb2hex("rgb(126,126,126)"),
        DDeiUtil.rgb2hex("rgb(233,248,245)"),
        DDeiUtil.rgb2hex("rgb(233,236,255)"),
        DDeiUtil.rgb2hex("rgb(232,233,245)"),
        DDeiUtil.rgb2hex("rgb(255,236,236)"),
        DDeiUtil.rgb2hex("rgb(255,246,233)"),
        DDeiUtil.rgb2hex("rgb(238,244,255)"),
        DDeiUtil.rgb2hex("rgb(236,238,255)"),
        DDeiUtil.rgb2hex("rgb(255,240,231)"),

        DDeiUtil.rgb2hex("rgb(215,215,215)"),
        DDeiUtil.rgb2hex("rgb(105,105,105)"),
        DDeiUtil.rgb2hex("rgb(208,240,234)"),
        DDeiUtil.rgb2hex("rgb(207,215,255)"),
        DDeiUtil.rgb2hex("rgb(207,209,234)"),
        DDeiUtil.rgb2hex("rgb(255,216,215)"),
        DDeiUtil.rgb2hex("rgb(255,236,209)"),
        DDeiUtil.rgb2hex("rgb(219,232,255)"),
        DDeiUtil.rgb2hex("rgb(215,220,255)"),
        DDeiUtil.rgb2hex("rgb(255,223,204)"),

        DDeiUtil.rgb2hex("rgb(195,195,195)"),
        DDeiUtil.rgb2hex("rgb(89,89,89)"),
        DDeiUtil.rgb2hex("rgb(178,232,223)"),
        DDeiUtil.rgb2hex("rgb(176,191,254)"),
        DDeiUtil.rgb2hex("rgb(176,180,223)"),
        DDeiUtil.rgb2hex("rgb(255,192,190)"),
        DDeiUtil.rgb2hex("rgb(255,226,179)"),
        DDeiUtil.rgb2hex("rgb(197,220,255)"),
        DDeiUtil.rgb2hex("rgb(190,199,255)"),
        DDeiUtil.rgb2hex("rgb(254,204,171)"),

        DDeiUtil.rgb2hex("rgb(175,175,175)"),
        DDeiUtil.rgb2hex("rgb(69,69,69)"),
        DDeiUtil.rgb2hex("rgb(140,224,210)"),
        DDeiUtil.rgb2hex("rgb(137,163,254)"),
        DDeiUtil.rgb2hex("rgb(135,143,211)"),
        DDeiUtil.rgb2hex("rgb(255,163,160)"),
        DDeiUtil.rgb2hex("rgb(255,215,142)"),
        DDeiUtil.rgb2hex("rgb(172,207,255)"),
        DDeiUtil.rgb2hex("rgb(160,175,255)"),
        DDeiUtil.rgb2hex("rgb(254,182,106)"),

        DDeiUtil.rgb2hex("rgb(155,155,155)"),
        DDeiUtil.rgb2hex("rgb(48,48,48)"),
        DDeiUtil.rgb2hex("rgb(68,189,173)"),
        DDeiUtil.rgb2hex("rgb(61,109,224)"),
        DDeiUtil.rgb2hex("rgb(66,74,174)"),
        DDeiUtil.rgb2hex("rgb(225,110,106)"),
        DDeiUtil.rgb2hex("rgb(225,179,72)"),
        DDeiUtil.rgb2hex("rgb(123,169,225)"),
        DDeiUtil.rgb2hex("rgb(106,127,225)"),
        DDeiUtil.rgb2hex("rgb(224,138,19)"),

        DDeiUtil.rgb2hex("rgb(135,135,135)"),
        DDeiUtil.rgb2hex("rgb(25,25,25)"),
        DDeiUtil.rgb2hex("rgb(55,158,144)"),
        DDeiUtil.rgb2hex("rgb(49,90,187)"),
        DDeiUtil.rgb2hex("rgb(45,60,145)"),
        DDeiUtil.rgb2hex("rgb(188,91,87)"),
        DDeiUtil.rgb2hex("rgb(188,149,59)"),
        DDeiUtil.rgb2hex("rgb(102,140,188)"),
        DDeiUtil.rgb2hex("rgb(87,105,188)"),
        DDeiUtil.rgb2hex("rgb(187,114,14)"),
      ],
      //常用标准色
      ds3: [
        DDeiUtil.rgb2hex("rgb(192,0,0)"),
        DDeiUtil.rgb2hex("rgb(255,0,0)"),
        DDeiUtil.rgb2hex("rgb(255,192,0)"),
        DDeiUtil.rgb2hex("rgb(255,255,0)"),
        DDeiUtil.rgb2hex("rgb(146,208,80)"),
        DDeiUtil.rgb2hex("rgb(0,176,80)"),
        DDeiUtil.rgb2hex("rgb(0,146,240)"),
        DDeiUtil.rgb2hex("rgb(0,112,192)"),
        DDeiUtil.rgb2hex("rgb(0,32,96)"),
        DDeiUtil.rgb2hex("rgb(112,48,160)")
      ]
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData()

  },
  methods: {
    refreshData(){
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.dataSource) {
        this.dataSource = this.editor?.tempDialogData[this.dialogId].dataSource
      }
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.value) {
        this.value = this.editor?.tempDialogData[this.dialogId].value
      }
      DDeiUtil.readRecentlyChooseColors();
      for (let i = DDeiUtil.recentlyChooseColors?.length; i >= 0; i--) {
        this.ds1.splice(0, 0, DDeiUtil.recentlyChooseColors[i])
        if (this.ds1.length > 10) {
          this.ds1.splice(10, 1)
        }
      }
    },

    selectColor(evt) {
      let srcElement = evt.currentTarget;
      this.value = DDeiUtil.rgb2hex(srcElement.style.backgroundColor)
    },
    selectConfirmColor(evt) {
      let srcElement = evt.currentTarget;
      this.value = DDeiUtil.rgb2hex(srcElement.style.backgroundColor)
      this.ok()
    },

    ok() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
        this.editor?.tempDialogData[this.dialogId]?.callback?.ok(this.value);
      }

      if (this.value) {
        DDeiUtil.whiteRecentlyChooseColors(this.value)
      }
      DDeiEditorUtil.closeDialog(this.dialogId);
    },

    clear() {
      this.value = null
    },

    cancel() {
      DDeiEditorUtil.closeDialog(this.dialogId);
    },
  }
};
</script>

<style lang="less" scoped>
/**以下是选择颜色的弹出框 */
.ddei-core-dialog-selectcolor {

  border: 1px solid var(--panel-border);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 290px;
  position: absolute;
  background-color: var(--panel-background);
  height: 380px;
  z-index: 999;
  user-select: none;

  .content {
    width: 100%;
    max-height: 380px;
    overflow-y: auto;

    .group {
      color: var(--panel-title);
      width: 100%;

      .title {
        color: var(--panel-title);
        flex: 0 0 30px;
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        font-size: 15px;
        border: none;
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .color1 {
        display: grid;
        gap: 1px;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      }

      .color2 {
        display: grid;
        grid-template-rows: 20px 20px 20px 20px 20px 20px 20px;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        margin: 10px 0px;
      }

      .color3 {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-top: -5px;

        >input {
          width: 80px;
          height: 24px;
          background: var(--panel-background);
          border:1px solid var(--panel-title);
          color:var(--panel-title);
        }

        .colorinput {
          outline: none;
          border: none;
          width: 60px;
          height: 34px;
          margin-right: 5px;
          background: none;
        }
      }

      .group_content {
        width: 100%;
        padding: 0px 15px;
        
      }

      .item {
        width: 25px;
        height: 20px;
        margin: 0px 2px;
        margin: auto;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 0.5px solid var(--panel-title);
      }

      .item:hover {
        outline: 1px solid var(--panel-hover);
      }

      .item-selected {
        outline: 1px solid var(--panel-selected);
      }
    }
  }

  .tail {
    margin-top: 5px;
    flex: 0 0 55px;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    justify-content: end;
  }

  .button {
    flex: 0 0 70px;
    height: 32px;
    background: var(--panel-background);
    border: 1px solid var(--panel-title);
    border-radius: 6px;
    font-size: 16px;
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
    border: 1px solid var(--panel-background);
    background: var(--dot);

  }

  .button-small {
    height: 26px;
    flex: 0 0 55px;
    font-size: 15px;
    border: 1px solid var(--panel-title);
    color: var(--panel-title);
  }

  .button-small:hover {
    color: var(--panel-title);
    font-weight: bold;
    background: var(--panel-background);
    cursor: pointer;
  }
}
</style>
