import { useState, useRef } from "react";

import Chat from "./components/Chat";

function App() {
  const [username, setUsername] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);

  return (
    <div className="App">
      {!username && (
        <main>
          <h1>Enter your username</h1>
          <input type="text" ref={usernameRef} required />
          <button onClick={() => setUsername(usernameRef.current!.value)}>
            Submit
          </button>
        </main>
      )}
      {username && (
        <main>
          <h1>Hello, {username}!</h1>
          <Chat username={username} />
        </main>
      )}
    </div>
  );
}

export default App;
