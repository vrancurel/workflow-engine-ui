import React from 'react';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';
import { TagNodeModel } from './TagNodeModel';

export class TagNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(224, 98, 20)'
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
    let tagNode = node;

    if (displayOnly) {
      tagNode = new TagNodeModel(node.name, color);
    }

    return tagNode.getInPort ? <RJD.DefaultPortLabel model={tagNode.getInPort()} key='in-port' /> : null;
  }

  getOutPort() {
    const { node, color, displayOnly } = this.props;
    let tagNode = node;

    if (displayOnly) {
      tagNode = new TagNodeModel(node.name, color);
    }

    return tagNode.getOutPort ? <RJD.DefaultPortLabel model={tagNode.getOutPort()} key='out-port' /> : null;
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
          <div className='out'>
            {this.getOutPort()}
          </div>
        </div>
      </div>
    );
  }
}

export const TagNodeWidgetFactory = React.createFactory(TagNodeWidget);
