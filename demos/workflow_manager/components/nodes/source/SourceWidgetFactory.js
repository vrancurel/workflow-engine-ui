import * as RJD from '../../../../../src/main';
import { SourceNodeWidgetFactory } from './SourceNodeWidget';

export class SourceWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('source');
  }

  generateReactWidget(diagramEngine, node) {
    return SourceNodeWidgetFactory({ node });
  }
}
