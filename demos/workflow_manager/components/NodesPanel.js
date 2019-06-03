import React from 'react';
import { DragWrapper } from './DragWrapper';
import { DataNodeWidget } from './nodes/data/DataNodeWidget';
import { SearchNodeWidget } from './nodes/search/SearchNodeWidget';
import { TargetNodeWidget } from './nodes/target/TargetNodeWidget';
import { TagNodeWidget } from './nodes/tag/TagNodeWidget';
import { FunctionNodeWidget } from './nodes/function/FunctionNodeWidget';
import { DecisionNodeWidget } from './nodes/decision/DecisionNodeWidget';

class Node extends React.Component {
  renderNode() {
    const { type, color } = this.props;

    if (type === 'data') {
      return <DataNodeWidget node={{ name: 'Data' }} displayOnly />;
    }
    if (type === 'search') {
      return <SearchNodeWidget node={{ name: 'Search' }} displayOnly />;
    }
    if (type === 'tag') {
      return <TagNodeWidget node={{ name: 'Tag' }} color={color} displayOnly />;
    }
    if (type === 'decision') {
      return <DecisionNodeWidget node={{ name: 'Decision' }} displayOnly />;
    }
    if (type === 'function') {
      return <FunctionNodeWidget node={{ name: 'Function' }} color={color} displayOnly />;
    }
    if (type === 'target') {
      return <TargetNodeWidget node={{ name: 'Target' }} displayOnly />;
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
          <Node type={ 'data' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'search' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'tag' } />
        </div>
        <div className='node-wrapper'>
          <Node type={ 'function' } />
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
