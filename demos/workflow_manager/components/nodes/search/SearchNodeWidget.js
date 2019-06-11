import React from 'react';
import * as RJD from '../../../../../src/main';
import { SearchNodeModel } from './SearchNodeModel';

export class SearchNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(157, 13, 123)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  onEdit() {
    const { node, diagramEngine } = this.props;
    diagramEngine.openModal();
  }

  getOutPorts() {
    const { node, color, displayOnly } = this.props;
    let searchNode = node;

    if (displayOnly) {
      searchNode = new SearchNodeModel(node.name, color);
    }

    return searchNode.getOutPorts ? searchNode.getOutPorts().map((port, i) => (
      <RJD.DefaultPortLabel model={port} key={`out-port-${i}`} />
    )) : [];
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    let { subType } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }
    if (subType === undefined) {
      subType = '';
    }

    return (
      <div className='basic-node' style={style}>
        <div className='title'>
          <div className='name'>
            {name}
          </div>
          {!displayOnly ? <div className='fa fa-edit' onClick={this.onEdit.bind(this)} /> : null}
          {!displayOnly ? <div className='fa fa-close' onClick={this.onRemove.bind(this)} /> : null}
        </div>
        <div className='sub-type'>
          {subType}
        </div>
        <div className='ports'>
          <div className='out'>
            {this.getOutPorts()}
          </div>
        </div>
      </div>
    );
  }
}

export const SearchNodeWidgetFactory = React.createFactory(SearchNodeWidget);
