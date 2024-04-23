<template>
  <DDeiEditor ref="editorViewer" v-if="loadMode == 1 || loadMode == 2" :options="options" id="editor_1"></DDeiEditor>
   <div v-if="loadMode == 3" class="ddei_sslink_outtime">
    <div class="content">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan388"></use>
        </svg>
        <span>很抱歉，当前链接已失效</span>
        <div class="goback" @click="goBackLogin">返回</div>
      </div>
    </div>
  </div>

  <div v-if="loadMode == 4" class="ddei_sslink_enterpwd">
    <div class="content">
      <div class="header">
        <svg class="icon warn" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan378"></use>
        </svg>
        <span>请输入提取码</span>
      </div>
      <div class="field">
        <div class="link-code-title">提取码：</div>
        <div class="link-code">
          <input v-model="inputPwdCode" @keydown.enter="enterPwdCode">
        </div>
      </div>

      <div class="button" @click="enterPwdCode">确定</div>

    </div>
  </div>
</template>

<script lang="ts">
import { userinfo } from "@/lib/api/login/index.js";
import { loadfile, savefile, publishfile } from "@/lib/api/file";
import { shortlinklogin } from "@/lib/api/shortlink";
import Cookies from "js-cookie";
import DDeiEditor from "@/components/editor/Editor.vue";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditor as DDeiEditorCls} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import { debounce } from "lodash";
import { markRaw } from "vue";

import {DDeiEditorEnumBusCommandType} from "ddei-framework";

//引入插件
import { DDeiCoreTopMenuPanel,DDeiCoreThemeBlack, DDeiCoreControls,DDeiCoreHotkeys,DDeiKeyActionAllSelect,DDeiCorePropertyViewPanel,DDeiCoreToolboxPanel,DDeiCoreSheetsPanel, DDeiCoreChangeRatioPanel, DDeiCoreChangeRatioDialog,DDeiCoreShapeCountPanel, DDeiCoreBottomMenuPanel,DDeiCoreStandLayout, DDeiCoreOpenFilesViewPanel, DDeiCoreQuickColorViewPanel, DDeiCoreAlignDialog } from "@ddei/core";
import { DDeiExtTestConverters, DDeiExtTestStep1Converter, DDeiExtTestStep2Converter } from "@ddei/testconverter";
import DDeiExtUML from "@ddei/uml"
import DDeiExtFontTest from "@ddei/testfont"
export default {
  props: {},
  data() {
    
    return {

      publishPostData: null,
      inputPwdCode: "",
      loadMode: 0,//加载模式0，不加载
     
      options: markRaw({
        config: {
          EVENT_LOAD_FILE: this.openFile,
          EVENT_SAVE_FILE: this.saveFile,
          EVENT_GOBACK_FILE_LIST: this.goBackFileList,
          EVENT_PUBLISH_FILE: this.publishFile,
          EVENT_CONTROL_SELECT_AFTER: this.showQuickEditPicker,
          EVENT_MOUSE_OPERATING: this.mouseOperating,
        },
        //配置扩展插件
        extensions: [
          //布局的配置
          DDeiCoreStandLayout.configuraton({
            //配置插件
            'top': [DDeiCoreTopMenuPanel],
            'middle': [DDeiCoreOpenFilesViewPanel.configuraton({
              drag:true
            }),  'ddei-core-panel-canvasview' , 'ddei-core-panel-quickcolorview'],
          }),
          //特殊控件的配置
          DDeiCoreControls.configuraton({
            '100002': {
              border: { color: 'red', width: 3 }
            },
            '100001': {
              border: { color: 'yellow' }
            }
          }),
          DDeiExtFontTest,
          DDeiCoreThemeBlack.configuraton({
            default:true
          }),
          //批量快捷键配置
          // DDeiCoreHotkeys.configuraton({
          //   "ddei-core-keyaction-remove-models": {
          //     'keys': [
          //       { keys: "67" },
          //     ]
          //   },
          //   "ddei-core-keyaction-all-select": {
          //     'keys': [
          //       { keys: "68" },
          //     ]
          //   },
          // }),
          //某个快捷键的配置
          DDeiKeyActionAllSelect.configuraton({
            'keys': [
              {
                ctrl: 1, keys: "66"
              }
            ]
          }),
          
          // DDeiCoreBottomMenuPanel,
          DDeiCoreBottomMenuPanel.configuraton({
            'panels': [DDeiCoreSheetsPanel.configuraton({
              max:10
            }),, DDeiCoreShapeCountPanel.configuraton({
              title:"图形数:"
            }),
            "ddei-core-panel-bottom-managelayers", 
            DDeiCoreChangeRatioPanel.configuraton({
              delta:0.1,min:1,max:4,step:0.2,dialog:true,range:false
            })]
          }),
          DDeiCoreChangeRatioDialog.configuraton({
            dataSource: [
              { text: "200%", value: 2 },
              { text: "150%", value: 1.5 },
              { text: "125%", value: 1.25 },
              { text: "100%", value: 1 },
              { text: "75%", value: 0.75 },
              { text: "50%", value: 0.5 },
            ],
            input:true,
            min: 1, max: 4,title:"缩放比例"
          }),
          // DDeiCoreToolboxPanel.configuraton({
          //   custom: false,
          //   search: false,
          //   // customGroups: [302, 301, 102, 101],
          //   expand: false
          // }),
          DDeiCorePropertyViewPanel.configuraton({
            
            expand: false
          }),
          //引入扩展转换器插件
          DDeiExtTestConverters,
          DDeiExtTestStep2Converter.configuraton(
            {
              config: 21
            }
          ),

          
          // DDeiCoreBottomMenuPanel.configuraton({
          //   config: function (options: object) {
          //         options.panels.splice(0,1);
          //         return options;
          //       } }),
          // DDeiCore.configuraton({
          //   //配置插件
          //   "ddei-core-layout-standard": {
          //     'top': [
          //       // DDeiCoreTopMenuPanel.configuraton({ panels: ["ddei-core-panel-goback", "ddei-core-panel-fileinfo"] }),
          //       DDeiCoreTopMenuPanel,
          //       DDeiCoreTopMenuPanel.configuraton({ config: function(options:object){
          //         options.panels.splice(0,3);
          //         return options;
          //       } }),
          //     ],
          //     'middle': [DDeiCoreOpenFilesViewPanel,  'ddei-core-panel-canvasview' , 'ddei-core-panel-quickcolorview'],
          //   },
          // }),
          // DDeiCoreQuickColorViewPanel.configuraton({ testcolor: "red" }),
          // DDeiCoreAlignDialog.configuraton({ a: "1",b:2 }),
          // DDeiCoreTopMenuPanel.configuraton({ top: "123" }),
          // }),

          //加载UML插件
          DDeiExtUML
        ],
      }),
    };
  },
  //注册组件
  components: {
    DDeiEditor
  },
  created() {
    this.displayQuickDialog = debounce(this.displayQuickDialog, 200, { trailing: true, leading: false });
  },
  beforeMount() {
    let routePath = decodeURIComponent(this.$route.path)
    if (routePath.startsWith("/ss/")) {
      //获取短链接码
      let ssUrl = routePath.substring(4)
      let pwdCode = ''
      //获取URL中的验证码
      if (ssUrl.indexOf("码") != -1) {
        pwdCode = ssUrl.substring(ssUrl.indexOf(":") + 1)
        ssUrl = ssUrl.substring(0, ssUrl.indexOf("提"))
      }
      //加载获取短链接信息
      this.makeShortLinkLogin(ssUrl, pwdCode)
    } else {
      this.loadMode = 1
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 执行短链接登陆
     * @param ssUrl 
     * @param pwdCode 
     */
    makeShortLinkLogin(ssUrl, pwdCode) {
      shortlinklogin(ssUrl, pwdCode).then(ssResult => {
        if (ssResult.status == 200 && ssResult.data.code == 0 && ssResult.data.data) {
          // 缓存 token
          Cookies.set('token', ssResult.data.data.token)
          Cookies.set('refreshToken', ssResult.data.data.refreshToken)
          Cookies.set('tokenExp', ssResult.data.data.tokenExp)
          this.ssUrl = ssUrl
          this.getUserInfo().then(result => {
            let loadMode = 1
            if (result) {
              let userCookie = Cookies.get("user");
              if (userCookie) {
                let user = JSON.parse(userCookie)
                let sslink
                for (let i = 0; i < user?.sslinks?.length; i++) {
                  if (user.sslinks[i].url == this.ssUrl) {
                    sslink = user.sslinks[i]
                    break;
                  }
                }
                if (sslink?.state == 1) {
                  loadMode = 2
                } else if (sslink) {
                  //校验是否过期、是否输入了验证码等信息
                  if (sslink.end_type != 99) {
                    let nowTimeStr = DDeiUtil.formatDate(new Date(), "yyyy-MM-ddThh:MM:ss")
                    if (nowTimeStr >= sslink.end_time) {
                      loadMode = 3//超期
                    }
                  }
                  if (loadMode != 3 && sslink.state == 0) {
                    loadMode = 4//未输入验证码，要求输入验证码
                  }
                }
              }
            }
            this.loadMode = loadMode
          })
        } else {
          this.loadMode = 1
        }
      })
    },

    enterPwdCode() {
      this.makeShortLinkLogin(this.ssUrl, this.inputPwdCode)
    },
    /**
     * 查看前
     */
    viewBefore(operate, models, propName, ddInstance, evt) {
      models.forEach((model) => {
        console.log(
          "查看前:" + model.id + " 属性——" + propName + " .  " + model[propName]
        );
      });
      return true;
    },
    /**
     * 查看后
     */
    viewAfter(operate, models, propName, ddInstance, evt) {
      models.forEach((model) => {
        console.log(
          "查看:" + model.id + " 属性——" + propName + " .  " + model[propName]
        );
      });
    },
    /**
     * 编辑值前
     */
    editBefore(operate, models, propName, ddInstance, evt) {
      models.forEach((model) => {
        console.log(
          "准备编辑:" +
          model.id +
          " 属性——" +
          propName +
          " .  " +
          model[propName]
        );
      });
      return true;
    },
    /**
     * 编辑值后
     */
    editAfter(operate, models, propName, ddInstance, evt) {
      models.forEach((model) => {
        console.log(
          "编辑:" + model.id + " 属性——" + propName + " .  " + model[propName]
        );
      });
    },
    /**
     * 删除后
     */
    removeAfter(operate, models, propName, ddInstance, evt) {
      models.forEach((model) => {
        console.log("删除:" + model.id);
      });
    },


    /**
     * 选择前
     */
    selectBefore() {
      console.log("选择前");
      return true;
    },

    /**
     * 选择后，在选择控件的合适位置显示快捷编辑框
     */
    showQuickEditPicker(operateType, models, propName, ddInstance, evt) {
      if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
        let editor = DDeiEditorCls.ACTIVE_INSTANCE;
        let curState = editor.state
        //隐藏弹出框
        DDeiEditorUtil.closeDialog('ddei-core-dialog-quickpop')

        //显示弹出框
        if (models?.length > 0) {
          let height = 100;
          //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
          let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
          let left = modelPos.left + (modelPos.width / 2)
          let top = modelPos.top + (modelPos.height / 2)
          if (modelPos.top - height <= modelPos.cTop) {
            if (modelPos.height > 400) {
              top = top + height + 20
            } else {
              top = top + modelPos.height / 2 + 20;
            }
          } else {
            top = top - height;
          }
          if (top < 0) {
            top = modelPos.cTop + modelPos.cHeight / 2
          }

          if (left < 0) {
            left = 0
          }
          DDeiEditorUtil.showDialog('ddei-core-dialog-quickpop', {
            group: "canvas-pop"
          }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
          editor?.changeState(curState)
        }
      }
    },
    /**
     * 打开文件
     */
    async openFile(isReExec) {
      this.serverFunc = this.openFile
      this.serverFuncParam = 1
      if (isReExec) {
       
        let ddInstance = this.$refs.editorViewer.editor.ddInstance
        ddInstance.bus.push(DDeiEditorEnumBusCommandType.LoadFile)
        ddInstance.bus.executeAll();
      } else if (await this.getUserInfo(this.ssUrl)) {
        //普通文件打开
        let loadFileJSON = {}
        if (this.loadMode == 1) {
          //获取参数
          let fileId = this.$route.params.id;
          loadFileJSON.id = fileId
        } else if (this.loadMode == 2) {
          //获取参数
          let userCookie = Cookies.get("user");
          let user = JSON.parse(userCookie)
          let sslink
          for (let i = 0; i < user.sslinks?.length; i++) {
            if (user.sslinks[i].url == this.ssUrl) {
              sslink = user.sslinks[i]
              break;
            }
          }
          loadFileJSON.fv_id = sslink.fv_id
        }

        //根据ID获取文件的设计以及文件的信息
        let fileData = await loadfile(loadFileJSON);
        if (fileData.status == 200) {
          if (fileData.data.code == 0) {
            let returnData = fileData.data.data;
            //保存的业务ID
            returnData.extData = { busiid: "busi_" + returnData.id, owner: returnData.owner };
            let busiData = await this.loadBusiData();
            returnData.busiData = busiData;
            //加载业务信息，以用于显示填充数据
            return returnData;
          }
        }

      }



    },

    /**
     * 加载业务数据
     */
    async loadBusiData() {
      //加载业务数据并返回
      return {
        签名: "hoslay",
        签名64:
          "data:image/png;base64,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",
        签名URL: "https://www.baidu.com/img/flexible/logo/pc/result@2.png",
        日期: new Date().getTime(),
        发起人: "张三",
        类型: "差旅费报销",
        总金额: 23112.25,
        流程: [
          {
            名称: "发起",
            处理人: "张三",
            处理时间: "2023-01-01 23:12:12",
          },
          {
            名称: "审批",
            处理人: "李四",
            处理时间: "2023-01-02 09:13:13",
            意见: "同意",
          },
          {
            名称: "支付",
            处理人: "王五",
            处理时间: "2023-01-03 17:17:00",
            意见: "已打款至账户",
          },
          {
            名称: "办结",
            处理时间: "2023-01-03 17:17:00",
          },
        ],
        单据: [
          {
            开始日期: "12-15",
            结束日期: "12-15",
            餐费: 20,
            交通费: 36,
            备注: "07:35-21:30",
          },
          {
            开始日期: "12-16",
            结束日期: "12-16",
            餐费: 20,
            交通费: 37,
            备注: "09:00-23:00",
          },
          {
            开始日期: "12-17",
            结束日期: "12-17",
            餐费: 20,
            交通费: 40,
            备注: "09:00-22:00,送同事",
          },
          {
            开始日期: "12-18",
            结束日期: "12-18",
            餐费: 20,
            交通费: 35,
            备注: "08:30-21:30",
          },
          {
            开始日期: "12-19",
            结束日期: "12-20",
            餐费: 26,
            交通费: 30,
            备注: "09:00-00:00",
          },
          {
            开始日期: "12-21",
            结束日期: "12-21",
            餐费: 40,
            交通费: 38,
            备注: "09:00-23:00",
          },
        ],
      };
    },

    /**
     * 保存文件以及设计
     */
    async saveFile(designdata, file) {
      //根据ID获取文件的设计以及文件的信息
      if (designdata) {

        if (designdata.id && file.local != 1) {
          let postData = {
            id: designdata.id,
            name: designdata.name,
            code: designdata.code,
            desc: designdata.desc,
            thumb: designdata.thumb,
          };
          //删除提交数据中的缩略图
          delete designdata.thumb
          postData.content = JSON.stringify(designdata)
          if (await this.getUserInfo()) {
            let fileData = await savefile(postData);
            if (fileData.status == 200) {
              if (fileData.data.code == 0) {
                return { result: 1, msg: "" };
              } else {
                return { result: 2, msg: "保存失败" };
              }
            }
          } else {
            return { result: 2, msg: "保存失败" };
          }
        }
        //保存到本地还是服务器
        else {
          if (!file.localFileHandler) {
            file.localFileHandler = await showSaveFilePicker({
              description: "DDei Design File",
              suggestedName: designdata.name + ".dei",
              types: [{
                accept: {
                  "text/plain": [".dei"]
                }
              }]
            });
          }
          delete designdata.thumb
          file.local = 1
          await file.writeLocalFile(JSON.stringify(designdata))
          return { result: 1, msg: "" };
        }

      }
    },

    reExecFunc() {
      if (this.serverFunc) {
        this.serverFunc(this.serverFuncParam)
        delete this.serverFunc
        delete this.serverFuncParam
      } else {
        let ddInstance = this.$refs.editorViewer.editor.ddInstance
        ddInstance.bus.restoreQueue();
        ddInstance.bus.executeAll();
      }
    },

    /**
     * 保存文件以及设计并发布文件
     */
    async publishFile(designdata) {
      if (await this.getUserInfo()) {
        //根据ID获取文件的设计以及文件的信息
        this.publishPostData = null;
        if (designdata) {
          let postData = {
            id: designdata.id,
            name: designdata.name,
            code: designdata.code,
            desc: designdata.desc,
            version: designdata.version,
            thumb: designdata.thumb
          };
          //删除提交数据中的缩略图
          delete designdata.thumb
          postData.content = JSON.stringify(designdata)
          this.publishPostData = Object.freeze(postData);
          //缓存数据，弹出确认框进行确认
          this.showPublishFileDialog();
          //等待弹出框确认
          let dialogResult = await this.waitingPublishDialog();
          if (dialogResult == 1) {
            if (this.publishPostData) {
              let fileData = await publishfile(this.publishPostData);
              if (fileData.status == 200) {
                if (fileData.data.code == 0) {
                  return { result: 1, msg: "" };
                } else {
                  return { result: 2, msg: "发布失败" };
                }
              }
            }
          } else {
            return { result: 3, msg: "发布取消" };
          }
        } else {
          return { result: 2, msg: "发布失败" };
        }
      }
    },

    /**
     * 等待弹框确认
     */
    async waitingPublishDialog() {
      this.publishDialogState = 0;
      while (this.publishDialogState == 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      return this.publishDialogState;
    },

    /**
     * 正在进行鼠标操作
     */
    mouseOperating(operateType, models, ddInstance, evt) {
      if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
        DDeiEditorUtil.hiddenDialog('ddei-core-dialog-quickpop')
        if (operateType == "CHANGE_RATIO" || operateType == "CHANGE_WPV" || operateType == "CHANGE_BOUNDS" || operateType == "CHANGE_ROTATE") {
          this.displayQuickDialog();
        }
      }
    },

    /**
     * 拖拽前
     */
    dragBefore(operate, models, propName, ddInstance, evt) {
      if (DDei.beforeOperateValid(operate, models, propName, ddInstance, evt)) {
        if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
          DDeiEditorUtil.hiddenDialog('ddei-core-dialog-quickpop')
        }
        return true
      }
      return false
    },

    /**
     * 拖拽线节点前
     */
    dragLineBefore(operate, dragObj, ddInstance, evt) {
      if (DDei.beforeOperateValid(operate, [dragObj?.model], null, ddInstance, evt)) {
        if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
          DDeiEditorUtil.hiddenDialog('ddei-core-dialog-quickpop')
        }
        return true
      }
      return false
    },



    /**
     * 移动滚动条
     */
    changeWPV(oldValue, newValue, ddInstance) {
      if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
        DDeiEditorUtil.hiddenDialog('ddei-core-dialog-quickpop')
        this.displayQuickDialog();
      }
    },

    displayQuickDialog() {
      let editor = DDeiEditorCls.ACTIVE_INSTANCE;
      if (editor?.ddInstance?.stage?.selectedModels?.size > 0) {
        let models = Array.from(editor.ddInstance.stage?.selectedModels.values())
        if (models?.length > 0) {
          let height = 100;
          //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
          let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
          let left = modelPos.left + 20
          let top = modelPos.top
          if (modelPos.top - height <= modelPos.cTop) {
            if (modelPos.height > 400) {
              top = top + height + 20
            } else {
              top = top + modelPos.height + 20;
            }
          } else {
            top = top - height;
          }
          if (top < 0) {
            top = modelPos.cTop + modelPos.cHeight / 2
          }
          if (left < 0) {
            left = 0
          }


          DDeiEditorUtil.displayDialog('ddei-core-dialog-quickpop', null, { type: 99, left: left, top: top, hiddenMask: true })
        }
      }
    },

    /**
     * 改变缩放大小
     */
    changeRatio(oldValue, newValue, ddInstance) {
      if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
        DDeiEditorUtil.hiddenDialog('ddei-core-dialog-quickpop')
        this.displayQuickDialog();
      }
    },

    /**
     * 确认发布文件
     */
    submitPublishFile() {
      this.publishDialogState = 1;
    },
    /**
     * 取消发布文件
     */
    cancelPublishFile() {
      this.publishDialogState = 2;
    },

    /**
     * 返回文件列表页
     */
    goBackFileList() {
      this.$router.push({
        path: "/",
      });
    },

    goBackLogin() {
      Cookies.remove("token");
      Cookies.remove("user");
      this.$router.push({
        path: "/login",
      });
    },

    /**
     * 弹出发布文件弹出框
     */
    showPublishFileDialog() {
      DDeiEditorUtil.showDialog("ddei-core-dialog-publishfile", {
        msg: '是否发布"' + this.publishPostData?.name + ' V' + this.publishPostData?.version + '"？',
        callback: {
          cancel: this.cancelPublishFile,
          ok: this.submitPublishFile,
        },
        background: "white",
        opacity: "1%",
        event: -1
      })
    },
    /**
     * 获取登录用户信息
     */
    async getUserInfo() {
      try {
        let response = await userinfo(this.ssUrl)
        let userJSON = response.data.data;
        let user = JSON.stringify(userJSON, null, 4);
        Cookies.set("user", user);
        return true;
      } catch (e) {
        Cookies.remove("token");
        //弹出登录弹出框
        DDeiEditorUtil.showDialog("ddei-core-dialog-relogin", {
          icon: "#icon-a-ziyuan411",
          msg: "当前登录状态已失效，请重新登录.",
          callback: {
            abort: this.clearServerFunc,
            ok: this.reExecFunc
          },
          background: "white",
          opacity: "1%",
          event: -1
        })
        return false;
      };
    },


    clearServerFunc() {
      delete this.serverFunc
      delete this.serverFuncParam
    },
    toLogin() {
      this.$router.push({
        path: this.$route.query.redirect || "/login",
      });
    }
  },
};
</script>
<style lang="less" scoped>
/* .删除文件弹框 */
.publish_file_dialog {
  z-index: 99;
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: calc(100vh);

  .content {
    position: absolute;
    width: 300px;
    height: 180px;
    left: calc(50% - 150px);
    top: calc(50% - 90px);
    background: #fff;
    border-radius: 10px;
    text-align: center;
    font-size: 17px;
    color: black;

    .title {
      width: 100%;
      font-size: 20px;
      color: #3662ec;
      text-align: center;
      margin-top: 15px;
    }

    .content_input {
      width: 80%;
      height: 30px;
      font-size: 18px;
    }

    .msg {
      width: 100%;
      height: 20px;
      font-size: 12px;
      color: red;
      text-align: right;
      padding-right: 30px;
    }

    .buttons {
      width: 80%;
      display: block;
      margin: auto;

      >div {
        width: 45%;
        height: 40px;
        cursor: pointer;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        padding-top: 6px;

        >span {
          font-size: 15px;
          color: white;
          text-align: center;
          pointer-events: none;
        }
      }

      .button_ok {
        background-color: #3662ec;
        border-color: #3662ec;
        float: left;
      }

      .button_cancel {
        background-color: rgb(210, 210, 210);
        border-color: rgb(210, 210, 210);
        float: right;
      }
    }
  }
}

/**以下为询问框的样式 */
.ddei_sslink_outtime {
  width: 100%;
  height: calc(100vh);
  color: black;
  background: #FFFFFF;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    display: flex;
    flex-direction: column;

    .header {
      flex: 0 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      margin-top: 10px;
      color: #000000;

      .icon {
        font-size: 30px;
        margin-right: 10px;
      }

      .goback {
        margin-left: 10px;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
}



.ddei_sslink_enterpwd {
  width: 100%;
  height: calc(100vh);
  color: black;
  background: #FFFFFF;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    border: 2px solid #176EFF;
    border-radius: 4px;
    width: 420px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 24px;

    .header {
      flex: 0 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      margin-top: 10px;
      color: #000000;

      .icon {
        font-size: 30px;
      }



    }


    .field {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;


      .link-code-title {
        flex: 0 0 100px;
        height: 30px;
        padding-left: 10px;
        text-align: left;
        font-size: 20px;
      }


      .link-code {
        flex: 0 0 120px;
        border: 1px solid #176EFF;
        border-radius: 4px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        >input {
          flex: 0 0 80px;
          outline: none;
          background: none;
          border: none;
          width: 80px;
          font-size: 20px;
        }
      }
    }

    .button {
      width: 200px;
      height: 40px;
      background: #FFFFFF;
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      font-size: 20px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: #040404;
      margin-left: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: #176EFF;
      margin-bottom: 10px;

    }

    .button:hover {
      cursor: pointer;
    }

  }



}
</style>
