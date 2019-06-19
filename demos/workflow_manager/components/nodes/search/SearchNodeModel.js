import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class SearchNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(157, 13, 123)') {
    super('search');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.name = name;
    this.color = color;
    let wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultSearchSubType();
    this.key = undefined;
    this.value = undefined;
    this.script = undefined;
    this.cronRule = undefined;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.key = object.key;
    this.value = object.value;
    this.script = object.script;
    this.cronRule = object.cronRule;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      key: this.key,
      value: this.value,
      script: this.script,
      cronRule: this.cronRule
    });
  }

  getOutPorts() {
    return _.filter(this.ports, portModel => !portModel.in);
  }
}
