import React from 'react';
import * as RJD from '../../../../../src/main';
import { FilterNodeModel } from './FilterNodeModel';

export class FilterNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(224, 98, 20)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  getInPort() {
    const { node, color, displayOnly } = this.props;
    let filterNode = node;

    if (displayOnly) {
      filterNode = new FilterNodeModel(node.name, color);
    }

    return filterNode.getInPort ? <RJD.DefaultPortLabel model={filterNode.getInPort()} key='in-port' /> : null;
  }

  getOutPort() {
    const { node, color, displayOnly } = this.props;
    let filterNode = node;

    if (displayOnly) {
      filterNode = new FilterNodeModel(node.name, color);
    }

    return filterNode.getOutPort ? <RJD.DefaultPortLabel model={filterNode.getOutPort()} key='out-port' /> : null;
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    let { subType, synchronous } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }
    if (subType === undefined) {
      subType = '<subType>';
    }
    if (synchronous === undefined) {
      synchronous = '';
    } else {
      synchronous = synchronous ? 'sync' : 'async';
    }

    return (
      <div className='basic-node' style={style}>
        <div className='title'>
          <div className='name'>
            {name}
          </div>
          {!displayOnly ? <div className='fa fa-close' onClick={this.onRemove.bind(this)} /> : null}
        </div>
        <div className='sub-type'>
          {subType} ({synchronous})
        </div>
        <div className='ports'>
          <div className='in'>
            {this.getInPort()}
          </div>
          <div className='out'>
            {this.getOutPort()}
          </div>
        </div>
      </div>
    );
  }
}

export const FilterNodeWidgetFactory = React.createFactory(FilterNodeWidget);
