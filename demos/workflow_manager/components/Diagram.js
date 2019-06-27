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
    this.setState({ tab: index });
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
      operator: node.operator,
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
    this.setState({
      modalIsOpen: false
    });
  }
  
  modifyNodeCb(node) {
    const wed = new WorkflowEngineDefs();
    // common
    if (this.state.name !== undefined) {
      node.name = this.state.name;
    }
    if (this.state.subType !== undefined) {
      node.subType = this.state.subType;
    }
    // data and search
    if (this.state.cronRule !== undefined) {
      node.cronRule = this.state.cronRule;
    }
    // tag and decision
    if (this.state.key !== undefined) {
      node.key = this.state.key;
    }
    if (this.state.value !== undefined) {
      node.value = this.state.value;
    }
    if (this.state.operator !== undefined) {
      node.operator = this.state.operator;
    }
    if (this.state.script !== undefined) {
      node.script = this.state.script;
    }
    if (this.state.replace !== undefined) {
      node.replace = (this.state.replace === 'on');
    }
    if (this.state.tab !== undefined) {
      if (this.state.tab === 1) {
        node.subType = wed.SUB_TYPE_ADVANCED;
      } else {
        node.subType = wed.SUB_TYPE_BASIC;
      }
    }
    // functions
    if (this.state.func !== undefined) {
      node.func = this.state.func;
    }
    if (this.state.param !== undefined) {
      node.param = this.state.param;
    }
    if (this.state.funcAccessKey !== undefined) {
      node.funcAccessKey = this.state.funcAccessKey;
    }
    if (this.state.funcSecretKey !== undefined) {
      node.funcSecretKey = this.state.funcSecretKey;
    }
    if (this.state.endpoint !== undefined) {
      node.endpoint = this.state.endpoint;
    }
    if (this.state.postData !== undefined) {
      node.postData = (this.state.postData === 'on');
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
      diagramModel.modifyNode(this.state.nodeId, this.modifyNodeCb.bind(this));
      this.props.updateModel(diagramModel.serializeDiagram());
      this.resetModalState();
      this.closeModal();
    };
  }

  showModal() {
    const wed = new WorkflowEngineDefs();

    let defaultIndex = 0;
    if (this.state.subType === wed.SUB_TYPE_ADVANCED) {
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
    
    const showDataInput = () => {
      if (this.state.nodeType === wed.TYPE_DATA) {
        return <div>
          <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
            <TabList>
              <Tab>Basic</Tab>
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
      if (this.state.nodeType === wed.TYPE_SEARCH) {
        return <div>
          <div>
            <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
              <TabList>
                <Tab>Basic</Tab>
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
                  <label className="modal-label">
                    Bucket:
                  </label>
                  <input className="modal-input"
                    type="text"
                    name="key"
                    defaultValue={this.state.key}
                    onChange={this.inputChanged}/>
                </div>
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

    const showTagInput = () => {
      if (this.state.nodeType === wed.TYPE_TAG) {
        return <div>
          <div>
            <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
              <TabList>
                <Tab>Basic</Tab>
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

    const showDecisionInput = () => {
      if (this.state.nodeType === wed.TYPE_DECISION) {
        return <div>
          <div>
            <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
              <TabList>
                <Tab>Basic</Tab>
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
                  <select className="m-1 btn btn-primary"
                    name="operator"
                    defaultValue={this.state.operator}
                    onChange={this.inputChanged}>/>
                    {
                      wed.decisionBasicOperators.map(t => { 
                        return (<option key={t} value={t}>{t}</option>);
                      })
                    }
                  </select>
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
        </div>;
      }
    };

    const showFunctionInput = () => {
      if (this.state.nodeType === wed.TYPE_FUNCTION) {
        return <div>
          <div>
            <label className="modal-label">Sub Type: </label>
            <select className="m-1 btn btn-primary"
              name="subType"
              defaultValue={this.state.subType}
              onChange={this.inputChanged}>/>
              {
                wed.functionSubTypes.map(t => { 
                  return (<option key={t} value={t}>{t}</option>);
                })
              }
            </select>
          </div>
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
      if (this.state.nodeType === wed.TYPE_FUNCTION &&
        this.state.subType === wed.SUB_TYPE_AZURE_FUNCTION) {
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
        { showDataInput() }
        { showSearchInput() }
        { showTagInput() }
        { showDecisionInput() }
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
