/* eslint-env jest */

import React from 'react';
import toJson from 'enzyme-to-json';

import { mountWithIntl, shallowWithIntl } from 'testutils';

import Button from '../Button.jsx';

describe('Button component', () => {
  test('Renders initial component', () => {
    const wrapper = shallowWithIntl(<Button value="Some Text" />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('renders a plain value', () => {
    const wrapper = mountWithIntl(<Button value="Some Text" />);
    expect(wrapper.text()).toBe('Some Text');
  });

  test('renders an intl message', () => {
    const intlMessage = {
      id: 'intl id',
      defaultMessage: 'intl default message',
    };
    const wrapper = mountWithIntl(<Button value={intlMessage} />);
    expect(wrapper.text()).toBe('intl default message');
  });

  test('renders a child element', () => {
    const wrapper = mountWithIntl(
      <Button>
        <p>Child test</p>
      </Button>,
    );
    // https://github.com/airbnb/enzyme/blob/master/docs/guides/migration-from-2-to-3.md#children-now-has-slightly-different-meaning
    expect(
      wrapper
        .children()
        .children()
        .children()
        .html(),
    ).toBe('<p>Child test</p>');
  });

  test('button is busy when loading', () => {
    const wrapper = shallowWithIntl(<Button value="Some Text" loading />);
    expect(wrapper.html()).toContain('aria-busy="true"');
  });

  test('button is disabled', () => {
    const wrapper = shallowWithIntl(<Button value="Some Text" disabled />);
    expect(wrapper.prop('disabled')).toBe(true);
  });

  test('button has custom props', () => {
    const wrapper = shallowWithIntl(
      <Button value="Some Text" data-test="test additional props" />,
    );
    expect(wrapper.prop('data-test')).toBe('test additional props');
  });
});
