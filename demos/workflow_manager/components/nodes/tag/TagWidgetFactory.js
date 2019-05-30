import * as RJD from '../../../../../src/main';
import { TagNodeWidgetFactory } from './TagNodeWidget';

export class TagWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('tag');
  }

  generateReactWidget(diagramEngine, node) {
    return TagNodeWidgetFactory({ node });
  }
}
