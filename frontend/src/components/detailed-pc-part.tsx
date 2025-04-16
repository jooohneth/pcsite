import { type PCPart } from "./pc-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cpu, DollarSign, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "./cart/add-to-cart";

interface DetailedPartProps {
  part: PCPart;
}

const DetailedPart = ({ part }: DetailedPartProps) => {
  return (
    <Card className="overflow-hidden bg-black/90 text-white p-6 border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Badge
            variant="outline"
            className="text-md font-bold text-blue-500 border-transparent bg-black shadow-xl"
          >
            <Cpu className="h-5 w-5" />
            <span className="ml-1">{part.type}</span>
          </Badge>
          <span className="flex items-center text-sm font-bold text-muted-foreground text-md">
            {part.manufacturer}
          </span>
        </div>
        <CardTitle className="text-2xl font-bold pt-4">{part.name}</CardTitle>
        <CardDescription className="flex items-center text-xl font-bold text-green-500 mt-2">
          <DollarSign className="h-5 w-5" />
          {part.price}
        </CardDescription>
        <CardDescription className="flex items-center text-sm font-medium text-white/70 mt-2">
          {part.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Specifications</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(part.specs).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <p className="text-xs text-muted-foreground">{key}</p>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <Button
              variant="outline"
              className="flex-1 bg-white text-black hover:bg-gray-100"
              asChild
            >
              <a href={part.url} target="_blank" rel="noopener noreferrer">
                View source
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <AddToCartButton part={part} isFull={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedPart;
