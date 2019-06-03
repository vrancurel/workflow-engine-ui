import * as RJD from '../../../../../src/main';
import { DataNodeWidgetFactory } from './DataNodeWidget';

export class DataWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('data');
  }

  generateReactWidget(diagramEngine, node) {
    return DataNodeWidgetFactory({ node });
  }
}
