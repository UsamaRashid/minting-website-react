import React from "react";

import "./App.css";
import Collection from "./components/Collection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position='top-center' />
      <Collection />
    </>
  );
}

export default App;
