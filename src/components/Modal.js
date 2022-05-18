import React, { useContext } from "react";
import "./Modal.css";
import "./LoginForm.css";
import { Button } from "@mui/material";
import { GlobalStateContext } from "../reducer/GlobalState";

function Modal() {
  const [state, dispatch] = useContext(GlobalStateContext);
  let color = "green";
  if (state.modal_msg1.length && state.modal_msg1[0] === "I") color = "red";

  return (
    <div className="modal">
      <h1 className="warning" style={{ color: color }}>
        {state.modal_msg1}
      </h1>
      <h2 className="suggest">{state.modal_msg2}</h2>

      <div className="buttons">
        <Button
          className="login-btn"
          color="secondary"
          variant="contained"
          onClick={() =>
            dispatch({
              type: "SHOW_MODAL",
              show_modal: !state.show_modal,
            })
          }
          size="large"
        >
          Got It
        </Button>
      </div>
    </div>
  );
}

export default Modal;
