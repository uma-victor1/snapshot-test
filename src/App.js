// import React from 'react';
// import UserCard from './Components/UserCard/UserCard';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <UserCard />
//     </div>
//   );
// }

// export default App;

import React from "react";
import UserCard from "./Components/UserCard/UserCard";
import { mockUsers } from "./__mocks__/testData";
import "./App.css";

function App() {
  const handleContact = (userName) => {
    alert(`Contacting ${userName}...`);
  };

  return (
    <div className="App">
      <h1>SNAPSHOT - TESTING</h1>

      <div className="cards-container">
        {mockUsers.map((user, index) => (
          <UserCard
            key={index}
            user={user}
            showEmail={true}
            showBio={true}
            theme="light"
            onContactClick={() => handleContact(user.name)}
          />
        ))}
      </div>

      <div className="cards-container" style={{ marginTop: "40px" }}>
        <h2>Dark Theme Examples</h2>
        {mockUsers.map((user, index) => (
          <UserCard
            key={`dark-${index}`}
            user={user}
            showEmail={true}
            showBio={true}
            theme="dark"
            onContactClick={() => handleContact(user.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
