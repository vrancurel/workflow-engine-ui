import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';

export class UpdateNodeModel extends RJD.NodeModel {
  constructor(name = 'Untitled', color = 'rgb(192, 235, 0)') {
    super('update');
    this.addPort(new RJD.DefaultPortModel(true, 'input', 'In'));
    this.name = name;
    this.color = color;
    const wed = new WorkflowEngineDefs();
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
  }

  serialize() {
    return _.merge(super.serialize(), {
      _class: 'UpdateNodeModel',
      name: this.name,
      color: this.color,
    });
  }

  getInPorts() {
    return _.filter(this.ports, portModel => !portModel.out);
  }
}
