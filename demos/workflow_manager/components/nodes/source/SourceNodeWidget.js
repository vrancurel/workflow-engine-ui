import React from 'react';
import * as RJD from '../../../../../src/main';
import { SourceNodeModel } from './SourceNodeModel';

export class SourceNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(157, 13, 193)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  getOutPorts() {
    const { node, color, displayOnly } = this.props;
    let sourceNode = node;

    if (displayOnly) {
      sourceNode = new SourceNodeModel(node.name, color);
    }

    return sourceNode.getOutPorts ? sourceNode.getOutPorts().map((port, i) => (
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
      subType = '<subType>';
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

export const SourceNodeWidgetFactory = React.createFactory(SourceNodeWidget);
