import * as RJD from '../../../../../src/main';
import { SourceNodeModel } from './SourceNodeModel';

export class SourceNodeFactory extends RJD.AbstractInstanceFactory {
  constructor() {
    super('SourceNodeModel');
  }

  getInstance() {
    return new SourceNodeModel();
  }
}
