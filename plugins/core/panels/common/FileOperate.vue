<template>
  <div class="ddei-core-panel-fileoperate">
    <div class="ddei-core-panel-fileoperate-item" style="grid-row:1/3">
      <div class="ddei-core-panel-fileoperate-item-box" @click="newFile">
        <img width="16px" height="16px" :src="icons['icon-file']" />
        <div>{{ editor.i18n('ddei.new') }}</div>
      </div>
      <div class="ddei-core-panel-fileoperate-item-box" @click="save">
        <img width="16px" height="16px" :src="icons['icon-save']" />
        <div>{{ editor.i18n('ddei.save') }}</div>
      </div>
      <div class="ddei-core-panel-fileoperate-item-box" @click="openFile">
        <img width="16px" height="16px" :src="icons['icon-open']" />
        <div>{{ editor.i18n('ddei.open') }}</div>
      </div>
      <div class="ddei-core-panel-fileoperate-item-box" @click="download">
        <img width="16px" height="16px" :src="icons['icon-download']" />
        <div>{{ editor.i18n('ddei.download') }}</div>
      </div>
    </div>
    <div class="ddei-core-panel-fileoperate-item">
      <div class="ddei-core-panel-fileoperate-item-text">
        {{ editor.i18n('ddei.save') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiStoreLocal} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiStage} from "ddei-framework";
import {DDeiActiveType} from "ddei-framework";
import {DDeiFile} from "ddei-framework";
import {DDeiSheet} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: "ddei-core-panel-fileoperate",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
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
      icons: null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    /**
     * 新建文件
     * @param evt
     */
    newFile(evt) {
      if (this.editor?.ddInstance) {
        let ddInstance = this.editor.ddInstance;
        let file = DDeiFile.loadFromJSON(
          {
            name: "新建文件_NEW",
            path: "/新建文件_NEW",
            sheets: [
              new DDeiSheet({
                name: "页面-1",
                desc: "页面-1",
                stage: DDeiStage.initByJSON({ id: "stage_1" }),
                active: DDeiActiveType.ACTIVE,
              }),
            ],
            currentSheetIndex: 0,
            state: DDeiFileState.NEW,
            active: DDeiActiveType.ACTIVE,
          },
          { currentDdInstance: ddInstance }
        );
        //添加文件
        if (this.editor.currentFileIndex != -1) {
          this.editor.files[this.editor.currentFileIndex].active =
            DDeiActiveType.NONE;
        }
        this.editor.addFile(file);
        this.editor.currentFileIndex = this.editor.files.length - 1;
        let sheets = file?.sheets;
        if (file && sheets && ddInstance) {
          let stage = sheets[0].stage;
          stage.ddInstance = ddInstance;
          //刷新页面
          ddInstance.stage = stage;
          //记录文件初始日志
          file.initHistroy();
          //设置视窗位置到中央
          if (!stage.wpv) {
            //缺省定位在画布中心点位置
            stage.wpv = {
              x: -(stage.width - ddInstance.render.container.clientWidth) / 2,
              y: -(stage.height - ddInstance.render.container.clientHeight) / 2,
              z: 0,
            };
          }
          //加载场景渲染器
          stage.initRender();
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
          ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
            parts: ["bottommenu"],
          });

          this.editor.changeState(DDeiEditorState.DESIGNING);
          ddInstance.bus.executeAll();
        }
      }
    },

    /**
     * 保存
     * @param evt
     */
    save(evt) {
      this.editor.changeState(DDeiEditorState.DESIGNING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.SaveFile, {}, evt);
      this.editor.bus.executeAll();
    },

    /**
     * 下载文件
     */
    download(evt) {
      if (this.editor?.ddInstance?.stage) {
        //获取json信息
        let file = this.editor?.files[this.editor?.currentFileIndex];
        if (file) {
          let json = file.toJSON();
          if (json) {
            // 创建隐藏的可下载链接
            let eleLink = document.createElement("a");
            eleLink.download = file.name + ".dei";
            eleLink.style.display = "none";
            // 字符内容转变成blob地址
            let blob = new Blob([JSON.stringify(json)]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
            this.editor.changeState(DDeiEditorState.DESIGNING);
          }
        }
      }
    },

    /**
     * 打开文件
     * @param evt
     */
    openFile(evt) {
      //执行保存
      let storeIns = new DDeiStoreLocal();
      storeIns.find("").then((datas) => {
        //找到第一个没有打开的文件，执行打开 TODO
        if (datas) {
          for (let i = 0; i < datas.length; i++) {
            let finded = false;
            for (let j = 0; j < this.editor.files.length; j++) {
              if (this.editor.files[j].id == datas[i].id) {
                finded = true;
                break;
              }
            }
            if (!finded) {
              let storeIns = new DDeiStoreLocal();

              storeIns.load(datas[i].id).then((rowData) => {
                //存在数据，执行修改
                if (rowData) {
                  let ddInstance = this.editor?.ddInstance;
                  let file = DDeiFile.loadFromJSON(JSON.parse(rowData.data), {
                    currentDdInstance: ddInstance,
                  });
                  this.editor.addFile(file);
                  for (let x = 0; x < this.editor.files.length; x++) {
                    this.editor.files[x].active = DDeiActiveType.NONE;
                  }
                  this.editor.currentFileIndex = this.editor.files.length - 1;
                  file.state = DDeiFileState.NONE;
                  file.active = DDeiActiveType.ACTIVE;
                  let sheets = file?.sheets;

                  if (file && sheets && ddInstance) {
                    file.changeSheet(file.currentSheetIndex);

                    let stage = sheets[file.currentSheetIndex].stage;
                    stage.ddInstance = ddInstance;
                    //记录文件初始日志
                    file.initHistroy();
                    //刷新页面
                    ddInstance.stage = stage;
                    //加载场景渲染器
                    stage.initRender();
                    //设置视窗位置到中央
                    if (!stage.wpv) {
                      //缺省定位在画布中心点位置
                      stage.wpv = {
                        x:
                          -(
                            stage.width -
                            ddInstance.render.container.clientWidth
                          ) / 2,
                        y:
                          -(
                            stage.height -
                            ddInstance.render.container.clientHeight
                          ) / 2,
                        z: 0,
                      };
                    }
                    this.editor.changeState(DDeiEditorState.DESIGNING);
                    ddInstance.bus.push(
                      DDeiEditorEnumBusCommandType.ClearTemplateUI
                    );
                    ddInstance.bus.push(
                      DDeiEditorEnumBusCommandType.RefreshEditorParts,
                      { parts: ["bottommenu"] }
                    );

                    ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape);
                    ddInstance?.bus?.executeAll();
                  }
                }
              });
              return;
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-fileoperate {
  width: 150px;
  height: 90px;
  border-right: 1px solid rgb(224, 224, 224);
  grid-template-rows: 30px 30px 20px;
  grid-template-columns: 1fr;
  display: grid;
  gap: 4px;
  padding-right: 4px;

  &-item{
    margin: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 4px;
    &-text {
      text-align: center;
      font-size: 12px;
      grid-column: 1/5;
      color: var(--panel-title);
    }

    &-box {
      width: 30px;
      height: 50px;
      color: var(--panel-title);
      border-radius: 4px;
      font-size: 12px;
      display: grid;
      grid-template-rows: 25px 25px 10px;
      grid-template-columns: 1fr;
      div {
        margin: auto;
      }
      img {
        filter: brightness(45%) drop-shadow(0.2px 0px 0.2px var(--panel-title));
        width: 16px;
        height: 16px;
        margin: auto;
      }
      &:hover {
        background-color: var(--panel-hover);
        border-radius: 4px;
      }
    }
  }
}

</style>
