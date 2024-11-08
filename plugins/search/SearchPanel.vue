<template>
  <div class="ddei-ext-panel-search">
    <div :class="{ 'ddei-ext-panel-search-mode': true, 'ddei-ext-panel-search-mode__expand':editor.search?.mode== 2}"
      @click="changeReplace">
      <svg class="icon" aria-hidden="true">
        <use v-if="editor.search?.mode==1" xlink:href="#icon-btn-right1"></use>
        <use v-if="editor.search?.mode==2" xlink:href="#icon-expand2"></use>
      </svg>
    </div>
    <div class="ddei-ext-panel-search-box">
      <input class="ddei-ext-panel-search-box-input" v-model="editor.search.keywords" :id="searchInputId"
        ref="searchBoxInput" @keydown="executeQuery($event)" @focus="changeEditorState"
        :placeholder="editor.i18n('ddei.search')" autocomplete="off" />
      <div @click="changeMatchCase()"
        :class="{ 'ddei-ext-panel-search-box-btn': true, 'ddei-ext-panel-search-box-btn__selected': editor.search?.matchCase == 1 }">
        <svg class="icon" style="width:16px;height:16px;" aria-hidden="true">
          <use xlink:href="#icon-lock-case"></use>
        </svg>
      </div>
      <div @click="changeMatchAll()"
        :class="{ 'ddei-ext-panel-search-box-btn': true, 'ddei-ext-panel-search-box-btn__selected': editor.search?.matchAll == 1 }">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-all-match"></use>
        </svg>
      </div>
    </div>
    <div class="ddei-ext-panel-search-result" v-if="editor.lang == 'zh_CN'">
      第{{ editor.search?.resultIndex + 1 }}项，共{{ editor.search?.result?.length }}项
    </div>
    <div class="ddei-ext-panel-search-result" v-if="editor.lang != 'zh_CN'">
      {{editor.search?.resultIndex + 1}}/{{editor.search?.result?.length }}
    </div>

    <div class="ddei-ext-panel-search-buttons">
      <div
        :class="{ 'ddei-ext-panel-search-buttons-btn': true, 'ddei-ext-panel-search-buttons-btn__disabled': !editor.search || editor.search?.resultIndex >= editor.search?.result?.length - 1}"
        @click="moveToNextResult()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-down"></use>
        </svg>
      </div>
      <div
        :class="{ 'ddei-ext-panel-search-buttons-btn': true, 'ddei-ext-panel-search-buttons-btn__disabled': !editor.search || editor.search?.resultIndex == 0 || editor.search?.result?.length == 0 }"
        @click="moveToUpResult()">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-up"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-buttons-btn" @click="closeDialog">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-close"></use>
        </svg>
      </div>
    </div>

    <div v-if="editor.search?.mode==2" class="ddei-ext-panel-search-box">
      <input :id="replaceInputId" ref="searchReplaceBoxInput" class="ddei-ext-panel-search-box-input"
        v-model="replaceText" @focus="changeEditorState" :placeholder="editor.i18n('ddei.replace')"
        autocomplete="off" />
    </div>
    <div v-if="editor.search?.mode == 2" class="ddei-ext-panel-search-replace-buttons">
      <div class="ddei-ext-panel-search-replace-buttons-btn" @click="executeReplace(editor)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-replace"></use>
        </svg>
      </div>
      <div class="ddei-ext-panel-search-replace-buttons-btn" @click="executeReplaceAll(editor)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-replace-all"></use>
        </svg>
      </div>
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
      searchInputId:'',
      replaceInputId:'',
      replaceText:''
    };
  },
  computed: {},
  watch: {},
  created() {
    if (!this.editor.search) {
      this.editor.search = {
        resultIndex: -1,
        result: []
      }
    }
    this.executeQuery = debounce(this.executeQuery, 300)
  },
  mounted() {
    
    if(!this.editor.search.mode){
      this.editor.search.mode = 1
    }
    this.searchInputId = this.editor.id + "_search_input";
    this.replaceInputId = this.editor.id + "_search_replace_input";
    if(this.editor?.search?.result?.length > 0){
      this.changeFileSheetSelectAndModel()
    }
    setTimeout(() => {
      if (this.editor.search.mode == 2){
        this.$refs.searchReplaceBoxInput.focus();
      } else{
        this.$refs.searchBoxInput.focus();
      }
    }, 300);
    
  },
  methods:{
    changeReplace() {
      if (this.editor.search.mode == 1 && this.editor.ddInstance && this.editor.ddInstance["AC_DESIGN_EDIT"]) {
        this.editor.search.mode = 2;
      } else {
        this.editor.search.mode = 1;
      }
    },

    changeMatchCase() {
      if (this.editor.search.matchCase == true) {
        this.editor.search.matchCase = false;
      } else {
        this.editor.search.matchCase = true;
      }
      this.executeQuery();
    },

    changeMatchAll() {
      if (this.editor.search.matchAll == true) {
        this.editor.search.matchAll = false;
      } else {
        this.editor.search.matchAll = true;
      }
      this.executeQuery();
    },

    executeQuery(evt:Event){
      if (evt?.keyCode != 13 && evt?.keyCode != 27){
        let rs = this.editor.searchModels(this.editor.search?.keywords, "text", false, 3, this.editor.search?.matchCase, this.editor.search?.matchAll)
        if(rs?.length > 0){
          this.editor.search.result = rs;
          this.editor.search.resultIndex = -1
        }else{
          this.editor.search.result = []
          this.editor.search.resultIndex = -1
        }
        this.moveToNextResult();
      }
      this.editor.search.inActive = false
      return true
    },

    moveToNextResult() {
      this.editor.search.resultIndex++;
      this.changeFileSheetSelectAndModel()
    },

    moveToUpResult() {
      this.editor.search.resultIndex--;
      this.changeFileSheetSelectAndModel()
    },

    changeFileSheetSelectAndModel(clearSpt:boolean = false){
      this.editor.search.inActive = false
      if (this.editor.search.resultIndex >= this.editor.search.result.length - 1) {
        this.editor.search.resultIndex = this.editor.search.result.length - 1
      } else if (this.editor.search.resultIndex < 0) {
        this.editor.search.resultIndex = 0
      }
      let ddInstance = this.editor.ddInstance
      let rsData = this.editor.search.result[this.editor.search.resultIndex]
      let skipIndex = [this.editor.search.resultIndex]
      let textSelectColor = DDeiUtil.getStyleValue("canvas-text-selection", this.editor.ddInstance);
      if (rsData?.model) {
        //切换文件和sheet
        let file = this.editor.files[rsData.fileIndex];

        if (file) {
          let sheetIndex = rsData.sheetIndex;
          if (sheetIndex >= 0) {
            this.editor.changeFile(rsData.fileIndex, sheetIndex)
            //选中并中心化控件
            this.editor.centerModels(ddInstance.stage, rsData.model.id)
            rsData.model?.render?.controlSelect();
            if (!clearSpt){
              //绘制选择效果
              let sptStyle = {}
              for (let i = 0; i < rsData.len; i++) {
                sptStyle["" + (rsData.index + i)] = { textStyle: { bgcolor: textSelectColor } }
              }
              //向前、向后查找当前控件，设置特殊样式并标记跳过
              for (let k = this.editor.search.resultIndex - 1; k > 0; k--) {
                if (this.editor.search.result[k].model == rsData.model) {
                  let rsd1 = this.editor.search.result[k]
                  for (let ki = 0; ki < rsd1.len; ki++) {
                    sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
                  }
                  skipIndex.push(k);
                } else {
                  break;
                }
              }
              for (let k = this.editor.search.resultIndex + 1; k < this.editor.search.result.length; k++) {
                if (this.editor.search.result[k].model == rsData.model) {
                  let rsd1 = this.editor.search.result[k]
                  for (let ki = 0; ki < rsd1.len; ki++) {
                    sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
                  }
                  skipIndex.push(k);
                } else {
                  break;
                }
              }
              
              rsData.model?.render?.drawShape({ border: { type: 1, color: "#017fff", width: 1, dash: [10, 10] }, sptStyle: sptStyle });
            }else{
              rsData.model?.render?.enableRefreshShape();
            }
          }
        }
      }
      
      for (let ri = 0; ri < this.editor.search.result.length; ri++) {
        let rsData = this.editor.search.result[ri]
        if (rsData?.model) {
          //切换文件和sheet
          let file = this.editor.files[rsData.fileIndex];
          if (file) {
            let sheetIndex = rsData.sheetIndex;
            if (sheetIndex >= 0) {
              if (skipIndex.indexOf(ri) == -1) {    
                if (!clearSpt) {
                  //绘制选择效果
                  let sptStyle = {}
                  for (let i = 0; i < rsData.len; i++) {
                    sptStyle["" + (rsData.index + i)] = { textStyle: { bgcolor: "#ebebeb" } }
                  }
                  for (let k = ri+1; k < this.editor.search.result.length; k++) {
                    if (this.editor.search.result[k].model == rsData.model) {
                      let rsd1 = this.editor.search.result[k]
                      for (let ki = 0; ki < rsd1.len; ki++) {
                        sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
                      }
                    } else {
                      ri = k-1
                      break;
                    }
                  }
                  rsData.model?.render?.drawShape({ sptStyle: sptStyle });
                } else {
                  rsData.model?.render?.enableRefreshShape();
                }
              }
            }
          }
        }
      }
      ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
      ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
      ddInstance.bus.executeAll();
    },


    executeReplace(editor) {
      if (editor.search?.result?.length > 0) {
        let rsData = editor.search?.result[editor.search?.resultIndex]
        if (rsData.model) {
          editor.replaceModelsData([rsData.model], "text", rsData.index, rsData.index + rsData.len, this.replaceText)
          //长度增加量
          for (let k = editor.search.resultIndex + 1; k < editor.search.result?.length; k++) {
            if (editor.search.result[k].model == rsData.model) {
              let lenDelta = this.replaceText.length - rsData.len
              if (lenDelta != 0) {
                editor.search.result[k].index += lenDelta
                if (editor.search.result[k].index < 0) {
                  editor.search.result[k].index = 0
                }
              }
            } else {
              break;
            }

          }
          editor.search.result.splice(editor.search?.resultIndex, 1)
          if (editor.search.result.length > editor.search.resultIndex) {
            editor.search.resultIndex--
            if (editor.search.resultIndex < 0) {
              editor.search.resultIndex = 0
            }
          }
          if (editor.search.result.length == 0) {
            editor.search.resultIndex = 0
            rsData.model?.render?.clearCachedValue();
          }
        }
        this.changeFileSheetSelectAndModel();
        let ddInstance = editor.ddInstance
        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
        ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
        ddInstance.bus.executeAll();
      }
      editor.search.inActive = false
      return true
    },

    executeReplaceAll(editor) {
      while (editor.search?.result?.length > 0) {
        let rsData = editor.search?.result[0]
        if (rsData.model) {
          editor.replaceModelsData([rsData.model], "text", rsData.index, rsData.index + rsData.len, this.replaceText)
          //长度增加量
          for (let k = 1; k < editor.search.result?.length; k++) {
            if (editor.search.result[k].model == rsData.model) {
              let lenDelta = this.replaceText.length - rsData.len
              if (lenDelta != 0) {
                editor.search.result[k].index += lenDelta
                if (editor.search.result[k].index < 0) {
                  editor.search.result[k].index = 0
                }
              }
            } else {
              break;
            }
          }
          editor.search.result.splice(editor.search?.resultIndex, 1)
          rsData.model?.render?.clearCachedValue();
        }
      }
      editor.search.resultIndex = -1
      let ddInstance = editor.ddInstance
      ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
      ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
      ddInstance.bus.executeAll();
      editor.search.inActive = false
      return true
    },

    changeEditorState(){
      this.editor.changeState("ddei-search");
    },

    closeDialog(){
      DDeiEditorUtil.closeDialog(this.editor,"ddei-ext-dialog-search",true)
      this.changeFileSheetSelectAndModel(true);
      this.editor.changeState(DDeiEditorState.DESIGNING);
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-panel-search {
    width:500px;
    background-color: var(--panel-background);
    
    .icon{
      color:var(--icon);
      font-size: 18px;
      width:18px;
      height:18px;
    }
  
    &-mode {
      float: left;
      height:32px;
      width:24px;
      display:flex;
      align-items: center;
      justify-content: center;

      &__expand {
          height: 64px;
      }

      &:hover{
        background: var(--panel-header);
        cursor:pointer;
      }
    }

    &-box {
      float: left;
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
        color:var(--panel-title);
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
          background-color: var(--dot);
          filter: brightness(130%);
          cursor: pointer;
          border-radius: 4px;
        }

        &__selected {
          background-color: var(--dot);
          filter: brightness(130%);
          border-radius: 4px;
        }
      }
    }

    &-result {
      float: left;
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
      margin-bottom:3px;
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

        &__disabled {
          .icon{
            filter: opacity(0.5)
          }

          &:hover{
            background:none;
            cursor: default;
          }
        }

        .icon{
          font-size: 18px;
          width:18px;
          height:18px
        }
      }
    }

    &-replace{
      &-buttons {
        float: left;
        margin-bottom: 3px;
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
            font-size: 18px;
            width: 18px;
            height: 18px
          }
        }
      }
    }
}
</style>
