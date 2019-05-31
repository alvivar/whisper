import React from "react";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

function App() {
  return (
    <div className="container mx-auto max-w-xl">
      <div className="h-4" />
      <CreatePost />
      <div className="container mx-auto">
        <PostsList />
      </div>
    </div>
  );
}

export default App;
