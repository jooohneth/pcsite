"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FiltersModalProps {
  onApplyFilters: (filters: FilterValues) => void;
}

export interface FilterValues {
  type: string;
  manufacturer: string;
  minPrice: string;
  maxPrice: string;
}

export function FiltersModal({ onApplyFilters }: FiltersModalProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    type: "all",
    manufacturer: "all",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  const handleReset = () => {
    setFilters({
      type: "all",
      manufacturer: "all",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter PC Parts</DialogTitle>
          <DialogDescription>
            Set filters to narrow down your PC part search results.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="cpu">CPU</SelectItem>
                    <SelectItem value="gpu">GPU</SelectItem>
                    <SelectItem value="ram">RAM</SelectItem>
                    <SelectItem value="ssd">SSD</SelectItem>
                    <SelectItem value="motherboard">Motherboard</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                value={filters.manufacturer}
                onValueChange={(value) => handleChange("manufacturer", value)}
              >
                <SelectTrigger id="manufacturer">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="amd">AMD</SelectItem>
                    <SelectItem value="intel">Intel</SelectItem>
                    <SelectItem value="nvidia">NVIDIA</SelectItem>
                    <SelectItem value="corsair">Corsair</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                    <SelectItem value="asus">ASUS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-price">Min Price</Label>
              <Input
                id="min-price"
                placeholder="Min price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleChange("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Max Price</Label>
              <Input
                id="max-price"
                placeholder="Max price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
