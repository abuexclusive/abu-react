import React from 'react';
// import ReactDOM from 'react-dom';
// import * as React from './react';
import * as ReactDOM from './react-dom';


// const element = React.createElement(
//   'div',
//   {
//     id: 'sky',
//     key: 'halo',
//     title: 'halo',
//   },
//   'halo',
//   React.createElement(
//     'span',
//     null,
//     'world'
//   ),
// );

// const element = (
//   <div id="sky" key="halo">
//     <h1>
//       first child
//     </h1>
//     <h2>
//       h1 sibling child
//       <p>456</p>
//     </h2>
//     <h3>h2 sibling child</h3>
//   </div>
// );


// console.log(element);
// ReactDOM.render(element, document.getElementById('root'));

// class App extends React.Component {
  
//   render() {
//     return (
//       <div>
//         <h1>abc</h1>
//         <h2>
//           123
//           <p>456</p>
//         </h2>
//         <h3>
//           <span></span>
//         </h3>
//       </div>
//     );
//   };
// }

// function App() {
//   return (
//     <div>
//       <h1>abc</h1>
//       <h2>
//         123
//         <p>456</p>
//       </h2>
//       <h3>
//         <span></span>
//       </h3>
//     </div>
//   );
// }

// ReactDOM.render(<App name="app" key="sky" />, document.getElementById('root'));

const element = (
  <div name="app" key="sky">
    <h1>abc</h1>
    <h2>
      123
      <p>456</p>
    </h2>
    <h3>
      <span></span>
    </h3>
  </div>
);


ReactDOM.render(element, document.getElementById('root'));


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// ReactDOM.render(element, document.getElementById('root'))
