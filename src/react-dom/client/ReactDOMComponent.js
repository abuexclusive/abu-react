import { setValueForProperty } from "./DOMPropertyOperations";

const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const SUPPRESS_CONTENT_EDITABLE_WARNING = 'suppressContentEditableWarning';
const SUPPRESS_HYDRATION_WARNING = 'suppressHydrationWarning';
const AUTOFOCUS = 'autoFocus';
const CHILDREN = 'children';
const STYLE = 'style';


function setInitialDOMProperties(tag, domElement, nextProps) {
  // console.log(tag, domElement, nextProps);
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    // propKey key
    // nextProp value
    const nextProp = nextProps[propKey];
    if (propKey === STYLE) {
      
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
     
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === 'string' || typeof nextProp === 'number') {
        setTextContent(domElement, nextProp);
      }
    } else if (
      propKey === SUPPRESS_CONTENT_EDITABLE_WARNING ||
      propKey === SUPPRESS_HYDRATION_WARNING
    ) {
      // Noop
    } else if (propKey === AUTOFOCUS) {

    } else if (nextProp != null) {
      setValueForProperty(domElement, propKey, nextProp);
    }
  }
}


export function createElement(type, props) {
  const domElement = document.createElement(type);
  return domElement;
}

export function setInitialProperties(domElement, tag, rawProps) {
  setInitialDOMProperties(tag, domElement, rawProps);
}

function setTextContent(node, text) {
  node.textContent = text;
}