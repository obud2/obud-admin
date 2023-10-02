import ReactDOM from "react-dom";

type Props = {
  children: React.ReactNode;
};

const SubMain = ({ children }: Props) => {
  const el = document.getElementById("subRoot");

  if (!el) return null;

  return ReactDOM.createPortal(children, el);
};

export default SubMain;
