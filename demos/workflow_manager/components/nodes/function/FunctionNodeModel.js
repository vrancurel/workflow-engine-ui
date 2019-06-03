import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class FunctionNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(127, 255, 212)') {
    super('function');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
    let wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultFunctionSubType();
    this.func = undefined;
    this.script = undefined;
    this.asynchronous = false;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.func = object.func;
    this.script = object.script;
    this.asynchronous = object.asynchronous;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      func: this.func,
      script: this.script,
      asynchronous: this.asynchronous
    });
  }

  getInPort() {
    return this.ports.input;
  }

  getOutPort() {
    return this.ports.output;
  }
}
