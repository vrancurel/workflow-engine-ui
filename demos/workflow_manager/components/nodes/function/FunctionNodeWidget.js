import React from 'react';
import WorkflowEngineDefs from 'workflow-engine-defs';
import * as RJD from '../../../../../src/main';
import { FunctionNodeModel } from './FunctionNodeModel';
import fissionLogo from './fission.png';
import azureLogo from './azure.png';
import awsLogo from './aws.png';
import googleLogo from './google.png';

export class FunctionNodeWidget extends React.Component {
  static defaultProps = {
    node: null,
    color: 'rgb(127, 255, 212)'
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
    let functionNode = node;

    if (displayOnly) {
      functionNode = new FunctionNodeModel(node.name, color);
    }

    return functionNode.getInPort ? <RJD.DefaultPortLabel model={functionNode.getInPort()} key='in-port' /> : null;
  }

  getOutPort() {
    const { node, color, displayOnly } = this.props;
    let functionNode = node;

    if (displayOnly) {
      functionNode = new FunctionNodeModel(node.name, color);
    }

    return functionNode.getOutPort ? <RJD.DefaultPortLabel model={functionNode.getOutPort()} key='out-port' /> : null;
  }

  render() {
    const { node, displayOnly, color: displayColor } = this.props;
    const { name, color } = node;
    const { subType, func, param, asynchronous } = node;
    const style = {};
    if (color || displayColor) {
      style.background = color || displayColor;
    }

    let text = '';
    if (subType !== undefined) {
      if (func !== undefined) {
        const MAXL = 8;
        if (func.length <= MAXL) {
          text = func;
        } else {
          text = func.substring(0, MAXL);
          text += '...';
        }
        text += '()';
      }
    }

    const wed = new WorkflowEngineDefs();

    const showLogo = () => {
      if (subType === wed.FISSION) {
        return <img className='function-logo' src={fissionLogo}/>;
      } else if (subType === wed.AZURE_FUNCTION) {
        return <img className='function-logo' src={azureLogo}/>;
      } else if (subType === wed.AWS_LAMBDA) {
        return <img className='function-logo' src={awsLogo}/>;
      } else if (subType === wed.GOOGLE_CLOUD_FUNCTION) {
        return <img className='function-logo' src={googleLogo}/>;
      } else {
        return '';
      }
    };

    const showSubType = () => {
      if (!displayOnly) {
        return <div className='sub-type'>
          <div className='function-main'>
            <div className="function-logo">
              { showLogo() }
            </div>
            <div className="function-text">
              {text}
            </div>
          </div>
        </div>;
      }
    };
    
    return (
      <div className='basic-node' style={style}>
        <div className='title'>
          <div className='name'>
            {name}
          </div>
          {!displayOnly ? <div className='fa fa-edit' onClick={this.onEdit.bind(this)} /> : null}
          {!displayOnly ? <div className='fa fa-close' onClick={this.onRemove.bind(this)} /> : null}
        </div>
        { showSubType() }
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

export const FunctionNodeWidgetFactory = React.createFactory(FunctionNodeWidget);
