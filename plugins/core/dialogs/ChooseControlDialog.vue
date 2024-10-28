<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-choosecontrol" v-if="forceRefresh">
    <div class="ddei-core-dialog-choosecontrol-content">
      <div class="ddei-core-dialog-choosecontrol-content-itempanel" v-if="group">
        <div @click="ok(control,$event)"
          @mousedown="prepareDrag(control, $event)"
          @mousemove="dragMove($event)"
          :class="{ 'ddei-core-dialog-choosecontrol-content-itempanel-item': true}" :title="control.desc"
          v-for="control in group.controls">
          <img class="icon" v-if="!control.icon" :src="editor?.icons[control.id]" />
          <div class="icon-html" v-if="control.icon" v-html="control.icon"></div>
          <div class="text">{{ control.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import DialogBase from "./dialog"
import { groupBy } from "lodash";

export default {
  name: "ddei-core-dialog-choosecontrol",
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
      dialogId: 'ddei-core-dialog-choosecontrol',
      group: null
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
      
      if (this.editor?.tempPopData && this.editor?.tempPopData[this.dialogId]?.controlGroup) {
        this.group = this.editor?.tempPopData[this.dialogId].controlGroup
      }
    },

    ok(control, evt) {
      delete this.isDrag
      delete this.dragControl
      if (this.editor?.tempPopData[this.dialogId]?.callback?.ok) {
        this.editor?.tempPopData[this.dialogId]?.callback?.ok(this.group, control, evt);
      }
    },

    prepareDrag(control, evt) {
      if (this.editor?.tempPopData[this.dialogId]?.callback?.drag) {
        this.isDrag = true
        this.dragControl = control
      }
      
    },

    dragMove(evt) {
      if (this.isDrag){
        if (this.editor?.tempPopData[this.dialogId]?.callback?.drag) {

          this.editor?.tempPopData[this.dialogId]?.callback?.drag(this.group, this.dragControl, evt);
          delete this.isDrag
          delete this.dragControl
        }
      }
    },


  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-choosecontrol {
  display: none;
  overflow: hidden;
  max-width: 220px;
  position: absolute;
  max-height: 220px;
  z-index: 999999;
  &-content {
      max-width: 220px;
      border: 1px solid var(--panel-border);
      background-color: var(--panel-background);
      box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
      border-radius: 6px;
      max-height: 220px;
      overflow-y: auto;
      overflow-x: hidden;
      user-select: none;
      &-itempanel {
          display: flex;
          flex-flow: row wrap;
          background: var(--toolbox-background);
          padding: 5px 5px 5px 5px;
      
          &-item {
            flex: 0 0 50px !important;
            height: 45px;
            margin: 5px 0px;
            display: flex;
            overflow: hidden;
            justify-content: center;
            align-items: center;
            flex-flow: column;
      
            &:hover {
              background: var(--toolbox-control-hover);
              outline: var(--toolbox-control-hover-outline);
              cursor: all-scroll;
            }
      
            .text {
              white-space: nowrap;
              text-align: center;
              font-size: 0.7vw;
              font-weight: 400;
              color: var(--toolbox-control-title);
            }
      
            .icon {
              width: 90%;
              height: 90%;
              object-fit: contain;
            }

            .icon-html{
              width: 50px;
              height: 45px;
              object-fit: contain;
              display: flex;
              justify-content: center;
              align-items: center;
              >* {
                width: 28px !important;
                height: 28px !important;
                object-fit: contain;
              }
            }
          }
      }
  }
}
</style>
