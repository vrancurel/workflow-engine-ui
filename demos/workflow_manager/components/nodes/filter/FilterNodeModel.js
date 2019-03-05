import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class FilterNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(224, 98, 20)') {
    super('filter');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
    let wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultFilterType();
    this.func = undefined;
    this.script = undefined;
    this.synchronous = undefined;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.func = object.func;
    this.script = object.script;
    this.synchronous = object.synchronous;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      func: this.func,
      script: this.script,
      synchronous: this.synchronous
    });
  }

  getInPort() {
    return this.ports.input;
  }

  getOutPort() {
    return this.ports.output;
  }
}
