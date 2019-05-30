import * as RJD from '../../../../../src/main';
import { FunctionNodeModel } from './FunctionNodeModel';

export class FunctionNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('FunctionNodeModel');
  }

  getInstance() {
    return new FunctionNodeModel();
  }
}
