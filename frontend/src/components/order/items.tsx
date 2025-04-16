import { useEffect, useState } from "react";
import type { PCPart } from "../pc-card";
import { Cpu, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

interface ItemProps {
  id: string;
}

const Item = ({ id }: ItemProps) => {
  const [itemInfo, setItemInfo] = useState<PCPart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/parts/${id}/`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch item");
        }

        const data = await response.json();
        setItemInfo(data);
      } catch (error) {
        console.error("Error fetching item:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, []);

  return (
    <div className="flex-1 min-w-0 py-4 pr-6">
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}

      <div className="flex justify-between">
        <div>
          <h4 className="pl-2 font-bold text-md truncate">{itemInfo?.name}</h4>
          <p className="pl-2 text-muted-foreground">{itemInfo?.manufacturer}</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-sm font-bold text-blue-500 border-transparent bg-black shadow-xl"
            >
              <Cpu className="h-5 w-5" />
              <span className="ml-1">{itemInfo?.type}</span>
            </Badge>
          </div>

          <p className="pl-2 text-green-500 font-bold">${itemInfo?.price}</p>
        </div>
      </div>
    </div>
  );
};

export default Item;
