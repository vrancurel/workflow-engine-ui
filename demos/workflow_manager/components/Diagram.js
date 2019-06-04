import React from 'react';
import _ from 'lodash';
import WorkflowEngineDefs from 'workflow-engine-defs';
import { DropTarget } from 'react-dnd';
import * as RJD from '../../../src/main';
import { DataNodeModel } from './nodes/data/DataNodeModel';
import { SearchNodeModel } from './nodes/search/SearchNodeModel';
import { TagNodeModel } from './nodes/tag/TagNodeModel';
import { FunctionNodeModel } from './nodes/function/FunctionNodeModel';
import { DecisionNodeModel } from './nodes/decision/DecisionNodeModel';
import { StopperNodeModel } from './nodes/stopper/StopperNodeModel';
import { UpdateNodeModel } from './nodes/update/UpdateNodeModel';
import { diagramEngine } from './Engine';

// Setup the diagram model
export let diagramModel = new RJD.DiagramModel();

const nodesTarget = {
  drop(props, monitor, component) {
    const { x: pageX, y: pageY } = monitor.getSourceClientOffset();
    const { left = 0, top = 0 } = diagramEngine.canvas.getBoundingClientRect();
    const { offsetX, offsetY } = diagramEngine.diagramModel;
    const x = pageX - left - offsetX;
    const y = pageY - top - offsetY;
    const item = monitor.getItem();

    const name = item.type + diagramModel.getNameCounter();
    let node;
    if (item.type === 'data') {
      node = new DataNodeModel(name, undefined);
    }
    if (item.type === 'search') {
      node = new SearchNodeModel(name, undefined);
    }
    if (item.type === 'stopper') {
      node = new StopperNodeModel(name, undefined);
    }
    if (item.type === 'update') {
      node = new UpdateNodeModel(name, undefined);
    }
    if (item.type === 'tag') {
        node = new TagNodeModel(name, undefined);
    }
    if (item.type === 'function') {
        node = new FunctionNodeModel(name, undefined);
    }
    if (item.type === 'decision') {
      node = new DecisionNodeModel(name, undefined);
    }

    node.x = x;
    node.y = y;
    diagramModel.addNodeBumpNameCounter(node);
    props.updateModel(diagramModel.serializeDiagram());
  },
};

@DropTarget('node-source', nodesTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

export class Diagram extends React.Component {
  componentDidMount() {
    const { model } = this.props;
    let newModel = {};
    if (model) {
      newModel = model;
    } else {
      const wed = new WorkflowEngineDefs(model);
      newModel = wed.generateNewModel();
    }
    //this.setModel(newModel);
    this.props.updateModel(newModel, { selectedNode: null });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.model, nextProps.model)) {
      this.setModel(nextProps.model);
    }
  }

  setModel(model) {
    diagramModel = new RJD.DiagramModel();
    if (model) {
      diagramModel.deSerializeDiagram(model, diagramEngine);
    }
    diagramEngine.setDiagramModel(diagramModel);
  }

  onChange(model, action) {
    // Ignore some events
    if (['items-copied'].indexOf(action.type) !== -1) {
      return;
    }

    // Check for single selected items
    if (['node-selected', 'node-moved'].indexOf(action.type) !== -1) {
      return this.props.updateModel(model, { selectedNode: action.model });
    }

    // Check for canvas events
    const deselectEvts = ['canvas-click', 'canvas-drag', 'items-selected', 'items-drag-selected', 'items-moved'];
    if (deselectEvts.indexOf(action.type) !== -1) {
      return this.props.updateModel(model, { selectedNode: null });
    }

    // Check if this is a deselection and a single node exists
    const isDeselect = ['node-deselected', 'link-deselected'].indexOf(action.type) !== -1;
    if (isDeselect && action.items.length < 1 && action.model.nodeType) {
      return this.props.updateModel(model, { selectedNode: action.model });
    }

    this.props.updateModel(model);
  }

  render() {
    const { connectDropTarget } = this.props;

    // Render the canvas
    return connectDropTarget (
      <div className='diagram-drop-container'>
        <RJD.DiagramWidget diagramEngine={diagramEngine} onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}
