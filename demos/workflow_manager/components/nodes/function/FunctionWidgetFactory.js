import * as RJD from '../../../../../src/main';
import { FunctionNodeWidgetFactory } from './FunctionNodeWidget';

export class FunctionWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('function');
  }

  generateReactWidget(diagramEngine, node) {
    return FunctionNodeWidgetFactory({ node });
  }
}
