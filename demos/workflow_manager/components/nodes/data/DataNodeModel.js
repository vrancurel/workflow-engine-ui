import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class DataNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(157, 13, 193)') {
    super('data');
    this.addPort(new RJD.DefaultPortModel(false, 'output', 'Out'));
    this.name = name;
    this.color = color;
    const wed = new WorkflowEngineDefs();
    this.subType = wed.getDefaultDataSubType();
    this.key = 'my-bucket';
    this.value = '*';
    this.script = 'Bucket === \'my-bucket\';';
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
      script: this.script
    });
  }

  getOutPorts() {
    return _.filter(this.ports, portModel => !portModel.in);
  }
}
