import React from 'react';
import * as RJD from '../../../../../src/main';
import { StopperNodeModel } from './StopperNodeModel';

export class StopperNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(192, 255, 0)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  getInPorts() {
    const { node, color, displayOnly } = this.props;
    let stopperNode = node;

    if (displayOnly) {
      stopperNode = new StopperNodeModel(node.name, color);
    }

    return stopperNode.getInPorts ? stopperNode.getInPorts().map((port, i) => (
      <RJD.DefaultPortLabel model={port} key={`in-port-${i}`} />
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
      if (displayOnly) {
        subType = '';
      } else {
        subType = 'stopper';
      }
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
          <div className='in'>
            {this.getInPorts()}
          </div>
        </div>
      </div>
    );
  }
}

export const StopperNodeWidgetFactory = React.createFactory(StopperNodeWidget);
