import "./App.css";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import React, { useContext } from "react";
import { GlobalStateContext } from "./reducer/GlobalState";
import Modal from "./components/Modal";

function App() {
  const [state, dispatch] = useContext(GlobalStateContext);

  return (
    <div className="App">
      <div className="header">
        <h2 className="heading">
          <span>A</span>dvanced <span>E</span>ncryption Technique for Cloud{" "}
          <span>S</span>torage
        </h2>

        <p
          style={{
            fontSize: ".9rem",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Major Project of Batch 33 from CSE-3, KITS Warangal, 506015
        </p>
      </div>

      {state.show_modal && <Modal />}
      <div className="home">
        {state.curr_user === -1 && <LoginForm />}
        {state.curr_user !== -1 && <Home />}
      </div>
    </div>
  );
}

export default App;
