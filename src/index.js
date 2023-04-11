// import React from 'react';
// import ReactDOM from 'react-dom';
import * as React from './react';
import * as ReactDOM from './react-dom';


const element = React.createElement(
  'div',
  {
    id: 'sky',
    key: 'halo',
    title: 'halo',
  },
  'halo',
  React.createElement(
    'span',
    null,
    'world'
  ),
);

// console.log(element);

ReactDOM.render(element, document.getElementById('root'));


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// ReactDOM.render(element, document.getElementById('root'))
