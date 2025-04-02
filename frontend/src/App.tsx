import Nav from "./components/nav";
import Catalog from "./components/catalog";

function App() {
  return (
    <div className="py-8 px-8 bg-white text-black font-monospace h-screen overflow-y-auto">
      <Nav />
      <Catalog />
    </div>
  );
}

export default App;
