import * as RJD from '../../../../../src/main';
import { FilterNodeModel } from './FilterNodeModel';

export class FilterNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('FilterNodeModel');
  }

  getInstance() {
    return new FilterNodeModel();
  }
}
