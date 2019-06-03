import * as RJD from '../../../../../src/main';
import { UpdateNodeModel } from './UpdateNodeModel';

export class UpdateNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('UpdateNodeModel');
  }

  getInstance() {
    return new UpdateNodeModel();
  }
}
