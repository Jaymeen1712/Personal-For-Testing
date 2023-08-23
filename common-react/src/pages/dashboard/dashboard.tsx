import { Button } from "antd";
import Modal from "antd/es/modal/Modal";
import React, { useState } from "react";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button onClick={() => setShow(true)}>Click me</Button>
      <Modal
        open={show}
        onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        width="100%" // Set the width to 100%
        style={{ top: 0, height: "100%" }} // Set top to 0 and height to full viewport height
      >
        Hello world
      </Modal>
    </>
  );
};

export default Dashboard;
