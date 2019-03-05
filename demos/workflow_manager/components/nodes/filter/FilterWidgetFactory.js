import * as RJD from '../../../../../src/main';
import { FilterNodeWidgetFactory } from './FilterNodeWidget';

export class FilterWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('filter');
  }

  generateReactWidget(diagramEngine, node) {
    return FilterNodeWidgetFactory({ node });
  }
}
