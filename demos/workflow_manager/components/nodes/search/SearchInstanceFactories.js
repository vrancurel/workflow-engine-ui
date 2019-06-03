import * as RJD from '../../../../../src/main';
import { SearchNodeModel } from './SearchNodeModel';

export class SearchNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('SearchNodeModel');
  }

  getInstance() {
    return new SearchNodeModel();
  }
}
