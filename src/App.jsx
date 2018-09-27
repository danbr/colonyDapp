/* @flow */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';

import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import layout from '~styles/layout.css';

import messages from './i18n/en.json';
import rootReducer from './reducer';

import ConnectWallet from './modules/wallet/components/ConnectWallet';

/* eslint-disable-next-line max-len */
import AsyncComponentLoader from './modules/core/components/AsyncComponentLoader';
/* eslint-disable-next-line max-len */
import CreateColonyWizard from './modules/dashboard/components/CreateColonyWizard';
import Dashboard from './modules/dashboard/components/Dashboard';
import WalletStart from './modules/wallet/components/WalletStart';
import UserProfile from './modules/users/components/UserProfile';
import UserProfileEdit from './modules/users/components/UserProfileEdit';
import ProfileCreate from './modules/wallet/components/ProfileCreate';
import CreateWalletWizard from './modules/wallet/components/CreateWalletWizard';
import { SpinnerLoader } from './modules/core/components/Preloaders';
/* eslint-disable-next-line max-len */
import DialogProvider from './modules/core/components/Dialog/DialogProvider.jsx';
/* eslint-disable-next-line max-len */
import ActivityBarExample from './modules/core/components/ActivityBar/ActivityBarExample.jsx';

addLocaleData(en);

const dialogComponents = {
  // Hint: Once we have the gas station we just have to add it here
  ActivityBarExample,
};

const store = createStore(
  rootReducer,
  // eslint-disable-next-line no-underscore-dangle
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

const Home = () => (
  <div>
    <ul>
      <li>
        <NavLink style={{ color: 'blue' }} to="/dynamic-import-route">
          Dynamic Import Route
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/createcolony">
          Create Colony Wizard
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/dashboard">
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/start">
          Start
        </NavLink>
      </li>
      <li>
        <NavLink style={{ color: 'blue' }} to="/profile">
          User Profile
        </NavLink>
      </li>
    </ul>
    <p>Hello World</p>
    {/*
     * This component is used only as a test reference please remove when setting
     * this up properly. Thanks.
     */}
    <AsyncComponentLoader
      loaderFn={() => import('./DynamicComponent.jsx')}
      preloader={<SpinnerLoader appearance={{ size: 'medium' }} />}
    />
  </div>
);

/*
 * This component is used only as a test reference please remove when setting
 * this up properly. Thanks.
 */
const DynamicRoute = () => (
  <AsyncComponentLoader
    loaderFn={() => import('./DynamicRoute.jsx')}
    preloader={<SpinnerLoader appearance={{ size: 'medium' }} />}
  />
);

export default function App() {
  return (
    <IntlProvider locale="en" defaultLocale="en" messages={messages}>
      <DialogProvider dialogComponents={dialogComponents}>
        <Provider store={store}>
          <Router>
            <div className={layout.stretch}>
              <Route exact path="/" component={Home} />
              <Route path="/createcolony" component={CreateColonyWizard} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/dynamic-import-route" component={DynamicRoute} />
              <Route path="/start" component={WalletStart} />
              <Route path="/createwallet" component={CreateWalletWizard} />
              <Route
                path="/connectwallet/:provider"
                component={ConnectWallet}
              />
              <Route path="/profile" component={UserProfile} />
              {/* eslint-disable-next-line */}
              {/* TODO: to the router person: please find a way to have this be /profile/edit */}
              <Route path="/profileedit" component={UserProfileEdit} />
              <Route path="/createprofile" component={ProfileCreate} />
            </div>
          </Router>
        </Provider>
      </DialogProvider>
    </IntlProvider>
  );
}
