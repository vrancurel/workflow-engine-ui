import React from 'react';
import * as RJD from '../../../src/main';
import { DataWidgetFactory } from './nodes/data/DataWidgetFactory';
import { DataNodeFactory } from './nodes/data/DataInstanceFactories';
import { SearchWidgetFactory } from './nodes/search/SearchWidgetFactory';
import { SearchNodeFactory } from './nodes/search/SearchInstanceFactories';
import { TagWidgetFactory } from './nodes/tag/TagWidgetFactory';
import { TagNodeFactory } from './nodes/tag/TagInstanceFactories';
import { FunctionWidgetFactory } from './nodes/function/FunctionWidgetFactory';
import { FunctionNodeFactory } from './nodes/function/FunctionInstanceFactories';
import { DecisionWidgetFactory } from './nodes/decision/DecisionWidgetFactory';
import { DecisionNodeFactory } from './nodes/decision/DecisionInstanceFactories';
import { StopperWidgetFactory } from './nodes/stopper/StopperWidgetFactory';
import { StopperNodeFactory } from './nodes/stopper/StopperInstanceFactories';
import { UpdateWidgetFactory } from './nodes/update/UpdateWidgetFactory';
import { UpdateNodeFactory } from './nodes/update/UpdateInstanceFactories';

// Setup the diagram engine
export const diagramEngine = new RJD.DiagramEngine();
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new DataWidgetFactory());
diagramEngine.registerNodeFactory(new SearchWidgetFactory());
diagramEngine.registerNodeFactory(new TagWidgetFactory());
diagramEngine.registerNodeFactory(new FunctionWidgetFactory());
diagramEngine.registerNodeFactory(new DecisionWidgetFactory());
diagramEngine.registerNodeFactory(new StopperWidgetFactory());
diagramEngine.registerNodeFactory(new UpdateWidgetFactory());

// Register instance factories
diagramEngine.registerInstanceFactory(new RJD.DefaultNodeInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.DefaultPortInstanceFactory());
diagramEngine.registerInstanceFactory(new RJD.LinkInstanceFactory());
diagramEngine.registerInstanceFactory(new DataNodeFactory());
diagramEngine.registerInstanceFactory(new SearchNodeFactory());
diagramEngine.registerInstanceFactory(new TagNodeFactory());
diagramEngine.registerInstanceFactory(new FunctionNodeFactory());
diagramEngine.registerInstanceFactory(new DecisionNodeFactory());
diagramEngine.registerInstanceFactory(new StopperNodeFactory());
diagramEngine.registerInstanceFactory(new UpdateNodeFactory());
