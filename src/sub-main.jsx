import ReactDOM from 'react-dom';

const SubMain = ({ children }) => {
  const el = document.getElementById('subRoot');
  return ReactDOM.createPortal(children, el);
};

export default SubMain;
