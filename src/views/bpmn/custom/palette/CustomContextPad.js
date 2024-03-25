const SUITABILITY_DB = "DB",
  SUITABILITY_API = "API",
  SUITABILITY_KAFKA = "MSG",
  SUITABILITY_TASK = "TASK";

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
      "create.db-node": {
        group: "model",
        className: "icon-custom db-node",
        title: translate("Create Task with db-node"),
        action: {
          dragstart: appendServiceTask(SUITABILITY_DB),
          click: appendServiceTaskStart(SUITABILITY_DB)
        }
      },
      "create.api-node": {
        group: "model",
        className: "icon-custom api-node",
        title: translate("Create Task with api-node"),
        action: {
          dragstart: appendServiceTask(SUITABILITY_API),
          click: appendServiceTaskStart(SUITABILITY_API)
        }
      },
      "create.msg-node": {
        group: "model",
        className: "icon-custom msg-node",
        title: translate("Create Task with kafka-node"),
        action: {
          dragstart: appendServiceTask(SUITABILITY_KAFKA),
          click: appendServiceTaskStart(SUITABILITY_KAFKA)
        }
      },
      "create.task-node": {
        group: "model",
        className: "icon-custom task-node",
        title: translate("Create Task with task-node"),
        action: {
          dragstart: appendServiceTask(SUITABILITY_TASK),
          click: appendServiceTaskStart(SUITABILITY_TASK)
        }
      }
    };
  }
}

CustomContextPad.$inject = ["bpmnFactory", "config", "contextPad", "create", "elementFactory", "injector", "translate"];
