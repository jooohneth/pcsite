import Nav from "./components/nav";
import Catalog from "./components/catalog";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="py-8 px-8 bg-white text-black font-monospace min-h-screen overflow-y-auto">
      <Nav />
      <Catalog />
      <Toaster position="top-center" richColors duration={2000} />
    </div>
  );
}

export default App;
