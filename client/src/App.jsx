import Home from "./pages/Home";
// import NGOs from "./pages/NGOs";

function App() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* Change page here temporarily during development */}

      <Home />

      {/*
      <NGOs />
      */}
    </div>
  );
}

export default App;