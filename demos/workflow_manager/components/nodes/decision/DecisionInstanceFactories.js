import * as RJD from '../../../../../src/main';
import { DecisionNodeModel } from './DecisionNodeModel';

export class DecisionNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('DecisionNodeModel');
  }

  getInstance() {
    return new DecisionNodeModel();
  }
}
