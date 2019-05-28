import _ from 'lodash';
import * as RJD from '../../../../../src/main';

export class DecisionNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(0, 192, 255)') {
    super('decision');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'True'));
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.addPort(new RJD.DefaultPortModel(false, 'output2', 'False'));
    this.name = name;
    this.color = color;
    this.script = undefined;
    this.asynchronous = undefined;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.script = object.script;
    this.asynchronous = object.asynchronous;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
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

  getOut2Port() {
    return this.ports.output2;
  }
}
