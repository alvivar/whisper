import React from "react";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

function App() {
  return (
    <div className="container mx-auto max-w-xl">
      <div className="h-4" />
      <CreatePost userId="cjw7b3mmd004407271ba3o6p1" />
      <div className="container mx-auto">
        <PostsList />
      </div>
    </div>
  );
}

export default App;
