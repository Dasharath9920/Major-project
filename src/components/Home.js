import React, { useContext, useState, useEffect } from "react";
import "./Home.css";
import { GlobalStateContext } from "../reducer/GlobalState";
import { TextField, Button } from "@mui/material";
import Aes from "./Aes";

function Home() {
  const [state, dispatch] = useContext(GlobalStateContext);
  const utf8 = require("utf8");

  const [input, setInput] = useState("");
  const curr_user = state.curr_user;

  const encrypt = (text, password, nBits) => {
    let blockSize = 16;
    if (!(nBits === 128 || nBits === 192 || nBits === 256)) return "";

    text = utf8.encode(String(text));
    password = utf8.encode(String(password));

    let nBytes = nBits / 8;
    let pwBytes = new Array(nBytes);

    // Conversion of characters to ascii values
    for (let i = 0; i < nBytes; i++) {
      pwBytes[i] = !password.charCodeAt(i) ? 0 : password.charCodeAt(i);
    }
    // console.log(pwBytes);

    let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
    key = key.concat(key.slice(0, nBytes - 16));

    let counterBlock = new Array(blockSize);

    let nonce = new Date().getTime();
    let nonceMs = nonce % 1000;
    let nonceSec = Math.floor(nonce / 1000);
    let nonceRnd = Math.floor(Math.random() * 0xffff);

    for (let i = 0; i < 2; i++) counterBlock[i] = (nonceMs >>> (i * 8)) & 0xff;
    for (let i = 0; i < 2; i++)
      counterBlock[i + 2] = (nonceRnd >>> (i * 8)) & 0xff;
    for (let i = 0; i < 4; i++)
      counterBlock[i + 4] = (nonceSec >>> (i * 8)) & 0xff;

    let ctrTxt = "";
    for (let i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

    let keySchedule = Aes.keyExpansion(key);
    let blockCount = Math.ceil(text.length / blockSize);
    let cipherTxt = new Array(blockCount);

    for (let b = 0; b < blockCount; b++) {
      for (let c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> (c * 8)) & 0xff;
      for (let c = 0; c < 4; c++)
        counterBlock[15 - c - 4] = (b / 0x100000000) >>> (c * 8);

      let cipherCntr = Aes.cipher(counterBlock, keySchedule);

      let blockLength =
        b < blockCount - 1 ? blockSize : ((text.length - 1) % blockSize) + 1;
      let cipherChar = new Array(blockLength);

      for (let i = 0; i < blockLength; i++) {
        cipherChar[i] = cipherCntr[i] ^ text.charCodeAt(b * blockSize + i);
        cipherChar[i] = String.fromCharCode(cipherChar[i]);
      }
      cipherTxt[b] = cipherChar.join("");
    }

    let ciphertext = ctrTxt + cipherTxt.join("");
    ciphertext = btoa(ciphertext);

    return ciphertext;
  };

  const decrypt = (ciphertext, password, nBits) => {
    let blockSize = 16;
    if (!(nBits === 128 || nBits === 192 || nBits === 256)) return "";
    ciphertext = atob(ciphertext);
    password = utf8.encode(String(password));

    let nBytes = nBits / 8;
    let pwBytes = new Array(nBytes);
    for (let i = 0; i < nBytes; i++) {
      pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
    }
    let key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
    key = key.concat(key.slice(0, nBytes - 16));

    let counterBlock = new Array(8);
    let ctrTxt = ciphertext.slice(0, 8);
    for (let i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

    let keySchedule = Aes.keyExpansion(key);

    let nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
    let ct = new Array(nBlocks);
    for (let b = 0; b < nBlocks; b++)
      ct[b] = ciphertext.slice(
        8 + b * blockSize,
        8 + b * blockSize + blockSize
      );
    ciphertext = ct;

    let plaintxt = new Array(ciphertext.length);

    for (let b = 0; b < nBlocks; b++) {
      for (let c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> (c * 8)) & 0xff;
      for (let c = 0; c < 4; c++)
        counterBlock[15 - c - 4] =
          (((b + 1) / 0x100000000 - 1) >>> (c * 8)) & 0xff;

      let cipherCntr = Aes.cipher(counterBlock, keySchedule);

      let plaintxtByte = new Array(ciphertext[b].length);
      for (let i = 0; i < ciphertext[b].length; i++) {
        plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
        plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
      }
      plaintxt[b] = plaintxtByte.join("");
    }

    let plaintext = plaintxt.join("");
    plaintext = utf8.decode(plaintext);

    return plaintext;
  };

  const decryptText = (text) => {
    if (text.length === 0) return "";
    let password = "This is confidential";
    const originalText = decrypt(text, password, 256);
    return originalText;
  };

  const encryptText = (text) => {
    if (text.length === 0) return "";
    let password = "This is confidential";
    const cipherText = encrypt(text, password, 256);
    return cipherText;
  };

  const upload = () => {
    const encrypted_data = encryptText(input);
    dispatch({
      type: "ADD_USER_DATA",
      pos: curr_user,
      user_data: encrypted_data,
    });

    dispatch({
      type: "UPDATE_MODAL_MESSAGE",
      msg1: "Data Successfully uploaded!!!",
      msg2: "Now you can logout for security purpose.",
    });

    dispatch({
      type: "SHOW_MODAL",
      show_modal: true,
    });

    setTimeout(() => {
      dispatch({
        type: "SHOW_MODAL",
        show_modal: false,
      });
    }, 3000);
  };

  const decryptToggle = () => {
    dispatch({
      type: "DECRYPT",
      decrypt: !state.decrypt,
    });
  };

  const logout = () => {
    dispatch({
      type: "DECRYPT",
      decrypt: false,
    });
    dispatch({
      type: "LOGOUT",
    });
  };

  useEffect(() => {
    let user_data = state.user_data[curr_user];
    if (state.decrypt) user_data = decryptText(user_data);
    setInput(user_data);
  }, [state.decrypt]);

  useEffect(() => {
    let user_data = state.user_data[curr_user];
    setInput(user_data);
  }, []);

  return (
    <div className="home">
      <div className="home__header">
        <h2>
          Data owner:{" "}
          <span
            style={{
              color: "crimson",
              textTransform: "capitalize",
              fontSize: "1.6rem",
            }}
          >
            {state.users[state.curr_user]?.user_name}
          </span>{" "}
        </h2>

        <Button onClick={logout}>Logout</Button>
      </div>

      <TextField
        className="user_data"
        rows={10}
        value={input}
        multiline={true}
        onChange={(e) => setInput(e.target.value)}
      >
        hello
      </TextField>

      <div className="buttons">
        <Button
          className="login-btn"
          color="primary"
          variant="contained"
          onClick={upload}
          disabled={!state.decrypt}
          size="large"
        >
          Upload
        </Button>
        <Button
          className="login-btn"
          color="success"
          variant="contained"
          onClick={decryptToggle}
          size="large"
        >
          {state.decrypt ? "Encrypt" : "Decrypt"}
        </Button>
      </div>
    </div>
  );
}

export default Home;
