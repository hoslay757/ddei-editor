<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-ext-dialog-quickchoosecontrol" v-if="forceRefresh">
    <div v-for="group in groups" v-show="group.display == true" class="ddei-ext-dialog-quickchoosecontrol-group">
      <div class="ddei-ext-dialog-quickchoosecontrol-group-itempanel"
        v-if="customControls || customGroups || group.expand == true">
        <div class="ddei-ext-dialog-quickchoosecontrol-group-itempanel-item" :title="control.desc"
          v-for="control in group.controls" @click="quickCreateControl(control.id)">
          <img class="icon" :src="editor?.icons[control.id]" />
          <div class="text">{{ control.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DDeiAbstractShape } from "ddei-framework";
import { DDeiEditorUtil } from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-ext-dialog-quickchoosecontrol",
  extends: null,
  mixins: [DialogBase],
  props: {
    options: {
      type: Object,
      default: null
    },
    //定义分组
    customGroups: {
      type: Array,
      default: null
    },
    //定义控件
    customControls: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
      dialogId: 'ddei-ext-dialog-quickchoosecontrol',
      //分组数据
      groups: []
    };
  },
  computed: {},
  components: {  },
  watch: {},
  created() { },
  mounted() {
    this.refreshData();
    
  },
  methods: {
    refreshData(){
      
      //加载工具栏
      let groups = this.editor.groups
      if (this.customControls) {
        let controls = []
        let gps = [{display:true,controls:controls}]
        let hasControlids = {}
        groups.forEach(group => {
          group?.controls?.forEach(control => {
            if (!hasControlids[control.id] && this.customControls.indexOf(control.id) != -1){
              hasControlids[control.id] = true
              controls.push(control)
            }
          });
        })
        this.groups = gps
      }else if (this.customGroups) {
        let newGroups = []
        this.customGroups?.forEach(cg => {
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].id == cg) {
              newGroups.push(groups[i])
              break;
            }
          }

        });
        this.groups = newGroups
      }else{
        DDeiEditorUtil.readRecentlyToolGroups()
        let hisGroups = DDeiEditorUtil.recentlyToolGroups;
        let gps = []
        if (hisGroups?.length > 0) {

          hisGroups.forEach(hg => {
            let group = null;
            for (let i = 0; i < groups.length; i++) {
              if (groups[i].id == hg.id) {
                group = groups[i]
                break;
              }
            }
            if (group) {
              group.expand = hg.expand
              gps.push(group)
            }
          })
          
          this.groups = gps;
        }
      }
    },

    quickCreateControl(controlId){
      if (controlId && this.editor.tempPopData['ddei-ext-dialog-quickchoosecontrol']){
        let model = this.editor.tempPopData['ddei-ext-dialog-quickchoosecontrol'].model
        let type = this.editor.tempPopData['ddei-ext-dialog-quickchoosecontrol'].type
        if (model){
          let outRect = DDeiAbstractShape.getOutRectByPV([model])
          let controls = this.editor.addControls([
            {
              model: controlId
            },
          ],true,false)
          //添加后的控件坐标，将其移动到特定位置
          let outRect1 = DDeiAbstractShape.getOutRectByPV(controls)
          let x,y,sx,sy,ex,ey
          let  startSita, endSita
          let weight = 60
          //创建控件
          if(type == 1){
            x = (outRect.x+outRect.x1)/2
            y = outRect.y - weight - outRect1.height / 2
            sx = x
            sy = outRect.y
            ex = x
            ey = y + outRect1.height / 2
            startSita = -90
            endSita = 90
          } else if (type == 2) {
            x = outRect.x1 + weight + outRect1.width/2,
            y =(outRect.y1 + outRect.y) / 2 
            sx = outRect.x1
            sy = y
            ex = x - outRect1.width / 2
            ey = y   
            startSita = 0
            endSita = 180
          } else if (type == 3) {
            x = (outRect.x + outRect.x1) / 2,
            y = outRect.y1 + weight + outRect1.height / 2
            sx = x
            sy = outRect.y1
            ex = x
            ey = y - outRect1.height / 2
            startSita = 90
            endSita = -90
          } else if (type == 4) {
            x = outRect.x - weight -outRect1.width/2
            y = (outRect.y1 + outRect.y) / 2  
            sx = outRect.x 
            sy = y
            ex = x+outRect1.width / 2
            ey = y 
            startSita = 180
            endSita = 0
          }
          controls[0].setPosition({x:x,y:y})
          //创建连线
          this.editor.addLines([
            {
              model:'100401',
              type:2,
              startPoint: {x:sx,y:sy},
              endPoint: {x:ex,y:ey},
              smodel: { id: model.id,x:sx,y:sy ,rate:0.5,sita:startSita},
              emodel:{id:controls[0].id,x:ex,y:ey,rate:0.5,sita:endSita}
            },
          ],true,false,false)
          this.editor.ddInstance.stage.makeSelectModels(controls);
          this.editor.ddInstance.stage.notifyChange()
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-dialog-quickchoosecontrol {
  border: 1px solid var(--panel-border); 
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25); 
  border-radius: 6px;
  display: none;
  overflow: auto;
  position: absolute;
  background-color: var(--panel-background);
  height: 240px;
  width:240px;
  z-index: 1999;
  user-select: none;
  color: var(--panel-title);

  &-group{
    &-itempanel {
        display: flex;
        flex-flow: row wrap;
        background: var(--toolbox-background);
        padding: 15px 15px 15px 15px;
    
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
        }
      }
  }
}
</style>
