import {DDeiEditorArrtibute} from 'ddei-framework';
import { cloneDeep } from 'lodash'
import {DDeiUtil} from 'ddei-framework';
import { markRaw } from "vue"

const ToDefaultPropertys = ["fill.type", "fill.color", "fill.image", "fill.opacity", "border.type", "border.color", "borderOpacity", "borderWidth", "borderDash", "borderRound",
  "font.family", "font.size", "font.color", "fontAlign", "textStyle.feed"
  , "textStyle.scale", "textStyle.hollow", "textStyle.bold", "textStyle.italic"
  , "textStyle.underline", "textStyle.deleteline", "textStyle.topline", "textStyle.hspace", "textStyle.vspace"]

//将属性转换为更深的groups中
const parseAttrsToGroup = function (control) {
  
  if (control.attrs) {
    control.attrs.forEach(curAttr => {
      
      let attrDefine = new DDeiEditorArrtibute(curAttr);
      //在define中寻找样式值，如果有值，作为属性缺省值，再删除属性
      if (ToDefaultPropertys.indexOf(curAttr.code) != -1) {
        let defValue = DDeiUtil.getDataByPathList(control.define, curAttr.code, curAttr.mapping);
        if (defValue || defValue == 0) {
          attrDefine.defaultValue = defValue
        }
      }

      //将属性加入控件的属性map
      if (!control.attrDefineMap) {
        control.attrDefineMap = new Map();
      }
      control.attrDefineMap.set(curAttr.code, attrDefine);
    });
  }
  control.groups?.forEach(group => {
    group.subGroups?.forEach(subGroup => {
      let attrs = []
      subGroup.attrs?.forEach(attrCode => {
        let attrDefine = control.attrDefineMap.get(attrCode)
        if (attrDefine) {
          attrDefine.topGroup = group
          attrDefine.modelCode = control.id
          attrs.push(attrDefine);

        }
      });
      subGroup.children = attrs
    });
  });

}

const loadControlByFrom = function (controlOriginDefinies: Map<string, object>, control: object) {
  
  if (control.from && !control.def) {
    
    let fromControl = controlOriginDefinies.get(control.from)
    if (fromControl.from) {
      loadControlByFrom(controlOriginDefinies, fromControl)
    }
    control.attrs = cloneDeep(fromControl.attrs)
    control.groups = cloneDeep(fromControl.groups)
    let fromMenus = cloneDeep(fromControl.menus)
    let fromDefine = cloneDeep(fromControl.define)
    let fromFilters = cloneDeep(fromControl.filters)
    //合并控件自身与from组件的define、menu
    if (fromDefine) {
      if (!control.define) {
        control.define = {};
      }
      for (let i in fromDefine) {
        if (!(control.define[i] || control.define[i] == 0)) {
          control.define[i] = fromDefine[i]
        }
      }
      
    }
    if (fromFilters){
      if (!control.filters) {
        control.filters = fromFilters
      }else{
        for (let k in fromFilters){
          if (!control.filters[k]){
            control.filters[k] = fromFilters[k]
          }
        }
      }
    }

    //处理ext
    loadControlDefineExt(control)
    
    

    //处理composes
    loadControlDefineComposes(controlOriginDefinies,control)
   

    //处理others
    loadControlOthers(controlOriginDefinies, control)

    if (fromMenus) {
      if (!control.menus) {
        control.menus = {};
      }
      for (let i in fromMenus) {
        if (!(control.menus[i] || control.menus[i] == 0)) {
          control.menus[i] = fromMenus[i]
        }
      }
    }

    control.menus = fromMenus
    control.attrDefineMap = new Map()
    if (!control.type && control.type != fromControl.type) {
      control.type = fromControl.type
    }
    
    
   

    

    controlOriginDefinies.set(control.id, control);
  }
  if (control.viewer) {
    control.viewer = markRaw(control.viewer)
  }
  parseAttrsToGroup(control)
  control.def = true;
};

const loadControlOthers = function (controlOriginDefinies, control) {
  if (control.others) {
    control.others.forEach(other => {
      let otherControlDefine = controlOriginDefinies.get(other.id)
      if (otherControlDefine.from) {
        loadControlByFrom(controlOriginDefinies, otherControlDefine)
      }
      other.code = otherControlDefine.code
      let otherDefine = cloneDeep(otherControlDefine.define)
      //合并控件自身与from组件的define、menu
      if (otherDefine) {
        for (let i in otherDefine) {
          if (!other.define) {
            other.define = {}
          }
          if (!(other.define[i] || other.define[i] == 0)) {
            other.define[i] = otherDefine[i]
          }
        }
      }
      other.type = otherControlDefine.type
      other.others = otherControlDefine.others
      loadControlOthers(controlOriginDefinies, other)
    });
  }
}



const loadAndSortGroup = function (groups, controlOriginDefinies){
  let groupOriginDefinies = []
  //组的定义
  groups.forEach(group => {
    //读取控件的信息,将实际的控件读取进到group中
    if (group.controls) {
      let cos = [];
      group.controls.forEach(control => {
        let id = control.id;
        let controlDefine = controlOriginDefinies.get(id);
        if (controlDefine) {
          //复制控件定义
          let c = cloneDeep(controlDefine);
          //复写group中定义的属性
          for (let i in control) {
            if (control[i] != undefined && control[i] != null) {
              c[i] = control[i];
            }
          }
          //处理属性
          cos.push(c);
        }
      });
      // 内部控件排序
      cos.sort((a, b) => {
        return a.orderNo - b.orderNo
      })
      group.controls = cos;
    }
    group.display = true
    groupOriginDefinies.push(group)
  });

  //对分组进行排序
  groupOriginDefinies.sort((a, b) => {
    return a.orderNo - b.orderNo
  })

  return groupOriginDefinies;
}

const loadControlDefineComposes = function (controlOriginDefinies,control){
  if (control.define?.composes) {
    control.define?.composes.forEach(compose => {
      let composeControlDefine = controlOriginDefinies.get(compose.id)
      if (composeControlDefine.from) {
        loadControlByFrom(controlOriginDefinies, composeControlDefine)
      }
      compose.attrs = cloneDeep(composeControlDefine.attrs)
      let composeDefine = cloneDeep(composeControlDefine.define)
      //合并控件自身与from组件的define、menu
      if (composeDefine) {

        for (let i in composeDefine) {
          if (!(compose[i] || compose[i] == 0)) {
            compose[i] = composeDefine[i]
          }
        }
      }
    });
  }
}

const loadControlDefineExt = function(control){
  if (control.define?.ext) {

    for (let i in control.define.ext) {
      switch (i) {
        case "composes": {
          let extComps = control.define?.ext.composes
          let defineComps = control.define.composes
          for (let j = 0; j < extComps.length; j++) {
            let extComp = extComps[j]
            let defComp = defineComps[j]
            //替换当前部分值
            if (defComp && !extComp.type) {
              for (let k in extComp) {
                defComp[k] = extComp[k]
              }
            }
          }
          break;
        }
        case "ovs": {
          let extOVS = control.define?.ext.ovs
          let defineOVS = control.define.ovs
          for (let j = 0; j < extOVS.length; j++) {
            let extComp = extOVS[j]
            let defComp = defineOVS[j]
            //替换当前部分值
            if (defComp && extComp) {
              for (let k in extComp) {
                defComp[k] = extComp[k]
              }
            }
          }
          break;
        }
        case "sample": {
          if (!control.define?.sample) {
            control.define.sample = {}
          }
          for (let j in control.define.ext.sample) {

            if (j != 'rules') {
              control.define.sample[j] = control.define.ext.sample[j]
            } else {
              if (!control.define.sample.rules) {
                control.define.sample.rules = []
              }
              control.define.ext.sample[j].forEach(rule => {
                control.define.sample.rules.push(rule)
              });
            }
          }
          break;
        }
        case "attrs": {
          let extAttrs = control.define.ext.attrs;
          extAttrs?.forEach(extAttr => {
            let append = true
            for (let x = 0; x < control.attrs.length; x++) {
              //覆盖
              if (control.attrs[x].code == extAttr.code) {
                control.attrs[x] = extAttr
                append = false;
                break;
              }
            }
            if (append) {
              control.attrs.push(extAttr)
            }
          });
          break;
        }
        case "groups": {
          //覆盖
          let extGroups = control.define.ext.groups;
          control.groups = extGroups
          break;
        }
        default: {
          control.define[i] = control.define.ext[i]
          break;
        }
      }

    }
    delete control.define.ext
  }
}



export { loadControlByFrom, loadAndSortGroup, loadControlDefineExt, loadControlDefineComposes };
