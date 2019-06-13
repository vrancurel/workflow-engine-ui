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
    this.param = undefined;
    this.funcAccessKey = undefined;
    this.funcSecretKey = undefined;
    this.endpoint = undefined;
    this.postData = false;
    this.asynchronous = false;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.name = object.name;
    this.color = object.color;
    this.subType = object.subType;
    this.func = object.func;
    this.param = object.param;
    this.funcAccessKey = object.funcAccessKey;
    this.funcSecretKey = object.funcSecretKey;
    this.endpoint = object.endpoint;
    this.postData = object.postData;
    this.asynchronous = object.asynchronous;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      color: this.color,
      subType: this.subType,
      func: this.func,
      param: this.param,
      funcAccessKey: this.funcAccessKey,
      funcSecretKey: this.funcSecretKey,
      endpoint: this.endpoint,
      postData: this.postData,
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
