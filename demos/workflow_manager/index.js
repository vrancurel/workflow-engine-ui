import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { store } from './store';
import { WorkflowManager } from './workflow_manager';

window.onload = () => {
  const rootEl = document.getElementById('root');
  const render = Component => {
    ReactDOM.render(
      <Provider store={store}>
        <AppContainer>
          <Component />
        </AppContainer>
      </Provider>,
      rootEl
    );
  };

  render(WorkflowManager);
  if (module.hot) module.hot.accept('./workflow_manager', () => render(WorkflowManager));
};
