import React from 'react';
import * as RJD from '../../../../../src/main';
import { FunctionNodeModel } from './FunctionNodeModel';

export class FunctionNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(127, 255, 212)'
  };

  onRemove() {
    const { node, diagramEngine } = this.props;
    node.remove();
    diagramEngine.forceUpdate();
  }

  getInPort() {
    const { node, color, displayOnly } = this.props;
    let functionNode = node;

    if (displayOnly) {
      functionNode = new FunctionNodeModel(node.name, color);
    }

    return functionNode.getInPort ? <RJD.DefaultPortLabel model={functionNode.getInPort()} key='in-port' /> : null;
  }

  getOutPort() {
    const { node, color, displayOnly } = this.props;
    let functionNode = node;

    if (displayOnly) {
      functionNode = new FunctionNodeModel(node.name, color);
    }

    return functionNode.getOutPort ? <RJD.DefaultPortLabel model={functionNode.getOutPort()} key='out-port' /> : null;
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    let { subType, func, param, asynchronous } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }
    if (subType === undefined) {
      subType = '';
    }
    if (func !== undefined) {
      subType += ': ' + func + '(' + (param ? param : ')');
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

export const FunctionNodeWidgetFactory = React.createFactory(FunctionNodeWidget);
