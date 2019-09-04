import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class TagNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(224, 98, 20)') {
    super('tag');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
    const wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultTagSubType();
    this.key = 'tag1';
    this.value = 'value1';
    this.script = '{tag1: \"value1"};';
    this.replace = false;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.key = object.key;
    this.value = object.value;
    this.script = object.script;
    this.replace = object.replace;
  }

  serialize() {
    return _.merge(super.serialize(), {
      _class: 'TagNodeModel',
      name: this.name,
      color: this.color,
      subType: this.subType,
      key: this.key,
      value: this.value,
      script: this.script,
      replace: this.replace
    });
  }

  getInPort() {
    return this.ports.input;
  }

  getOutPort() {
    return this.ports.output;
  }
}
