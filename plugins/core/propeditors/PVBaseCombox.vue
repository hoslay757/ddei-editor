<template>
  <div :id="getEditorId(attrDefine?.code)"
    :class="{ 'ddei-pv-base-combox': true, 'ddei-pv-base-combox--disabled': !attrDefine || attrDefine.readonly }">
    <div
      :class="{ 'textinput': true, 'textinput_expanded': expanded, 'display_img': img && attrDefine?.itemStyle?.display == 'img', 'display_img_text': img && attrDefine?.itemStyle?.display == 'img-text' }">
      <span :class="img"
        v-if="img && (attrDefine?.itemStyle?.display == 'img-text' || attrDefine?.itemStyle?.display == 'img')"
        @click="attrDefine && !attrDefine.readonly && !canSearch && showDialog()"></span>
      <input type="text" autocomplete="off"
        v-if="!attrDefine?.itemStyle?.display || attrDefine?.itemStyle?.display == 'img-text' || attrDefine?.itemStyle?.display == 'text'"
        :readonly="attrDefine && (attrDefine.readonly || !canSearch)" v-model="text" :placeholder="defaultText"
        @click="attrDefine && !attrDefine.readonly && !canSearch && showDialog()" @keydown="search($event)" />
      <div style="display:flex;justify-content: center;align-items: center;"
        @click="attrDefine && !attrDefine.readonly && showDialog()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan466"></use>
        </svg>
      </div>
    </div>
    <div :id="getShowDialogId(attrDefine?.code)" :class="{ 'ddei-combox-show-dialog': true }">
      <div class="ddei-combox-show-dialog-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { debounce } from "lodash";
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
export default {
  name: "pv-basecombox",
  extends: null,
  mixins: [],
  props: {
    //当前属性定义
    attrDefine: {
      type: DDeiEditorArrtibute,
      default: null,
    },
    canSearch: {
      type: Boolean,
      default: false,
    },
    searchMethod: {
      type: Function,
      defaut: null,
    },
    //当前控件定义
    controlDefine: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      //是否展开
      expanded: false,
      //值
      value: null,
      //文本
      text: null,
      //图片
      img: null,
      defaultText: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    // 搜索框防抖
    this.search = debounce(this.search, 200);
  },

  mounted() {
    this.destroyDialog();
  },
  methods: {
    getShowDialogId(id) {
      return "ddei_attr_editor_dialog_" + id;
    },

    getEditorId(id) {
      return "ddei_attr_editor_" + id;
    },

    search(evt) {
      if (this.searchMethod) {
        this.searchMethod(this.text, evt);
      }
    },

    //打开弹出框
    showDialog(show: boolean = false, evt: Event) {
      if (!this.editor?.containerid) {
        return;
      }
      let dialogId = this.getShowDialogId(this.attrDefine.code)
      let dialog = document.getElementById(dialogId);
      let haveElement = false;
      let ele = document.getElementById(this.editor.containerid)
      for (let i = 0; i < ele.children.length; i++) {
        if (ele.children[i] == dialog) {
          haveElement = true;
        }
      }
      if (!haveElement) {
        //dialog.remove();
        let ele = document.getElementById(this.editor.containerid)
        ele.appendChild(dialog);
      }
      if (!this.expanded || haveElement) {
        dialog.style.display = "block";
        //获取父级控件绝对坐标
        let attrEditor = document.getElementById(
          this.getEditorId(this.attrDefine.code)
        );
        let position = DDeiUtil.getDomAbsPosition(attrEditor, this.editor);
        dialog.style.left = position.left - dialog.offsetWidth + attrEditor.offsetWidth -9.5 + "px";
        dialog.style.top = position.top + attrEditor.offsetHeight + "px";

        this.expanded = true;
        if (!DDeiEditor.ACTIVE_INSTANCE.tempDialogData) {
          DDeiEditor.ACTIVE_INSTANCE.tempDialogData = {}
        }
        //记录临时变量
        DDeiEditor.ACTIVE_INSTANCE.tempDialogData[dialogId] = { group: "property-dialog" }
      } else {
        dialog.style.display = "none";
        this.expanded = false;
        if (DDeiEditor.ACTIVE_INSTANCE.tempDialogData) {
          DDeiEditor.ACTIVE_INSTANCE.tempDialogData[dialogId] = null
        }
      }
    },

    //移除弹出框
    destroyDialog() {
      if(this.editor?.containerid){
        let dialogs = [];
        let ele = document.getElementById(this.editor.containerid)
        for (let i = 0; i < ele.children.length; i++) {
          if (ele.children[i].className == "ddei-combox-show-dialog") {
            dialogs.push(ele.children[i]);
          }
        }
        dialogs.forEach((dialog) => {
          dialog.remove();
        });
      }
    },

    closeDialog(evt) {
      this.expanded = false;
      let dialog = document.getElementById(
        this.getShowDialogId(this.attrDefine.code)
      );
      dialog.style.display = "none";
    },
  },
};
</script>

<style scoped>
.ddei-pv-base-combox {
  height: 28px;
  padding-right: 10px;
}

.ddei-pv-base-combox--disabled .textinput {
  background-color: var(--panel-disabled);
  height: 28px;
}

.ddei-pv-base-combox .textinput {
  width: 100%;
  padding-right: 5px;
  box-sizing: border-box;
  border: 0.5px solid var(--panel-title);
  border-radius: 4px;
  display: flex;
  padding-left: 5px;
  height: 28px;
}

.ddei-pv-base-combox .textinput:hover {
  border: 1px solid var(--dot);
  box-sizing: border-box;
}

.ddei-pv-base-combox .textinput input {
  flex: 1 1 calc(100% - 10px);
  width: calc(100% - 10px);
  border: transparent;
  outline: none;
  font-size: 15px;
  background: transparent;
  margin-top: 1px;
}

.ddei-pv-base-combox .textinput div {
  flex: 0 0 20px;
}

.ddei-pv-base-combox .display_img input {
  display: none;
}

.ddei-pv-base-combox .display_img img {
  width: 20px;
  height: 20px;
}

.ddei-pv-base-combox .display_img_text input {
  width: calc(100% - 30px);
}

.ddei-pv-base-combox .display_img_text img {
  float: left;
  width: 20px;
  height: 20px;
}

.ddei-combox-show-dialog {
  font-size: 13px;
  background: var(--panel-background);
  display: none;
  position: absolute;
  z-index: 999;
  border-radius: 4px;
}

.ddei-combox-show-dialog-content {
  width: 100%;
  height: 100%;
  background: var(--panel-background);
  padding: 10px;
  box-shadow: 4px 4px 4px hsl(0deg 0% 0% /0.25);
  display:flex;
  justify-content: center;
  align-items: center;
}

.icon {
  font-size: 16px
}
</style>
