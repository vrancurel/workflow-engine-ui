import React from 'react';
import { DragWrapper } from './DragWrapper';
import { SourceNodeWidget } from './nodes/source/SourceNodeWidget';
import { TargetNodeWidget } from './nodes/target/TargetNodeWidget';
import { FilterNodeWidget } from './nodes/filter/FilterNodeWidget';
import { DecisionNodeWidget } from './nodes/decision/DecisionNodeWidget';

class Node extends React.Component {
  renderNode() {
    const { type, color } = this.props;

    if (type === 'source') {
      return <SourceNodeWidget node={{ name: 'Source Node' }} displayOnly />;
    }
    if (type === 'target') {
      return <TargetNodeWidget node={{ name: 'Target Node' }} displayOnly />;
    }
    if (type === 'filter') {
      return <FilterNodeWidget node={{ name: 'Filter Node' }} color={color} displayOnly />;
    }
    if (type === 'decision') {
      return <DecisionNodeWidget node={{ name: 'Decision Node' }} displayOnly />;
    }
    console.warn('Unknown node type');
    return null;
  }

  render() {
    const { type, color } = this.props;

    return (
      <DragWrapper type={type} color={color} style={{ display: 'inline-block' }}>
        {this.renderNode()}
      </DragWrapper>
    );
  }
}

export class NodesPanel extends React.Component {
  render() {
    return (
      <div className='nodes-panel'>
        <div className="icon-zenko-logo-align">
          <img className="icon-zenko-logo" src="https://d37uysqk07vju5.cloudfront.net/1be33ac5e10f5826f60bf845f908e7d1f2b5e3e4/assets/img/logo-icon.png"/>
        </div>
        <div className="nodes-panel-title">
          WORKFLOW MANAGER
        </div>
        <div className='node-wrapper'>
          <Node type={ 'source' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'filter' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'decision' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'target' } />
        </div>
      </div>
    );
  }
}
