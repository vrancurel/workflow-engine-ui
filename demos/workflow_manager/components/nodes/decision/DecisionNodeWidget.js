import React from 'react';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';
import { DecisionNodeModel } from './DecisionNodeModel';

export class DecisionNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(0, 192, 255)'
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

  getInPort() {
    const { node, color, displayOnly } = this.props;
    let decisionNode = node;

    if (displayOnly) {
      decisionNode = new DecisionNodeModel(node.name, color);
    }

    return decisionNode.getInPort ? <RJD.DefaultPortLabel model={decisionNode.getInPort()} key='in-port' /> : null;
  }
  
  getOutPort() {
    const { node, color, displayOnly } = this.props;
    let decisionNode = node;

    if (displayOnly) {
      decisionNode = new DecisionNodeModel(node.name, color);
    }

    return decisionNode.getOutPort ? <RJD.DefaultPortLabel model={decisionNode.getOutPort()} key='out-port' /> : null;
  }

  getOut2Port() {
    const { node, color, displayOnly } = this.props;
    let decisionNode = node;

    if (displayOnly) {
      decisionNode = new DecisionNodeModel(node.name, color);
    }

    return decisionNode.getOut2Port ?
      <RJD.DefaultPortLabel
        model={decisionNode.getOut2Port()}
        key='out2-port' /> : null;
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    let { subType } = node;
    const { key, value } = node;
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
          <div className='in'>
            {this.getInPort()}
          </div>
          <div>
            <div className='out'>
              {this.getOutPort()}
            </div>
            <div className='out'>
              {this.getOut2Port()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const DecisionNodeWidgetFactory = React.createFactory(DecisionNodeWidget);
