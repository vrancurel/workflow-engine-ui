import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class StopperNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(192, 255, 0)') {
    super('stopper');
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
  }

  serialize() {
    return _.merge(super.serialize(), {
      _class: 'StopperNodeModel',
      name: this.name,
      color: this.color,
    });
  }

  getInPorts() {
    return _.filter(this.ports, portModel => !portModel.out);
  }
}
