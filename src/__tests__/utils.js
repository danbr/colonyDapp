/* @flow */
/* eslint-env jest */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { IntlProvider, intlShape } from 'react-intl';

import messages from '../i18n/en.json';
// import { NOTIFICATIONS_ADD } from './modules/core/components/Notifications/notificationsActionTypes';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider(
  { locale: 'en', messages, children: [] },
  {},
);
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node: any) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node: any, { context }: Object = {}) {
  return shallow(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
  });
}

export function mountWithIntlContext(
  node: any,
  { context, childContextTypes }: Object = {},
) {
  return mount(node, {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign(
      {},
      { intl: intlShape },
      childContextTypes,
    ),
  });
}

export function mountWithIntl(
  node: any,
  { context, childContextTypes }: Object = {},
) {
  return mount(nodeWithIntlProp(node), {
    context: Object.assign({}, context, { intl }),
    childContextTypes: Object.assign(
      {},
      { intl: intlShape },
      childContextTypes,
    ),
  });
}
