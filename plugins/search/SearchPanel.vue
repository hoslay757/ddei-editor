<template>
  <div class="ddei-ext-panel-search">
    <div :class="{ 'ddei-ext-panel-search-mode': true, 'ddei-ext-panel-search-mode__expand':mode== 2}"
      @click="changeReplace">
      <svg class="icon" aria-hidden="true">
        <use v-if="mode==1" xlink:href="#icon-a-ziyuan477"></use>
        <use v-if="mode==2" xlink:href="#icon-a-ziyuan478"></use>
      </svg>
    </div>
    <div class="ddei-ext-panel-search-box">
      <input class="ddei-ext-panel-search-box-input" :placeholder="搜索" autocomplete="off" />
      <div class="ddei-ext-panel-search-box-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan454"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-box-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-all-match"></use>
        </svg>
      </div>
    </div>
    <div class="ddei-ext-panel-search-result">
      第3项，共3项
    </div>

    <div class="ddei-ext-panel-search-buttons">
      <div class="ddei-ext-panel-search-buttons-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan483"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-buttons-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan482"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-buttons-btn" @click="closeDialog">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan422"></use>
        </svg>
      </div>
    </div>

    <div v-if="mode==2" class="ddei-ext-panel-search-box">
      <input class="ddei-ext-panel-search-box-input" :placeholder="替换" autocomplete="off" />
    </div>
    <div v-if="mode == 2" class="ddei-ext-panel-search-replace-buttons">
      <div class="ddei-ext-panel-search-replace-buttons-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-replace"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-replace-buttons-btn">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-replace-all"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: "ddei-ext-panel-search",
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
      mode:1
    };
  },
  computed: {},
  watch: {},
  created() {

  },
  mounted() {
    
  },
  methods:{
    changeReplace(){
      if (this.mode == 1){
        this.mode = 2;
      }else{
        this.mode = 1;
      }
    },

    closeDialog(){
      DDeiEditorUtil.closeDialog(this.editor,"ddei-ext-dialog-search",true)
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-panel-search {
    width:500px;
    background-color: var(--panel-background);
    height: 36px;
    .icon{
      color:var(--icon);
      font-size: 16px;
    }
  
    &-mode {
      float: left;
      height:36px;
      width:24px;
      display:flex;
      align-items: center;
      justify-content: center;

      &__expand {
          height: 69px;
      }

      &:hover{
        background: var(--panel-header);
        cursor:pointer;
      }
    }

    &-box {
      float: left;
      margin-top:3px;
      height: 30px;
      width: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--panel-header);
      border: 0.5px solid var(--panel-hover);
      &:hover {
        background: var(--panel-header);
        cursor: pointer;
        border: 0.5px solid var(--dot);
      }
      &-input{
        flex: 1;
        height:30px;
        background: none;
        border:none;
        outline: none;
      }

      &-btn{
        width:25px;
        height: 25px;
        margin-right:3px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: var(--panel-hover);
          filter: brightness(85%);
          cursor: pointer;
        }

        &__selected {
          background-color: var(--panel-hover);
          filter: brightness(85%);
        }
      }
    }

    &-result {
      float: left;
      margin-top: 3px;
      margin-left:5px;
      height: 30px;
      width: 150px;
      display: flex;
      align-items: center;
      justify-content: start;
      color: var(--panel-title);
      font-size: 14px;
    }
    &-buttons {
      float: left;
      margin-top: 3px;
      margin-left: 5px;
      height: 30px;
      width: 110px;
      display: flex;
      align-items: center;
      justify-content: end;
      color: var(--panel-title);
      font-size: 14px;

      &-btn{
        display: flex;
        align-items: center;
        justify-content: center;
        width:30px;
        height:30px;
        &:hover {
          background-color: var(--panel-header);
          cursor: pointer;
        }
      
        &__selected {
          background-color: var(--panel-header);
        }

        .icon{
          font-size: 18px;
           
        }
      }
    }

    &-replace{
      &-buttons {
        float: left;
        margin-top: 3px;
        margin-left: 5px;
        height: 30px;
        width: 110px;
        display: flex;
        align-items: center;
        justify-content: start;
        color: var(--panel-title);
        font-size: 14px;

        &-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;

          &:hover {
            background-color: var(--panel-header);
            cursor: pointer;
          }

          .icon {
            font-size: 16px;

          }
        }
      }
    }
}
</style>
