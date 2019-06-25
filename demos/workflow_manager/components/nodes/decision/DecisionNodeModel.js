import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class DecisionNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(0, 192, 255)') {
    super('decision');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'True'));
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.addPort(new RJD.DefaultPortModel(false, 'output2', 'False'));
    this.name = name;
    this.color = color;
    const wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultDecisionSubType();
    this.key = 'tag1';
    this.value = 'value1';
    this.script = 'tags.tag1 === \"value1\";';
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.key = object.key;
    this.value = object.value;
    this.script = object.script;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      key: this.key,
      value: this.value,
      script: this.script,
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
