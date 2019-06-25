import React from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import Cron from 'react-cron-generator';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

    const nameCounter = diagramModel.getNameCounter();
    const name = `${item.type}${nameCounter}`; 
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
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };
    
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.tabChanged = this.tabChanged.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
  }
  
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  tabChanged(index, lastIndex, e) {
    this.state.tab = index;
  }
  
  inputChanged(e) {
    if (e.target.name === 'postData') {
      if (this.state.postData !== undefined) {
        e.target.value = (this.state.postData === 'on' ? 'off' : 'on');
      }
    } else if (e.target.name === 'replace') {
      if (this.state.replace !== undefined) {
        e.target.value = (this.state.replace === 'on' ? 'off' : 'on');
      }
    } else {
      e.preventDefault();
    }
    this.setState({ [e.target.name]: e.target.value });
  }

  setModalState(node) {
    if (node === undefined) {
      throw new Error('a node shall be selected');
    }
    this.setState({
      // common
      nodeId: node.getID(),
      nodeType: node.nodeType,
      name: node.name,
      subType: node.subType,
      // data and search
      cronRule: node.cronRule,
      // tags and decisions
      key: node.key,
      value: node.value,
      script: node.script,
      replace: node.replace ? 'on' : 'off',
      // functions
      func: node.func,
      param: node.param,
      funcAccessKey: node.funcAccessKey,
      funcSecretKey: node.funcSecretKey,
      endpoint: node.endpoint,
      postData: node.postData ? 'on' : 'off',
      // targets
    });
  }
  
  resetModalState() {
    // common to all nodes
    this.state.nodeId = undefined;
    this.state.nodeType = undefined;
    this.state.name = undefined;
    this.state.subType = undefined;
    this.state.tab = undefined;
    // data and search
    this.state.cronRule = undefined;
    // tag and decision
    this.state.key = undefined;
    this.state.value = undefined;
    this.state.script = undefined;
    this.replace = undefined;
    // functions
    this.state.func = undefined;
    this.state.param = undefined;
    this.state.funcAccessKey = undefined;
    this.state.funcSecretKey = undefined;
    this.state.endpoint = undefined;
    this.state.postData = undefined;
    // targets
  }
  
  modifyNodeCb(node, arg) {
    const wed = new WorkflowEngineDefs();
    // common
    if (arg.name !== undefined) {
      node.name = arg.name;
    }
    if (arg.subType !== undefined) {
      node.subType = arg.subType;
    }
    // data and search
    if (arg.cronRule !== undefined) {
      node.cronRule = arg.cronRule;
    }
    // tag and decision
    if (arg.key !== undefined) {
      node.key = arg.key;
      node.subType = wed.KEY_VALUE;
    }
    if (arg.value !== undefined) {
      node.value = arg.value;
      node.subType = wed.KEY_VALUE;
    }
    if (arg.script !== undefined) {
      node.script = arg.script;
      node.subType = wed.SCRIPT;
    }
    if (arg.replace !== undefined) {
      node.replace = (arg.replace === 'on');
    }
    if (arg.tab !== undefined) {
      if (arg.tab === 1) {
        node.subType = wed.SCRIPT;
      } else {
        node.subType = wed.KEY_VALUE;
      }
    }
    // functions
    if (arg.func !== undefined) {
      node.func = arg.func;
    }
    if (arg.param !== undefined) {
      node.param = arg.param;
    }
    if (arg.funcAccessKey !== undefined) {
      node.funcAccessKey = arg.funcAccessKey;
    }
    if (arg.funcSecretKey !== undefined) {
      node.funcSecretKey = arg.funcSecretKey;
    }
    if (arg.endpoint !== undefined) {
      node.endpoint = arg.endpoint;
    }
    if (arg.postData !== undefined) {
      node.postData = (arg.postData === 'on');
    }
    // targets
  }

  handleSubmit(nodeType) {
    return e => {
      e.preventDefault();
      const { selectedNode } = this.props;
      if (this.state.nodeId === undefined) {
        throw new Error('a node shall be selected');
      }
      const arg = {};
      // common
      arg.nodeType = nodeType;
      arg.name = this.state.name;
      arg.subType = this.state.subType;
      arg.tab = this.state.tab;
      // data and search
      arg.cronRule = this.state.cronRule;
      // tags and decisions
      arg.key = this.state.key;
      arg.value = this.state.value;
      arg.script = this.state.script;
      arg.replace = this.state.replace;
      // functions
      arg.func = this.state.func;
      arg.param = this.state.param;
      arg.funcAccessKey = this.state.funcAccessKey;
      arg.funcSecretKey = this.state.funcSecretKey;
      arg.endpoint = this.state.endpoint;
      arg.postData = this.state.postData;
      // targets
      diagramModel.modifyNode(this.state.nodeId, this.modifyNodeCb, arg);
      this.props.updateModel(diagramModel.serializeDiagram());
      this.resetModalState();
      this.closeModal();
    };
  }

  showModal() {
    const wed = new WorkflowEngineDefs();
    let subTypes = ['undefined'];
    // common
    if (this.state.nodeType === wed.DATA) {
      subTypes = wed.dataSubTypes;
    } else if (this.state.nodeType === wed.SEARCH) {
      subTypes = wed.searchSubTypes;
    } else if (this.state.nodeType === wed.DECISION) {
      subTypes = wed.decisionSubTypes;
    } else if (this.state.nodeType === wed.TAG) {
      subTypes = wed.tagSubTypes;
    } else if (this.state.nodeType === wed.FUNCTION) {
      subTypes = wed.functionSubTypes;
    } else if (this.state.nodeType === wed.STOPPER) {
      subTypes = wed.stopperSubTypes;
    } else if (this.state.nodeType === wed.UPDATE) {
      subTypes = wed.updateSubTypes;
    }
    let defaultIndex = 0;
    if (this.state.subType === wed.SCRIPT) {
      defaultIndex = 1;
    }

    const showCommonInput = () => {
      return <div>
        <label className="modal-label">Name: </label>
        <input className="modal-input"
          type="text"
          name="name"
          defaultValue={this.state.name}
          onChange={this.inputChanged}/>
      </div>;
    };
    
    const showSubTypeInput = () => {
      if (this.state.nodeType === wed.TARGET ||
        this.state.nodeType === wed.FUNCTION) {
        return <div>
          <label className="modal-label">Sub Type: </label>
          <select className="m-1 btn btn-primary"
            name="subType"
            defaultValue={this.state.subType}
            onChange={this.inputChanged}>/>
            {
              subTypes.map(t => { 
                return (<option key={t} value={t}>{t}</option>);
              })
            }
          </select>
        </div>;
      }
    };

    const showDataInput = () => {
      if (this.state.nodeType === wed.DATA) {
        return <div>
          <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
            <TabList>
              <Tab>Selection</Tab>
              <Tab>Advanced</Tab>
            </TabList>
            <TabPanel>
              <div>
                <label className="modal-label">
                  Bucket regexp:
                </label>
                <input className="modal-input"
                  type="text"
                  name="key"
                  defaultValue={this.state.key}
                  onChange={this.inputChanged}/>
                <label className="modal-label">
                  Object regexp:
                </label>
                <input className="modal-input"
                  type="text"
                  name="value"
                  defaultValue={this.state.value}
                  onChange={this.inputChanged}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <pre>
                  <textarea className="modal-textarea"
                    name="script"
                    defaultValue={this.state.script}
                    onChange={this.inputChanged}
                    rows='5' cols='45'/>
                </pre>
              </div>
            </TabPanel>
          </Tabs>
        </div>;
      }
    };

    const showSearchInput = () => {
      if (this.state.nodeType === wed.SEARCH) {
        return <div>
          <div>
            <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
              <TabList>
                <Tab>Selection</Tab>
                <Tab>Advanced</Tab>
              </TabList>
              <TabPanel>
                <div>
                  <label className="modal-label">Bucket: </label>
                  <input className="modal-input" type="text"
                    name="key"
                    defaultValue={this.state.key}
                    onChange={this.inputChanged}/>
                  <label className="modal-label">Object regexp: </label>
                  <input className="modal-input"
                    type="text"
                    name="value"
                    defaultValue={this.state.value}
                    onChange={this.inputChanged}/>
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  <pre>
                    <textarea className="modal-textarea"
                      name="script"
                      defaultValue={this.state.script}
                      onChange={this.inputChanged}
                      rows='5' cols='45'/>
                  </pre>
                </div>
              </TabPanel>
            </Tabs>
          </div>
          <div className="modal-cronbuilder">
            <Cron
              onChange={ (e) => {this.setState({ cronRule:e }); } }
              value={this.state.cronRule}
              showResultText={false}
              showResultcron={false}
            />
          </div>
        </div>;
      }
    };

    const showTagDecisionInput = () => {
      if (this.state.nodeType === wed.TAG ||
        this.state.nodeType === wed.DECISION) {
        return <div>
          <div>
            <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
              <TabList>
                <Tab>Selection</Tab>
                <Tab>Advanced</Tab>
              </TabList>
              <TabPanel>
                <div>
                  <label className="modal-label">Tag name: </label>
                  <input className="modal-input"
                    type="text"
                    name="key"
                    defaultValue={this.state.key}
                    onChange={this.inputChanged}/>
                  <label className="modal-label">Value: </label>
                  <input className="modal-input"
                    type="text"
                    name="value"
                    defaultValue={this.state.value}
                    onChange={this.inputChanged}/>
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  <pre>
                    <textarea className="modal-textarea"
                      name="script"
                      defaultValue={this.state.script}
                      onChange={this.inputChanged}
                      rows='5' cols='45'/>
                  </pre>
                </div>
              </TabPanel>
            </Tabs>
          </div>
          <div>
            <label className="modal-label">Replace (instead of merge) tags: </label>
            <input type="checkbox"
              name="replace"
              defaultChecked={this.state.replace === 'on'}
              onChange={this.inputChanged}/>
          </div>
        </div>;
      }
    };
    
    const showFunctionInput = () => {
      if (this.state.nodeType === wed.FUNCTION) {
        return <div>
          <div>
            <label className="modal-label">Function: </label>
            <input className="modal-input"
              type="text"
              name="func"
              defaultValue={this.state.func}
              onChange={this.inputChanged}/>
          </div>
          <div>
            <label className="modal-label">Parameter: </label>
            <input className="modal-input"
              type="text"
              name="param"
              defaultValue={this.state.param}
              onChange={this.inputChanged}/>
          </div>
        </div>;
      }
    };

    const showFunctionAzureKeysInput = () => {
      if (this.state.nodeType === wed.FUNCTION &&
        this.state.subType === wed.AZURE_FUNCTION) {
        return <div>
          <div>
            <label className="modal-label">Function Key: </label>
            <input className="modal-input"
              type="text"
              name="funcSecretKey"
              defaultValue={this.state.funcSecretKey}
              onChange={this.inputChanged}/>
          </div>
          <div>
            <label className="modal-label">Endpoint: </label>
            <input className="modal-input"
              type="text"
              name="endpoint"
              defaultValue={this.state.endpoint}
              onChange={this.inputChanged}/>
          </div>
          <div>
            <label className="modal-label">PostData: </label>
            <input type="checkbox"
              name="postData"
              defaultChecked={this.state.postData === 'on'}
              onChange={this.inputChanged}/>
          </div>
        </div>;
      }
    };

    // XXX cannot get rid of this
    const customStyles = {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      },
      overlay: {
        zIndex: 1000
      }
    };
    
    return <Modal
             isOpen={this.state.modalIsOpen}
             onAfterOpen={this.afterOpenModal}
             onRequestClose={this.closeModal}
             contentLabel="Edit Node"
             style={customStyles}
             ariaHideApp={false}
           >
      <h2 className="modal-title">{this.state.nodeType}</h2>
      <form onSubmit={this.handleSubmit(this.state.nodeType)}>
        { showCommonInput() }
        { showSubTypeInput() }
        { showDataInput() }
        { showSearchInput() }
        { showTagDecisionInput() }
        { showFunctionInput() }
        { showFunctionAzureKeysInput() }
        <button className="m-1 btn btn-primary" type="button" onClick={this.closeModal}>Cancel</button>
        <input className="m-1 btn btn-primary" type="submit" value="Submit" />
      </form>
    </Modal>;
  }
  
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
      this.setModalState(action.model);
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
        <RJD.DiagramWidget
          diagramEngine={diagramEngine}
          onChange={this.onChange.bind(this)}
          openModal={this.openModal.bind(this)}/>
        { this.showModal() }
      </div>
    );
  }
}
