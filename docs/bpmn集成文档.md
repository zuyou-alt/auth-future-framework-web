## Bpmn.js集成文档

### 1. 官网及参考

###### [Github-Bpmn.js](https://github.com/bpmn-io/bpmn-js)：Bpmn.js的github代码仓库地址

###### [Github-Bpmn-Examples](https://github.com/bpmn-io/bpmn-js-examples)：Bpmn.js的github的列子

###### [掘金全网最详bpmn.js教材目录](https://juejin.cn/post/6844904017567416328)：二次开发集成参考

### 2. 项目技术版本

###### 项目情况： vue+ts+vite+element-plus

###### Bpmn.js引用版本（package.json）：

```
"@bpmn-io/properties-panel": "^3.13.0",
"bpmn-js": "^16.3.2",
"bpmn-js-properties-panel": "^5.6.1",
"bpmn-moddle": "^6.0.0",
"camunda-bpmn-moddle": "^7.0.1",
```

### 3. 集成代码

```js
<template>
  <div class="designer-container">
    <div id="container" class="containerBox"></div>
    <div id="js-properties-panel" class="panel">
      <div class="custom-properties-panel">
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { markRaw, onMounted, ref } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from "bpmn-js-properties-panel";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
const bpmnModeler = ref<any>({});
onMounted(() => {
  bpmnModeler.value = markRaw(
    new BpmnModeler({
      container: "#container",//设置容器document
      propertiesPanel: {// 设置控制面板
        parent: "#js-properties-panel"
      },
      additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule] //添加模块 右侧工具栏
    })
  );
  bpmnModeler.value.createDiagram(); //默认初始化画板
});
</script>
<style lang="scss" scope>
@import "./index.scss";
</style>
```

![image-20240124141148563](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124141148563.png)

### 4. 汉化

#### 4.1 创建zh.js汉化文件

```js
export default {
  "Activate global connect tool": "激活全局连接工具",
  "Append {type}": "添加 {type}",
  "Add lane above": "在上面添加道",
  "Divide into two lanes": "分割成两个道",
  "Divide into three lanes": "分割成三个道",
  "Add Lane below": "在下面添加道",
  "Append compensation activity": "追加补偿活动",
  "Change type": "修改类型",
  "Connect using association": "使用关联连接",
  "Connect using sequence/message flow or association": "使用顺序/消息流或者关联连接",
  "Connect using dataInput association": "使用数据输入关联连接",
  "Change element": "修改类型",
  Remove: "移除",
  "Activate hand tool": "激活抓手工具",
  "Activate lasso tool": "激活套索工具",
  "Activate create/remove space tool": "激活创建/删除空间工具",
  "Create expanded sub process": "创建扩展子过程",
  "Create intermediate/boundary event": "创建中间抛出事件/边界事件",
  "Create pool/participant": "创建池/参与者",
  "Parallel multi instance": "并行多重事件",
  "Sequential multi instance": "时序多重事件",
  "Data object reference": "数据对象参考",
  "Data store reference": "数据存储参考",
  Loop: "循环",
  "Ad-hoc": "即席",
  "Create {type}": "创建 {type}",
  Task: "任务",
  "Send task": "发送任务",
  "Receive task": "接收任务",
  "User task": "用户任务",
  "Manual task": "手工任务",
  "Business rule task": "业务规则任务",
  "Service task": "服务任务",
  "Script task": "脚本任务",
  "Call activity": "调用活动",
  "Sub-process (collapsed)": "子流程（折叠的）",
  "Sub-process (expanded)": "子流程（展开的）",
  "Start event": "开始事件",
  StartEvent: "开始事件",
  "Intermediate throw event": "中间事件",
  "End event": "结束事件",
  endEvent: "结束事件",
  "Create gateway": "创建网关",
  "Create intermediate/boundary event": "创建中间/边界事件",
  "Message start event": "消息开始事件",
  "Timer start event": "定时开始事件",
  "Conditional start event": "条件开始事件",
  "Signal start event": "信号开始事件",
  "Error start event": "错误开始事件",
  "Escalation start event": "升级开始事件",
  "Compensation start event": "补偿开始事件",
  "Message Start event (non-interrupting)": "消息开始事件（非中断）",
  "Timer Start event (non-interrupting)": "定时开始事件（非中断）",
  "Conditional start event (non-interrupting)": "条件开始事件（非中断）",
  "Signal Start event (non-interrupting)": "信号开始事件（非中断）",
  "Escalation start event (non-interrupting)": "升级开始事件（非中断）",
  "Message intermediate catch event": "消息中间捕获事件",
  "Message intermediate throw event": "消息中间抛出事件",
  "Timer intermediate catch event": "定时中间捕获事件",
  "Escalation untermediate throw event": "升级中间抛出事件",
  "Conditional intermediate catch event": "条件中间捕获事件",
  "Link intermediate catch event": "链接中间捕获事件",
  "Link intermediate throw event": "链接中间抛出事件",
  "Compensation intermediate throw event": "补偿中间抛出事件",
  "Signal intermediate catch event": "信号中间捕获事件",
  "Signal intermediate throw event": "信号中间抛出事件",
  "Message end event": "消息结束事件",
  "Escalation end event": "定时结束事件",
  "Error end event": "错误结束事件",
  "Cancel end event": "取消结束事件",
  "Compensation end event": "补偿结束事件",
  "Signal end event": "信号结束事件",
  "Terminate end event": "终止结束事件",
  "Message boundary event": "消息边界事件",
  "Message boundary event (non-interrupting)": "消息边界事件（非中断）",
  "Timer boundary event": "定时边界事件",
  "Timer boundary event (non-interrupting)": "定时边界事件（非中断）",
  "Escalation boundary event": "升级边界事件",
  "Escalation boundary event (non-interrupting)": "升级边界事件（非中断）",
  "Conditional boundary event": "条件边界事件",
  "Conditional boundary event (non-interrupting)": "条件边界事件（非中断）",
  "Error boundary event": "错误边界事件",
  "Cancel boundary event": "取消边界事件",
  "Signal boundary event": "信号边界事件",
  "Signal boundary event (non-interrupting)": "信号边界事件（非中断）",
  "Compensation boundary event": "补偿边界事件",
  "Exclusive gateway": "互斥网关",
  "Parallel gateway": "并行网关",
  "Inclusive gateway": "相容网关",
  "Complex gateway": "复杂网关",
  "Event based gateway": "事件网关",
  Transaction: "转运",
  "Sub process": "子流程",
  "Event Sub process": "事件子流程",
  "Collapsed Pool": "折叠池",
  "Expanded Pool": "展开池",
  "no parent for {element} in {parent}": "在{parent}里，{element}没有父类",
  "no shape type specified": "没有指定的形状类型",
  "flow elements must be children of pools/participants": "流元素必须是池/参与者的子类",
  "out of bounds release": "out of bounds release",
  "more than {count} child lanes": "子道大于{count} ",
  "element required": "元素不能为空",
  "diagram not part of bpmn:Definitions": "流程图不符合bpmn规范",
  "no diagram to display": "没有可展示的流程图",
  "no process or collaboration to display": "没有可展示的流程/协作",
  "element {element} referenced by {referenced}#{property} not yet drawn": "由{referenced}#{property}引用的{element}元素仍未绘制",
  "already rendered {element}": "{element} 已被渲染",
  "failed to import {element}": "导入{element}失败",
  Id: "编号",
  Name: "名称",
  General: "常规",
  Details: "详情",
  "Message Name": "消息名称",
  Message: "消息",
  Initiator: "创建者",
  "Asynchronous Continuations": "持续异步",
  "Asynchronous Before": "异步前",
  "Asynchronous After": "异步后",
  "Job Configuration": "工作配置",
  Exclusive: "排除",
  "Job Priority": "工作优先级",
  "Retry Time Cycle": "重试时间周期",
  Documentation: "文档",
  "Element Documentation": "元素文档",
  "History Configuration": "历史配置",
  "History Time To Live": "历史的生存时间",
  Forms: "表单",
  "Form Key": "表单key",
  "Form Fields": "表单字段",
  "Business Key": "业务key",
  "Form Field": "表单字段",
  ID: "编号",
  Type: "类型",
  Label: "名称",
  "Default Value": "默认值",
  Validation: "校验",
  "Add Constraint": "添加约束",
  Config: "配置",
  Properties: "属性",
  "Add Property": "添加属性",
  Value: "值",
  Listeners: "监听器",
  "Execution Listener": "执行监听",
  "Event Type": "事件类型",
  "Listener Type": "监听器类型",
  "Java Class": "Java类",
  Expression: "表达式",
  "Must provide a value": "必须提供一个值",
  "Delegate Expression": "代理表达式",
  Script: "脚本",
  "Script Format": "脚本格式",
  "Script Type": "脚本类型",
  "Inline Script": "内联脚本",
  "External Script": "外部脚本",
  Resource: "资源",
  "Field Injection": "字段注入",
  Extensions: "扩展",
  "Input/Output": "输入/输出",
  "Input Parameters": "输入参数",
  "Output Parameters": "输出参数",
  Parameters: "参数",
  "Output Parameter": "输出参数",
  "Timer Definition Type": "定时器定义类型",
  "Timer Definition": "定时器定义",
  Date: "日期",
  Duration: "持续",
  Cycle: "循环",
  Signal: "信号",
  "Signal Name": "信号名称",
  Escalation: "升级",
  Error: "错误",
  "Link Name": "链接名称",
  Condition: "条件名称",
  "Variable Name": "变量名称",
  "Variable event": "变量事件",
  "Specify more than one variable change event as a comma separated list.": "多个变量事件以逗号隔开",
  "Wait for Completion": "等待完成",
  "Activity Ref": "活动参考",
  "Version Tag": "版本标签",
  Executable: "可执行文件",
  "External Task Configuration": "扩展任务配置",
  "Task Priority": "任务优先级",
  External: "外部",
  Connector: "连接器",
  "Must configure Connector": "必须配置连接器",
  "Connector Id": "连接器编号",
  Implementation: "实现方式",
  "Field injections": "字段注入",
  Fields: "字段",
  "Result variable": "结果变量",
  Topic: "主题",
  "Configure connector": "配置连接器",
  "Input parameter": "输入参数",
  Assignee: "代理人",
  "Candidate Users": "候选用户",
  "Candidate Groups": "候选组",
  "Due Date": "到期时间",
  "Follow Up Date": "跟踪日期",
  "Specify more than one group as a comma separated list.": "多个用户使用逗号隔开",
  Priority: "优先级",
  // eslint-disable-next-line no-template-curly-in-string
  "The follow up date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)": "跟踪日期必须符合EL表达式，如： ${someDate} ,或者一个ISO标准日期，如：2015-06-26T09:54:00",
  // eslint-disable-next-line no-template-curly-in-string
  "The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)": "跟踪日期必须符合EL表达式，如： ${someDate} ,或者一个ISO标准日期，如：2015-06-26T09:54:00",
  Variables: "变量",
  "Candidate Starter Users": "选择启动候选人",
  "Candidate Starter Configuration": "候选人启动器配置",
  "Candidate Starter Groups": "候选人启动组",
  "This maps to the process definition key.": "编号将映射到流程主键.",

  save: "保存",
  Tools: "工具",
  "flow gateway": "流程网关",
  "Process control": "流程节点",
  "User task": "用户任务",
  "Create start event": "开始节点",
  "Create end event": "结束节点",
  "Create exclusive gateway": "互斥网关",
  "Create parallel gateway": "并行网关",
  "Create task": "任务节点",
  "Create user task": "用户任务节点",
  "Condition Type": "条件类型",
  "Create group": "创建组",
  "Create data object reference": "创建数据对象引用",
  "Create data store reference": "创建数据存储引用",
  "Append task": "添加任务",
  "Append end event": "追加结束事件节点",
  "Append gateway": "追加网关节点",
  "Append user task": "追加用户任务节点",
  "Append intermediate/boundary event": "追加中间或边界事件",
  "Append text annotation": "追加文本批注" // 此句要有效，必须在CustomContexPadProvide给此节点增加一个translate('Append TextAnnotation')
};
```

#### 4.2 创建translate.js引用文件

```js
import translations from "./zh";

export default function customTranslate(template, replacements) {
  replacements = replacements || {};
  template = translations[template] || template;
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || "{" + key + "}";
  });
}
```

#### 4.3 初始化时加入汉化模块

![image-20240124141511908](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124141511908.png)

![image-20240124141559333](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124141559333.png)

### 5. 自定义右侧操作栏

注：我并没有像网上一样引用组件啥的来定义。我直接重写了右侧区域。然后使用监听eventBus的点击事件，来改变右侧的配置信息

#### 5.1 加入代码

![image-20240124141835795](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124141835795.png)

#### 5.2 使用

![image-20240124142208540](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124142208540.png)

#### 5.3 监听eventBus

```js
onMounted(() => {
  bpmnModeler.value = markRaw(
    new BpmnModeler({
      container: "#container",
      // 添加控制板
      propertiesPanel: {
        parent: "#js-properties-panel"
      },
      additionalModules: [customTranslateModule]
    })
  );
  bpmnModeler.value.createDiagram();
  // 注册事件监听
  registerEventBus();
});
```

```js
const registerEventBus = () => {
  // 获取bpmn.js的EventBus。通过打印eventBus可以查看支持的所有EventBus： console.log(eventBus);
  const eventBus: EventBus = bpmnModeler.value.get("eventBus");
  // 注册节点事件，eventTypes中可以写多个事件，需要哪些写那些
  const eventTypes = ["element.click"];
  eventTypes.forEach(eventType => {
    eventBus.on(eventType, (e: { element: any }) => {
      const { element } = e;
      if (!element.parent) return;
      if (!e || element.type === "bpmn:Process") {
        return false;
      } else {
        if (eventType === "element.click") {
          // TODO 节点点击后想要做的处理
          console.log("点击的节点数据", element);
        }
      }
    });
  });
};
```

#### 5.5 引入已有的xml文件

**creteXml**方法，调用bpmnModeler.value.importXML（）方法

```js
const creteXml = () => {
  bpmnModeler.value.importXML(`这里粘贴xml文件的字符串`);
};
```

#### 5.6 获取画好流程图的xml文件

```js
const downloadXml = () => {
  bpmnModeler.value.saveXML({ format: true }).then(res => {
    console.log("画出的xml数据为", res);
  });
};
```

#### 5.7 效果

![image-20240124142657451](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124142657451.png)

#### 5.8 完整代码

index.vue

```vue
<template>
  <div class="designer-container">
    <div id="container" class="containerBox"></div>
    <div id="js-properties-panel" class="panel">
      <div class="custom-properties-panel">
        <div style="background-color: green; height: 400px">
          <el-row class="mb-4">
            <el-button>Default</el-button>
            <el-button type="primary" @click="downloadXml">点击下载xml</el-button>
            <el-button type="success" @click="creteXml">导入文件</el-button>
            <el-button type="info">Info</el-button>
            <el-button type="warning">Warning</el-button>
            <el-button type="danger">Danger</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, onMounted, ref } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import translate from "@/views/bpmn/custom/translate/translate";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css"; // 右边工具栏样式
import EventBus from "diagram-js/lib/core/EventBus";
let customTranslateModule = {
  translate: ["value", translate]
};
const bpmnModeler = ref<any>({});
onMounted(() => {
  bpmnModeler.value = markRaw(
    new BpmnModeler({
      container: "#container",
      // 添加控制板
      propertiesPanel: {
        parent: "#js-properties-panel"
      },
      additionalModules: [customTranslateModule]
    })
  );
  bpmnModeler.value.createDiagram();
  // 注册事件监听
  registerEventBus();
});

const registerEventBus = () => {
  // 获取bpmn.js的EventBus。通过打印eventBus可以查看支持的所有EventBus： console.log(eventBus);
  const eventBus: EventBus = bpmnModeler.value.get("eventBus");
  // 注册节点事件，eventTypes中可以写多个事件，需要哪些写那些
  const eventTypes = ["element.click"];
  eventTypes.forEach(eventType => {
    eventBus.on(eventType, (e: { element: any }) => {
      const { element } = e;
      if (!element.parent) return;
      if (!e || element.type === "bpmn:Process") {
        return false;
      } else {
        if (eventType === "element.click") {
          // TODO 节点点击后想要做的处理
          console.log("点击的节点数据", element);
        }
      }
    });
  });
};

const downloadXml = () => {
  bpmnModeler.value.saveXML({ format: true }).then(res => {
    console.log("画出的xml数据为", res);
  });
};
const creteXml = () => {
  bpmnModeler.value.importXML(``);
};
</script>

<style lang="scss" scope>
@import "./index.scss";
</style>
```

index.scss

```scss
.processDrawBody {
  height: 100%;
  text-align: left;
}
.containerBox {
  width: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
}
.containerBox #container {
  height: 100%;
  border: 1px solid #ffffff;
}
.bpp-properties-panel [type="text"] {
  box-sizing: border-box;
}
.panel {
  width: 400px;
  position: absolute;
  top: 1px;
  right: 1px;
  height: 100%;
  overflow: auto;
}
/* 右下角logo */
.bjs-powered-by {
  display: none;
}
.designer-container {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
}
.icon-custom {
  /* 定义一个公共的类名 */
  border-radius: 50%;
  background-size: 65%;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-custom.lindaidai-task {
  /* 加上背景图 */
  background-image: url("@/assets/bpmn/RESTfulAPI.png");
}
.icon-custom.red {
  /* color: #cc0000 !important; */
  background-image: url("@/assets/bpmn/database.png");
}

.bpmn-icon-task.yellow {
  color: #ffc800 !important;
}

.bpmn-icon-task.green {
  color: #52b415 !important;
}
```

### 6. 自定义左侧组件

#### 6.1 [参考掘金文档全网最详bpmn.js教材-自定义palette篇](https://juejin.cn/post/6844904019454853127)

![image-20240124143814367](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124143814367.png)

#### 6.2 定义CustomPalette.js

```js
const SUITABILITY_SCORE_HIGH = "Mysql",
  SUITABILITY_SCORE_AVERGE = "Redis",
  SUITABILITY_SCORE_LOW = "Api";

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    function createTask(suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create("bpmn:Task");
        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          type: "bpmn:Task",
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }
    // 返回需要的组件
    return {
      "create.lindaidai-task": {
        group: "activity",
        className: "icon-custom lindaidai-task",
        title: translate("创建一个类型为lindaidai-task的任务节点"),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_LOW),
          click: createTask(SUITABILITY_SCORE_LOW)
        }
      },
      "create.low-task": {
        group: "activity",
        className: "icon-custom red",
        title: translate("Create Task with low suitability score"),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_LOW),
          click: createTask(SUITABILITY_SCORE_LOW)
        }
      },
      "create.average-task": {
        group: "activity",
        className: "bpmn-icon-task yellow",
        title: translate("Create Task with average suitability score"),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_AVERGE),
          click: createTask(SUITABILITY_SCORE_AVERGE)
        }
      },
      "create.high-task": {
        group: "activity",
        className: "bpmn-icon-task green",
        title: translate("Create Task with high suitability score"),
        action: {
          dragstart: createTask(SUITABILITY_SCORE_HIGH),
          click: createTask(SUITABILITY_SCORE_HIGH)
        }
      }
    };
  }
}

CustomPalette.$inject = ["bpmnFactory", "create", "elementFactory", "palette", "translate"];
```

#### 6.3 定义CustomContextPad.js

```js
const SUITABILITY_SCORE_HIGH = "Mysql",
  SUITABILITY_SCORE_AVERGE = "Redis",
  SUITABILITY_SCORE_LOW = "Api";

export default class CustomContextPad {
  constructor(bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get("autoPlace", false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const { autoPlace, bpmnFactory, create, elementFactory, translate } = this;

    function appendServiceTask(suitabilityScore) {
      return function (event, element) {
        if (autoPlace) {
          const businessObject = bpmnFactory.create("bpmn:Task");

          businessObject.suitable = suitabilityScore;

          const shape = elementFactory.createShape({
            type: "bpmn:Task",
            businessObject: businessObject
          });

          autoPlace.append(element, shape);
        } else {
          appendServiceTaskStart(event, element);
        }
      };
    }

    function appendServiceTaskStart(suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create("bpmn:Task");

        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          type: "bpmn:Task",
          businessObject: businessObject
        });

        create.start(event, shape, element);
      };
    }

    return {
      "append.low-task": {
        group: "model",
        className: "bpmn-icon-task red",
        title: translate("Append Task with low suitability score"),
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_LOW),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_LOW)
        }
      },
      "append.average-task": {
        group: "model",
        className: "bpmn-icon-task yellow",
        title: translate("Append Task with average suitability score"),
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_AVERGE),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_AVERGE)
        }
      },
      "append.high-task": {
        group: "model",
        className: "bpmn-icon-task green",
        title: translate("Append Task with high suitability score"),
        action: {
          click: appendServiceTask(SUITABILITY_SCORE_HIGH),
          dragstart: appendServiceTaskStart(SUITABILITY_SCORE_HIGH)
        }
      }
    };
  }
}

CustomContextPad.$inject = ["bpmnFactory", "config", "contextPad", "create", "elementFactory", "injector", "translate"];
```

#### 6.4 定义CustomRenderer.js

```js
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { append as svgAppend, attr as svgAttr, classes as svgClasses, create as svgCreate } from "tiny-svg";

import { getRoundRectPath } from "bpmn-js/lib/draw/BpmnRenderUtil";

import { is, getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import { isNil } from "min-dash";

const HIGH_PRIORITY = 1500,
  TASK_BORDER_RADIUS = 2,
  COLOR_GREEN = "#52B415",
  COLOR_YELLOW = "#ffc800",
  COLOR_RED = "#cc0000";

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);

    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    const suitabilityScore = this.getSuitabilityScore(element);
    if (!isNil(suitabilityScore)) {
      const color = this.getColor(suitabilityScore);

      const rect = drawRect(parentNode, 50, 20, TASK_BORDER_RADIUS, color);

      svgAttr(rect, {
        transform: "translate(-20, -10)"
      });

      let text = svgCreate("text");
      svgAttr(text, {
        fill: "#fff",
        transform: "translate(-15, 5)"
      });

      svgClasses(text).add("djs-label");

      svgAppend(text, document.createTextNode(suitabilityScore));

      svgAppend(parentNode, text);
    }

    return shape;
  }

  getShapePath(shape) {
    if (is(shape, "bpmn:Task")) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS);
    }

    return this.bpmnRenderer.getShapePath(shape);
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : suitable;
  }

  getColor(suitabilityScore) {
    if (suitabilityScore === "Mysql") {
      return COLOR_GREEN;
    } else if (suitabilityScore === "Redis") {
      return COLOR_YELLOW;
    }

    return COLOR_RED;
  }
}

CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect(parentNode, width, height, borderRadius, color) {
  const rect = svgCreate("rect");

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: color,
    strokeWidth: 2,
    fill: color
  });

  svgAppend(parentNode, rect);

  return rect;
}
```

#### 6.5 创建引用index.js

这里有两个选择，第一是直接用我们自定义的覆盖原有的

```js
import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./CustomPalette";
import CustomRenderer from "./CustomRenderer";

export default {
  __init__: ["customContextPad", "paletteProvider", "customRenderer"],
  paletteProvider: ["type", CustomPalette],
  customContextPad: ["type", CustomContextPad],
  customRenderer: ["type", CustomRenderer]
};
```

效果

![image-20240124144013504](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124144013504.png)

第二种是在原有的基础上添加

```
import CustomContextPad from "./CustomContextPad";
import CustomPalette from "./CustomPalette";
import CustomRenderer from "./CustomRenderer";
// 关键在于对customPalette引用的不同
export default {
  __init__: ["customContextPad", "customPalette", "customRenderer"],
  customPalette: ["type", CustomPalette],
  customContextPad: ["type", CustomContextPad],
  customRenderer: ["type", CustomRenderer]
};

```

效果

![image-20240124144126134](E:\code_manager\FRAMEWORK\auth-future-framework-web\docs\image-20240124144126134.png)
