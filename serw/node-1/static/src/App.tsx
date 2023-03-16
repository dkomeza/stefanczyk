import { useState, useRef } from "react";

import Chat from "./components/Chat";

import "./scss/iPhone14Pro.scss";

function App() {
  const [username, setUsername] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  return (
    <div className="App">
      <div className="device device-iphone-14">
        <div className="device-frame">
          <div className="device-screen">
            {!username && (
              <main>
                <div className="header">
                  <h1>Enter your username</h1>
                </div>
                <form
                  className="body login"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setUsername(usernameRef.current!.value);
                  }}
                >
                  <input type="text" ref={usernameRef} required />
                  <button>Login</button>
                </form>
              </main>
            )}
            {username && (
              <main>
                <div className="header">
                  <h1>Hello, {username}!</h1>
                </div>
                <div className="body">
                  <Chat username={username} />
                </div>
              </main>
            )}
          </div>
        </div>
        <div className="device-stripe"></div>
        <div className="device-header"></div>
        <div className="device-sensors"></div>
        <div className="device-btns"></div>
        <div className="device-power"></div>
        <div className="device-home"></div>
      </div>
    </div>
  );
}

export default App;
