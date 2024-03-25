const SUITABILITY_DB = "DB",
  SUITABILITY_API = "API",
  SUITABILITY_KAFKA = "MSG",
  SUITABILITY_TASK = "TASK";
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

    return {
      "create.db-node": {
        group: "activity",
        className: "icon-custom db-node",
        title: translate("Create Task with db-node"),
        action: {
          dragstart: createTask(SUITABILITY_DB),
          click: createTask(SUITABILITY_DB)
        }
      },
      "create.api-node": {
        group: "activity",
        className: "icon-custom api-node",
        title: translate("Create Task with api-node"),
        action: {
          dragstart: createTask(SUITABILITY_API),
          click: createTask(SUITABILITY_API)
        }
      },
      "create.msg-node": {
        group: "activity",
        className: "icon-custom msg-node",
        title: translate("Create Task with msg-node"),
        action: {
          dragstart: createTask(SUITABILITY_KAFKA),
          click: createTask(SUITABILITY_KAFKA)
        }
      },
      "create.task-node": {
        group: "activity",
        className: "icon-custom task-node",
        title: translate("Create Task with task-node"),
        action: {
          dragstart: createTask(SUITABILITY_TASK),
          click: createTask(SUITABILITY_TASK)
        }
      }
    };
  }
}

CustomPalette.$inject = ["bpmnFactory", "create", "elementFactory", "palette", "translate"];
