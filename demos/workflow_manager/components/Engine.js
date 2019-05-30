import React from 'react';
import * as RJD from '../../../src/main';
import { SourceWidgetFactory } from './nodes/source/SourceWidgetFactory';
import { SourceNodeFactory } from './nodes/source/SourceInstanceFactories';
import { TargetWidgetFactory } from './nodes/target/TargetWidgetFactory';
import { TargetNodeFactory } from './nodes/target/TargetInstanceFactories';
import { TagWidgetFactory } from './nodes/tag/TagWidgetFactory';
import { TagNodeFactory } from './nodes/tag/TagInstanceFactories';
import { FunctionWidgetFactory } from './nodes/function/FunctionWidgetFactory';
import { FunctionNodeFactory } from './nodes/function/FunctionInstanceFactories';
import { DecisionWidgetFactory } from './nodes/decision/DecisionWidgetFactory';
import { DecisionNodeFactory } from './nodes/decision/DecisionInstanceFactories';

// Setup the diagram engine
export const diagramEngine = new RJD.DiagramEngine();
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new SourceWidgetFactory());
diagramEngine.registerNodeFactory(new TargetWidgetFactory());
diagramEngine.registerNodeFactory(new TagWidgetFactory());
diagramEngine.registerNodeFactory(new FunctionWidgetFactory());
diagramEngine.registerNodeFactory(new DecisionWidgetFactory());

// Register instance factories
diagramEngine.registerInstanceFactory(new RJD.DefaultNodeInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.DefaultPortInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.LinkInstanceFactory());
diagramEngine.registerInstanceFactory(new SourceNodeFactory());
diagramEngine.registerInstanceFactory(new TargetNodeFactory());
diagramEngine.registerInstanceFactory(new TagNodeFactory());
diagramEngine.registerInstanceFactory(new FunctionNodeFactory());
diagramEngine.registerInstanceFactory(new DecisionNodeFactory());
