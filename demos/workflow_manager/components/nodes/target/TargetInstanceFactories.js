import * as RJD from '../../../../../src/main';
import { TargetNodeModel } from './TargetNodeModel';

export class TargetNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('TargetNodeModel');
  }

  getInstance() {
    return new TargetNodeModel();
  }
}
