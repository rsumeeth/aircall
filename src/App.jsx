import React from "react";
import ReactDOM from "react-dom";
import { InboxFeed } from "./components/inboxFeed/inboxFeed.js";
import CallListComponent from "./components/callListComponent.js";
import Header from "./Header.jsx";

const App = () => {
  return (
    <div className="container">
      <Header />
      {/* <InboxFeed /> */}
      <CallListComponent />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
