import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class TargetNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(192, 255, 0)') {
    super('target');
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
    let wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultTargetType();
    this.script = undefined;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.script = object.script;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      script: this.script
    });
  }

  getInPorts() {
    return _.filter(this.ports, portModel => !portModel.out);
  }
}
