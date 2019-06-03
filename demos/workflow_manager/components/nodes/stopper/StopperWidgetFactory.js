import * as RJD from '../../../../../src/main';
import { StopperNodeWidgetFactory } from './StopperNodeWidget';

export class StopperWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('stopper');
  }

  generateReactWidget(diagramEngine, node) {
    return StopperNodeWidgetFactory({ node });
  }
}
