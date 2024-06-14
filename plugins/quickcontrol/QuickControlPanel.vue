<template>
  <div class="ddei-ext-panel-quickcontrol" ref="quickControlDiv">
    <div class="ddei-ext-panel-quickcontrol-left">
      <svg width="16" height="11" @mouseenter="mouseEnter(4,$el,$event)" 
        style="transform: rotate(-90deg);">
        <polygon points="8,0 0,10 16,10" />
      </svg>
    </div>
    <div class="ddei-ext-panel-quickcontrol-middle">
      <div class="ddei-ext-panel-quickcontrol-middle-top">
        <svg width="16" height="11" @mouseenter="mouseEnter(1, $el, $event)" >
          <polygon points="8,0 0,10 16,10" />
        </svg>
      </div>
      <div class="ddei-ext-panel-quickcontrol-middle-middle">
      </div>
      <div class="ddei-ext-panel-quickcontrol-middle-bottom">
        <svg width="16" height="11" @mouseenter="mouseEnter(3, $el, $event)" 
          style="transform: rotate(180deg);">
          <polygon points="8,0 0,10 16,10" />
        </svg>
      </div>
    </div>
    <div class="ddei-ext-panel-quickcontrol-right">
      <svg width="16" height="11" @mouseenter="mouseEnter(2, $el, $event)" 
        style="transform: rotate(90deg);">
        <polygon points="8,0 0,10 16,10" />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import { DDeiEditor, DDeiEditorEnumBusCommandType, DDeiUtil } from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import { debounce } from "lodash";

export default {
  name: "ddei-ext-panel-quickcontrol",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    //获取model
    
    let model = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].model
    if (model){
      let width = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].width;
      width = width || width == 0 ? width : 40;
      let height = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].height;
      height = height || height == 0 ? height : 40;
      this.$refs.quickControlDiv.style.width = (model.width + width)+"px";
      this.$refs.quickControlDiv.style.height = (model.height + height) + "px";
    }
  },
  methods:{
    mouseEnter(type,el,evt) {
      //显示弹出框
      let editorEle = document.getElementById(this.editor.id);
      let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
      let elPos = evt.currentTarget.getBoundingClientRect()
    
      let left = elPos.left - editorDomPos.left;
      let top = elPos.top - editorDomPos.top
      if(type == 1){
        left -= 120 - elPos.width / 2
        top -= 240 + elPos.height / 2
      } else if (type == 2) {
        left += evt.currentTarget.parentElement.clientWidth
        top -= 120 - elPos.height / 2
      } else if (type == 3) {
        left -= 120 - elPos.width / 2
        top  += elPos.height * 1.5
      } else if (type == 4) {
        left -= 240 + evt.currentTarget.parentElement.clientWidth/2
        top -= 120 - elPos.height/2
      }
      
      DDeiEditorUtil.showDialog(this.editor, 'ddei-ext-dialog-quickchoosecontrol', {
        group: "canvas-pop-1"
      }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
      this.editor.changeState("ext-quickchoosecontrol");
    },
    mouseleave(type,el,evt) {
      if (this.editor.state == "desiging"){
        DDeiEditorUtil.closeDialog(this.editor, 'ddei-ext-dialog-quickchoosecontrol', true)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-panel-quickcontrol {
    background:transparent;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    svg>{
      pointer-events: auto;
      fill: var(--icon);
      &:hover{
        fill:var(--dot);
        cursor: pointer;
      }
    }
    &-left {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 20px;
    }
    &-middle {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height:100%;
      &-top {
        flex: 0 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-middle {
        flex: 1;
      }
      &-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 20px;
      }
    }
    &-right {
      flex: 0 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
}
</style>
