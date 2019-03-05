import * as RJD from '../../../../../src/main';
import { DecisionNodeWidgetFactory } from './DecisionNodeWidget';

export class DecisionWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('decision');
  }

  generateReactWidget(diagramEngine, node) {
    return DecisionNodeWidgetFactory({ node });
  }
}
