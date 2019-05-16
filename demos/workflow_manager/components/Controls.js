import React from 'react';
import Modal from 'react-modal';
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

  inputChanged(e) {
    const { selectedNode } = this.props;
    if (!selectedNode) {
      throw new Error('a node shall be selected');
    }
    if (e.target.name === 'synchronous') {
      if (this.state.synchronous === undefined) {
        e.target.value = selectedNode.synchronous ? 'off' : 'on';
      } else {
        e.target.value = this.state.synchronous === 'on' ? 'off' : 'on';
      }
    } else {
      e.preventDefault();
    }
    this.setState({ [e.target.name]: e.target.value });
  }

  resetState() {
    this.state.name = undefined;
    this.state.subType = undefined;
    this.state.func = undefined;
    this.state.script = undefined;
    this.state.synchronous = undefined;
  }
  
  modifyNodeCb(node, arg) {
    if (arg.name !== undefined) {
      node.name = arg.name;
    }
    if (arg.subType !== undefined) {
      node.subType = arg.subType;
    }
    if (arg.func !== undefined) {
      node.func = arg.func;
    }
    if (arg.script !== undefined) {
      node.script = arg.script;
    }
    if (arg.synchronous !== undefined) {
      node.synchronous = arg.synchronous === 'on' ? true : false;
    }
  }

  handleSubmit(type) {
    return e => {
      e.preventDefault();
      const { selectedNode } = this.props;
      if (selectedNode) {
        let arg = {};
        arg.type = type;
        arg.name = this.state.name;
        arg.subType = this.state.subType;
        arg.func = this.state.func;
        arg.script = this.state.script;
        arg.synchronous = this.state.synchronous;
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
    let type = '';
    let name = '';
    let subType = 'undefined';
    let subTypes = ['undefined'];
    let script = '';
    let synchronous = true;
    let func = '';
    if (selectedNode) {
      type = selectedNode.nodeType;
      name = selectedNode.name;
      subType = selectedNode.subType;
      func = selectedNode.func;
      script = selectedNode.script;
      synchronous = selectedNode.synchronous;
      if (type === wed.SOURCE) {
        subTypes = wed.sourceTypes;
      } else if (type === wed.TARGET) {
        subTypes = wed.targetTypes;
      } else if (type === wed.FILTER) {
        subTypes = wed.filterTypes;
      }
    }
    if (this.state.synchronous !== undefined) {
      synchronous = this.state.synchronous === 'on' ? true : false;
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
        <div>
          <label className="modal-label">Name: </label>
          <input type="text" name="name" defaultValue={name} onChange={this.inputChanged}/>
        </div>
        <div>
          <label className="modal-label">Sub Type: </label>
          <select className="m-1 btn btn-primary" name="subType" defaultValue={subType} onChange={this.inputChanged}>/>
            {
              subTypes.map(t => { 
                return (<option key={t} value={t}>{t}</option>);
              })
            }
          </select>
        </div>
        <div>
          <label className="modal-label">Function: </label>
          <input type="text" name="func" defaultValue={func} onChange={this.inputChanged}/>
        </div>
        <div>
          <label className="modal-label">Script: </label>
          <pre>
            <textarea name="script" defaultValue={script} onChange={this.inputChanged} rows='8' cols='40'/>
          </pre>
        </div>
        <div>
          <label className="modal-label">Synchronous: </label>
          <input type="checkbox" name="synchronous" defaultChecked={synchronous} onChange={this.inputChanged}/>
        </div>
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
