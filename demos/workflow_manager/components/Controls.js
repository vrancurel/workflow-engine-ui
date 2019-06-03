import React from 'react';
import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import WorkflowEngineDefs from 'workflow-engine-defs';
import { diagramModel } from './Diagram';
import { diagramEngine } from './Engine';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  },
  overlay : {
    zIndex                : 1000
  }
};

export class Controls extends React.Component {
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
    this.loadWorkflow = this.loadWorkflow.bind(this);
    this.saveWorkflow = this.saveWorkflow.bind(this);
    this.generateWorkflow = this.generateWorkflow.bind(this);
  }

  effectivelyLoadWorkflow(newModel) {
    this.props.updateModel(newModel, { selectedNode: null });
  }
  
  loadWorkflow(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    let that = this;
    let reader = new FileReader();
    reader.onload = function(e) {
      that.effectivelyLoadWorkflow(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  }
  
  saveWorkflow(event) {
    const { model } = this.props;
    event.stopPropagation();
    event.preventDefault();
    let filename = "workflow.json";
    let contentType = "application/json;charset=utf-8;";
    let a = document.createElement('a');
    a.download = filename;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(model));
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  generateWorkflow() {
    const { model } = this.props;
    const wed = new WorkflowEngineDefs(model);
    try {
      wed.checkModel();
    } catch (err) {
      window.confirm(err.message);
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  tabChanged(index, lastIndex, e) {
    console.log('tabChanged', index, lastIndex);
    this.state.tab = index;
  }
  
  inputChanged(e) {
    const { selectedNode } = this.props;
    if (!selectedNode) {
      throw new Error('a node shall be selected');
    }
    if (e.target.name === 'asynchronous') {
      if (this.state.asynchronous === undefined) {
        e.target.value = selectedNode.asynchronous ? 'off' : 'on';
      } else {
        e.target.value = this.state.asynchronous === 'on' ? 'off' : 'on';
      }
    } else {
      e.preventDefault();
    }
    this.setState({ [e.target.name]: e.target.value });
  }

  resetState() {
    // common to all nodes
    this.state.name = undefined;
    this.state.subType = undefined;
    this.state.tab = undefined;
    // data and search
    // tag and decision
    this.state.key = undefined;
    this.state.value = undefined;
    this.state.script = undefined;
    // functions
    this.state.func = undefined;
    this.state.param = undefined;
    this.state.asynchronous = undefined;
    // targets
  }
  
  modifyNodeCb(node, arg) {
    let wed = new WorkflowEngineDefs();
    // common
    if (arg.name !== undefined) {
      node.name = arg.name;
    }
    if (arg.subType !== undefined) {
      node.subType = arg.subType;
    }
    // data and search
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
    // functions
    if (arg.func !== undefined) {
      node.func = arg.func;
    }
    if (arg.param !== undefined) {
      node.param = arg.param;
    }
    if (arg.asynchronous !== undefined) {
      node.asynchronous = arg.asynchronous === 'on' ? true : false;
    }
    // targets
  }

  handleSubmit(type) {
    return e => {
      e.preventDefault();
      const { selectedNode } = this.props;
      if (selectedNode) {
        let arg = {};
        // common
        arg.type = type;
        arg.name = this.state.name;
        arg.subType = this.state.subType;
        arg.tab = this.state.tab;
        // data and search
        // tags and decisions
        arg.key = this.state.key;
        arg.value = this.state.value;
        arg.script = this.state.script;
        // functions
        arg.func = this.state.func;
        arg.param = this.state.param;
        arg.asynchronous = this.state.asynchronous;
        // targets
        diagramModel.modifyNode(selectedNode.getID(), this.modifyNodeCb, arg);
        this.props.updateModel(diagramModel.serializeDiagram());
        this.resetState();
      }
      this.closeModal();
    }
  }

  getModal() {
    const { selectedNode } = this.props;
    let wed = new WorkflowEngineDefs();
    // common
    let type = '';
    let name = '';
    let subType = 'undefined';
    let subTypes = ['undefined'];
    // data and search
    // tags and decisions
    let defaultIndex = 0;
    let key = '';
    let value = '';
    let script = '';
    // functions
    let func = '';
    let param = '';
    let asynchronous = true;
    // targets
    if (selectedNode) {
      // common
      type = selectedNode.nodeType;
      name = selectedNode.name;
      subType = selectedNode.subType;
      if (type === wed.DATA) {
        subTypes = wed.dataSubTypes;
      } else if (type === wed.SEARCH) {
        subTypes = wed.searchSubTypes;
      } else if (type === wed.DECISION) {
        subTypes = wed.decisionSubTypes;
      } else if (type === wed.TAG) {
        subTypes = wed.tagSubTypes;
      } else if (type === wed.FUNCTION) {
        subTypes = wed.functionSubTypes;
      } else if (type === wed.STOPPER) {
        subTypes = wed.stopperSubTypes;
      } else if (type === wed.UPDATE) {
        subTypes = wed.updateSubTypes;
      }
      // data and search
      // tags and decisions
      if (subType === wed.KEY_VALUE) {
        defaultIndex = 0;
      } else if (subType === wed.SCRIPT) {
        defaultIndex = 1;
      }
      key = selectedNode.key;
      value = selectedNode.value;
      script = selectedNode.script;
      // functions
      func = selectedNode.func;
      param = selectedNode.param;
      asynchronous = selectedNode.asynchronous;
      // targets
    }
    if (this.state.asynchronous !== undefined) {
      asynchronous = this.state.asynchronous === 'on' ? true : false;
    }

    let getCommonInput = () => {
      return <div>
        <label className="modal-label">Name: </label>
        <input className="modal-input" type="text" name="name" defaultValue={name} onChange={this.inputChanged}/>
      </div>
    }
    
    let getSubTypeInput = () => {
      if (type === wed.TARGET ||
        type === wed.FUNCTION) {
        return <div>
          <label className="modal-label">Sub Type: </label>
          <select className="m-1 btn btn-primary" name="subType" defaultValue={subType} onChange={this.inputChanged}>/>
            {
              subTypes.map(t => { 
                return (<option key={t} value={t}>{t}</option>);
              })
            }
          </select>
        </div>
      }
    }

    let getDataInput = () => {
      if (type === wed.DATA) {
        return <div>
          <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
            <TabList>
              <Tab>Selection</Tab>
              <Tab>Advanced</Tab>
            </TabList>
            <TabPanel>
              <div>
                <label className="modal-label">Regular expression (bucket:object): </label>
                <input className="modal-input" type="text" name="value" defaultValue={value} onChange={this.inputChanged}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <pre>
                  <textarea className="modal-textarea" name="script" defaultValue={script} onChange={this.inputChanged} rows='5' cols='45'/>
                </pre>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      }
    }

    let getTagDecisionInput = () => {
      if (type === wed.TAG ||
        type === wed.DECISION) {
        return <div>
          <Tabs defaultIndex={defaultIndex} onSelect={this.tabChanged}>
            <TabList>
              <Tab>Selection</Tab>
              <Tab>Advanced</Tab>
            </TabList>
            <TabPanel>
              <div>
                <label className="modal-label">Tag name: </label>
                <input className="modal-input" type="text" name="key" defaultValue={key} onChange={this.inputChanged}/>
                <label className="modal-label">Value: </label>
                <input className="modal-input" type="text" name="value" defaultValue={value} onChange={this.inputChanged}/>
              </div>
            </TabPanel>
            <TabPanel>
              <div>
                <pre>
                  <textarea className="modal-textarea" name="script" defaultValue={script} onChange={this.inputChanged} rows='5' cols='45'/>
                </pre>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      }
    }
    
    let getFunctionInput = () => {
      if (type === wed.FUNCTION) {
        return <div>
          <div>
            <label className="modal-label">Function: </label>
            <input className="modal-input" type="text" name="func" defaultValue={func} onChange={this.inputChanged}/>
          </div>
          <div>
            <label className="modal-label">Parameter: </label>
            <input className="modal-input" type="text" name="param" defaultValue={param} onChange={this.inputChanged}/>
          </div>
          <div>
            <label className="modal-label">Asynchronous: </label>
            <input type="checkbox" name="asynchronous" defaultChecked={asynchronous} onChange={this.inputChanged}/>
          </div>
        </div>
      }
    }

    return <Modal
             isOpen={this.state.modalIsOpen}
             onAfterOpen={this.afterOpenModal}
             onRequestClose={this.closeModal}
             style={customStyles}
             contentLabel="Edit Node"
             ariaHideApp={false}
             overlayClassName="Overlay"
           >
      <h2 className="modal-title">{type}</h2>
      <form onSubmit={this.handleSubmit(type)}>
        { getCommonInput() }
        { getSubTypeInput() }
        { getDataInput() }
        { getTagDecisionInput() }
        { getFunctionInput() }
        <button className="m-1 btn btn-primary" type="button" onClick={this.closeModal}>Cancel</button>
        <input className="m-1 btn btn-primary" type="submit" value="Submit" />
      </form>
    </Modal>
  }
  
  render() {
    const { selectedNode, onUndo, onRedo, canUndo, canRedo } = this.props;

    const content = selectedNode ? JSON.stringify(selectedNode.serialize(), null, 2) : '';

    return (
      <div className='controls'>
        <div>
          <button className="m-1 btn btn-primary" onClick={onUndo} disabled={!canUndo}>Undo</button>
          <button className="m-1 btn btn-primary" onClick={onRedo} disabled={!canRedo}>Redo</button>
          <br/>
          <button className="m-1 btn btn-primary" onClick={this.openModal} disabled={!selectedNode}>Edit Node</button>
          <br/>
          <input className="m-1 btn btn-primary" id="myInput"
            type="file"
            ref={(ref) => this.upload = ref}
            style={{display: 'none'}}
            onChange={this.loadWorkflow}
          />
          <button className="m-1 btn btn-primary" onClick={()=>{this.upload.click()}}>Load Workflow</button>
          <button className="m-1 btn btn-primary" onClick={this.saveWorkflow}>Save Workflow</button>
          <br/>
          <button className="m-1 btn btn-primary" onClick={this.generateWorkflow}>Generate Workflow</button>
        </div>
        <pre>
          {content}
        </pre>
        { this.getModal() }
      </div>
    );
  }
}
