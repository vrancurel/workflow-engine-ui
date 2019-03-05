import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class SourceNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(157, 13, 193)') {
    super('source');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.name = name;
    this.color = color;
    let wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultSourceType();
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

  getOutPorts() {
    return _.filter(this.ports, portModel => !portModel.in);
  }
}
