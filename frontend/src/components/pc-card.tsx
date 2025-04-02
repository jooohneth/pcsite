import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Cpu, DollarSign, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DetailedPart from "./detailed-pc-part";

export interface Specs {
  Cores?: string;
  Threads?: string;
  "Base Clock"?: string;
  "Boost Clock"?: string;
  TDP?: string;
  Socket?: string;
  [key: string]: string | undefined; // For any other spec fields
}

export interface PCPart {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  price: number;
  url: string;
  specs: Specs;
}

interface PCPartCardProps {
  part: PCPart;
}

export function PCPartCard({ part }: PCPartCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md bg-black/90 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
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
        <CardTitle className="line-clamp-1 text-xl pt-4">{part.name}</CardTitle>
        <CardDescription className="flex items-center text-xl font-bold text-green-500">
          <DollarSign className="h-5 w-5" />
          {part.price}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(part.specs).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-xs text-muted-foreground">{key}</p>
              <p className="font-medium line-clamp-1">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Dialog>
          <DialogTrigger asChild>
            <a
              href="#"
              className="flex w-full items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-bold text-black hover:bg-gray-100"
            >
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-black/90 text-white [&>button]:hidden">
            <DetailedPart part={part} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
