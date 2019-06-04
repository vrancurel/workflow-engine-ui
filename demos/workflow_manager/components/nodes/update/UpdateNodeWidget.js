import React from 'react';
import * as RJD from '../../../../../src/main';
import { UpdateNodeModel } from './UpdateNodeModel';

export class UpdateNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(192, 235, 0)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  getInPorts() {
    const { node, color, displayOnly } = this.props;
    let updateNode = node;

    if (displayOnly) {
      updateNode = new UpdateNodeModel(node.name, color);
    }

    return updateNode.getInPorts ? updateNode.getInPorts().map((port, i) => (
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
        subType = 'update';
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

export const UpdateNodeWidgetFactory = React.createFactory(UpdateNodeWidget);
