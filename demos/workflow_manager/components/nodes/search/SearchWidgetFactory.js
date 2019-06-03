import * as RJD from '../../../../../src/main';
import { SearchNodeWidgetFactory } from './SearchNodeWidget';

export class SearchWidgetFactory extends RJD.NodeWidgetFactory {
  constructor() {
    super('search');
  }

  generateReactWidget(diagramEngine, node) {
    return SearchNodeWidgetFactory({ node });
  }
}
