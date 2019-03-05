import * as RJD from '../../../../../src/main';
import { TargetNodeWidgetFactory } from './TargetNodeWidget';

export class TargetWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('target');
  }

  generateReactWidget(diagramEngine, node) {
    return TargetNodeWidgetFactory({ node });
  }
}
