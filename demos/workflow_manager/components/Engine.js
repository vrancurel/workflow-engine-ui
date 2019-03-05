import React from 'react';
import * as RJD from '../../../src/main';
import { SourceWidgetFactory } from './nodes/source/SourceWidgetFactory';
import { SourceNodeFactory } from './nodes/source/SourceInstanceFactories';
import { TargetWidgetFactory } from './nodes/target/TargetWidgetFactory';
import { TargetNodeFactory } from './nodes/target/TargetInstanceFactories';
import { FilterWidgetFactory } from './nodes/filter/FilterWidgetFactory';
import { FilterNodeFactory } from './nodes/filter/FilterInstanceFactories';
import { DecisionWidgetFactory } from './nodes/decision/DecisionWidgetFactory';
import { DecisionNodeFactory } from './nodes/decision/DecisionInstanceFactories';

// Setup the diagram engine
export const diagramEngine = new RJD.DiagramEngine();
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new SourceWidgetFactory());
diagramEngine.registerNodeFactory(new TargetWidgetFactory());
diagramEngine.registerNodeFactory(new FilterWidgetFactory());
diagramEngine.registerNodeFactory(new DecisionWidgetFactory());

// Register instance factories
diagramEngine.registerInstanceFactory(new RJD.DefaultNodeInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.DefaultPortInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.LinkInstanceFactory());
diagramEngine.registerInstanceFactory(new SourceNodeFactory());
diagramEngine.registerInstanceFactory(new TargetNodeFactory());
diagramEngine.registerInstanceFactory(new FilterNodeFactory());
diagramEngine.registerInstanceFactory(new DecisionNodeFactory());
