import React from "react";
import ReactDOM from "react-dom";

const New3dGraph = () => {
  return ReactDOM.createPortal(
    <div style={{ width: "500px", height: "500px", backgroundColor: "black" }}>
      asfsafs
    </div>,
    document.getElementById("graph-root") as HTMLElement
  );
};

export default New3dGraph;
