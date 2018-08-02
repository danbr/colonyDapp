/* @flow */

import { createElement } from 'react';
import { render } from 'react-dom';

import './styles/main.css';
import './modules/validations';

import App from './App.jsx';

const rootNode = document.getElementById('root');

if (rootNode) {
  render(createElement(App), rootNode);
}
