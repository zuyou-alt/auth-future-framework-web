import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import { append as svgAppend, create as svgCreate } from "tiny-svg";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { isNil } from "min-dash";

const HIGH_PRIORITY = 1500;
const customConfig = {
  // 自定义元素的配置(后面会用到)
  DB: {
    url: new URL(`../../../../assets/bpmn/database.png`, import.meta.url).href,
    attr: { x: 0, y: 0, width: 48, height: 48 }
  },
  API: {
    url: new URL(`../../../../assets/bpmn/RESTfulAPI.png`, import.meta.url).href,
    attr: { x: 0, y: 0, width: 48, height: 48 }
  },
  MSG: {
    url: new URL(`../../../../assets/bpmn/kafka.png`, import.meta.url).href,
    attr: { x: 0, y: 0, width: 48, height: 48 }
  },
  TASK: {
    url: new URL(`../../../../assets/bpmn/task.png`, import.meta.url).href,
    attr: { x: 0, y: 0, width: 48, height: 48 }
  }
};
export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer, modeling) {
    super(eventBus, HIGH_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
    this.modeling = modeling;
  }

  canRender(element) {
    // ignore labels
    return !element.labelTarget;
  }

  /**
   * 第一种展现形式
   */
  drawShape(parentNode, element) {
    const suitabilityScore = this.getSuitabilityScore(element);
    if (!isNil(suitabilityScore)) {
      const { url, attr } = customConfig[suitabilityScore];
      const customIcon = svgCreate("image", {
        // 在这里创建了一个image
        ...attr,
        href: url
      });
      element["width"] = attr.width; // 这里我是取了巧, 直接修改了元素的宽高
      element["height"] = attr.height;
      svgAppend(parentNode, customIcon);
      return customIcon;
    }
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    return shape;
  }

  getSuitabilityScore(element) {
    const businessObject = getBusinessObject(element);

    const { suitable } = businessObject;

    return Number.isFinite(suitable) ? suitable : suitable;
  }
}

CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];
