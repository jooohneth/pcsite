import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Part {
  name: string;
  url: string;
  price: number;
}

interface Specs {
  [key: string]: string;
}

function App() {
  const [parts, setParts] = useState<Part[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<Specs | null>(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [error, setError] = useState("");
  const [loadingSpecs, setLoadingSpecs] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/search_parts/")
      .then((res) => res.json())
      .then((data) => setParts(data.results))
      .catch(() => setError("Failed to connect to backend"));
  }, []);

  const fetchSpecs = async (url: string, name: string) => {
    setSelectedSpecs(null);
    setSelectedName(name);
    setLoadingSpecs(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/part_specs/?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();
      setSelectedSpecs(data.specs || {});
    } catch (err) {
      setSelectedSpecs({ Error: "Failed to fetch specs." });
    } finally {
      setLoadingSpecs(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Available PC Parts</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {parts.map((part, idx) => (
          <div
            key={idx}
            className="border p-4 rounded-xl shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{part.name}</h2>
              <p className="text-sm text-gray-600">${part.price?.toFixed(2)}</p>
              <a
                href={part.url}
                className="text-blue-500 text-sm underline"
                target="_blank"
                rel="noreferrer"
              >
                View on PCPartPicker
              </a>
            </div>

            <Button
              className="mt-3"
              variant="outline"
              onClick={() => fetchSpecs(part.url, part.name)}
            >
              View Specs
            </Button>
          </div>
        ))}
      </div>

      {/* Specs Modal */}
      {selectedSpecs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedName} — Specs</h2>

            {loadingSpecs ? (
              <p>Loading specs...</p>
            ) : (
              <ul className="text-sm max-h-[400px] overflow-y-auto">
                {Object.entries(selectedSpecs).map(([key, value], idx) => (
                  <li key={idx}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setSelectedSpecs(null);
                  setSelectedName("");
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
