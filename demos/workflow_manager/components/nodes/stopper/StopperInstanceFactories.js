import * as RJD from '../../../../../src/main';
import { StopperNodeModel } from './StopperNodeModel';

export class StopperNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('StopperNodeModel');
  }

  getInstance() {
    return new StopperNodeModel();
  }
}
