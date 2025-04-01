import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

function App() {
  const [apiMessage, setApiMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/test/");
        const data = await response.json();
        setApiMessage(data.message);
      } catch (err) {
        setError("Failed to connect to the backend");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {apiMessage && <div>{apiMessage}</div>}

      {error && <div>{error}</div>}
      <Button size="lg" variant="outline">
        Click me
      </Button>
    </div>
  );
}

export default App;
