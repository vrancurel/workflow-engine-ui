import * as RJD from '../../../../../src/main';
import { DataNodeModel } from './DataNodeModel';

export class DataNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('DataNodeModel');
  }

  getInstance() {
    return new DataNodeModel();
  }
}
