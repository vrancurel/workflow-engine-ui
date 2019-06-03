import * as RJD from '../../../../../src/main';
import { UpdateNodeWidgetFactory } from './UpdateNodeWidget';

export class UpdateWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('update');
  }

  generateReactWidget(diagramEngine, node) {
    return UpdateNodeWidgetFactory({ node });
  }
}
