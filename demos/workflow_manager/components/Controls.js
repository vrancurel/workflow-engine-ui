import React from 'react';
import WorkflowEngineDefs from 'workflow-engine-defs';
import { diagramModel } from './Diagram';
import { diagramEngine } from './Engine';

export class Controls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFileName: false,
      fileName: undefined
    };

    this.newWorkflow = this.newWorkflow.bind(this);
    this.loadWorkflow = this.loadWorkflow.bind(this);
    this.saveWorkflow = this.saveWorkflow.bind(this);
    this.checkWorkflow = this.checkWorkflow.bind(this);
    this.uploadWorkflow = this.uploadWorkflow.bind(this);
    this.inputChanged = this.inputChanged.bind(this);
    this.setFileName = this.setFileName.bind(this);
    this.cancelFileName = this.cancelFileName.bind(this);
    this.okFileName = this.okFileName.bind(this);
  }

  inputChanged(e) {
    e.preventDefault();
    this.setState({
      fileName: e.target.value,
    });
  }

  cancelFileName(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      showFileName: false,
      fileName: undefined
    });
  }

  okFileName(event) {
    const { model } = this.props;
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      showFileName: false
    });
  }

  setFileName(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({
      showFileName: true
    });
  }

  effectivelyLoadWorkflow(newModel) {
    this.props.updateModel(newModel, { selectedNode: null });
  }

  newWorkflow(event) {
    event.stopPropagation();
    event.preventDefault();
    const wed = new WorkflowEngineDefs();
    this.setState({
      fileName: undefined,
    });
    const newModel = wed.generateNewModel();
    this.props.updateModel(newModel, { selectedNode: null });
  }
  
  loadWorkflow(event) {
    event.stopPropagation();
    event.preventDefault();
    var file = event.target.files[0];
    const that = this;
    const reader = new FileReader();
    reader.onload = function(e) {
      that.effectivelyLoadWorkflow(JSON.parse(e.target.result));
    };
    reader.readAsText(file);
  }
  
  saveWorkflow(event) {
    const { model } = this.props;
    if (this.state.fileName === undefined) {
      window.confirm('missing file name');
      return ;
    }
    event.stopPropagation();
    event.preventDefault();
    const contentType = 'application/json;charset=utf-8;';
    const a = document.createElement('a');
    a.download = this.state.fileName;
    const modelEncoded = encodeURIComponent(JSON.stringify(model));
    a.href = `data:${contentType},${modelEncoded}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  checkWorkflow() {
    const { model } = this.props;
    const wed = new WorkflowEngineDefs(model);
    try {
      wed.checkModel();
    } catch (err) {
      window.confirm(err.message);
    }
  }

  uploadWorkflow() {
    const { model } = this.props;
    const wed = new WorkflowEngineDefs(model);
    if (this.state.fileName === undefined) {
      window.confirm('set a file name to workflow');
      return ;
    }
    try {
      wed.checkModel();
    } catch (err) {
      window.confirm(err.message);
      return ;
    }
    const content = JSON.stringify(model);
    const filename = this.state.fileName;
    const form = new FormData();
    form.append('data', new File([new Blob([content])], filename));
    
    window.fetch('http://localhost:3001/upload', {
      method: 'POST',
      mode: 'no-cors',
      body: form
    }).then(response => {
      // expecting opaque response
    }).catch(err => {
      window.confirm('Failed to upload');
    });
  }

  render() {
    const { selectedNode, onUndo, onRedo, canUndo, canRedo } = this.props;

    const content = selectedNode ?
      JSON.stringify(selectedNode.serialize(), null, 2) : '';

    const showFileName = () => {
      if (this.state.showFileName) {
        return <div>
          <div>
            <input className='workflow-name'
              type="text"
              name="name"
              defaultValue={this.state.fileName}
              onChange={this.inputChanged}/>
          </div>
          <div className='workflow-name-button'>
            <button
              onClick={this.cancelFileName}>
              Cancel
            </button>
            <button
              onClick={this.okFileName}>
              Ok
            </button>
          </div>
        </div>;
      }
    };

    return (
      <div className='controls'>
        <div>
          <div className="box-border">
            <div className="box-title">
              <label>Edit</label>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={onUndo}
                disabled={!canUndo}>
                <span className="fa fa-undo"/>Undo</button>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={onRedo}
                disabled={!canRedo}>
                <span className="fa fa-repeat"/>Redo</button>
            </div>
          </div>
          <div className="box-border">
            <div className="box-title">
              <label>Workflow</label>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={this.newWorkflow}>
                <span className="fa fa-plus"/>New</button>
            </div>
            <div>
              <input className="m-1 btn btn-w btn-primary" id="myInput"
                type="file"
                ref={ (ref) => this.upload = ref }
                style={ { display: 'none' } }
                onChange={ this.loadWorkflow }
              />
              <button className="m-1 btn btn-w btn-primary"
                onClick={ () => { this.upload.click(); } }>
                <span className="fa fa-file"/>Load</button>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={ this.saveWorkflow }>
                <span className="fa fa-save"/>Save</button>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={ this.checkWorkflow }>
                <span className="fa fa-check"/>Check</button>
            </div>
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={this.setFileName}>
                <span className="fa fa-chevron-right"/>Set File Name</button>
            </div>
            { showFileName() }
            <div>
              <button className="m-1 btn btn-w btn-primary"
                onClick={ this.uploadWorkflow }>
                <span className="fa fa-upload"/>Upload</button>
            </div>
          </div>
        </div>
        <pre>
          { content }
        </pre>
      </div>
    );
  }
}
