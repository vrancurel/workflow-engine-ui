import * as RJD from '../../../../../src/main';
import { TagNodeModel } from './TagNodeModel';

export class TagNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('TagNodeModel');
  }

  getInstance() {
    return new TagNodeModel();
  }
}
