import React from 'react';
// import ReactDOM from 'react-dom';
// import * as React from './react';
import * as ReactDOM from './react-dom';



const singleMountWork = document.getElementById('singleMount');
const singleUpdateWork = document.getElementById('singleUpdate');
const childrenMountWork = document.getElementById('childrenMount');

singleMountWork.addEventListener('click', () => {
  const element = (
    <div key="app" id="title">title</div>
  );
  ReactDOM.render(element, document.getElementById('root'));

});

singleUpdateWork.addEventListener('click', () => {
  const element = (
    <div key="app" id="title2">title2</div>
  );
  ReactDOM.render(element, document.getElementById('root'));

});

childrenMountWork.addEventListener('click', () => {
  const element = (
    <ul key="list">
      <li key="a">a</li>
      <li key="b">b</li>
      <li key="c">c</li>
    </ul>
  );
  ReactDOM.render(element, document.getElementById('root'));

});
