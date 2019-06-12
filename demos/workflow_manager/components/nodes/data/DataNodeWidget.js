import React from 'react';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';
import { DataNodeModel } from './DataNodeModel';

export class DataNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(157, 13, 193)'
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
    let dataNode = node;

    if (displayOnly) {
      dataNode = new DataNodeModel(node.name, color);
    }

    return dataNode.getOutPorts ? dataNode.getOutPorts().map((port, i) => (
      <RJD.DefaultPortLabel model={port} key={`out-port-${i}`} />
    )) : [];
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    let { subType, key, value } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }
    if (subType === undefined) {
      subType = '';
    }
    let wed = new WorkflowEngineDefs();
    if (subType === wed.KEY_VALUE) {
      if (key !== undefined) {
        subType = key + ': ' + (value ? value : '');
      }
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

export const DataNodeWidgetFactory = React.createFactory(DataNodeWidget);
