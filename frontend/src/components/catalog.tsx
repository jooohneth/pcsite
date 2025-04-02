import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PCPartCard, type PCPart, type Specs } from "./pc-card";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 8;

const filterSchema = z.object({
  type: z.string().optional(),
  manufacturer: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export default function Catalog() {
  const [parts, setParts] = useState<PCPart[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      type: "all",
      manufacturer: "all",
      minPrice: "",
      maxPrice: "",
      search: "",
    },
  });

  const fetchParts = async (filters: FilterValues) => {
    try {
      const params = new URLSearchParams();
      if (filters.type && filters.type !== "all")
        params.append("type", filters.type);
      if (filters.manufacturer && filters.manufacturer !== "all")
        params.append("manufacturer", filters.manufacturer);
      if (filters.minPrice) params.append("min_price", filters.minPrice);
      if (filters.maxPrice) params.append("max_price", filters.maxPrice);
      if (filters.search) params.append("search", filters.search);

      const queryString = params.toString();
      const url = `http://localhost:8000/api/parts/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setParts(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to fetch parts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      fetchParts(value as FilterValues);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    fetchParts(form.getValues());
  }, []);

  const totalPages = Math.ceil(parts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentParts = parts.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="mx-auto p-12 font-mono">
      <div className="py-10 text-6xl text-center font-bold underline underline-offset-8 hover:underline-offset-[3rem] ease-in-out duration-800">
        Products
      </div>

      <div className="flex flex-row justify-between items-center mt-18">
        <div className="flex flex-row items-center gap-8 py-10">
          <Form {...form}>
            <div className="flex flex-row items-center gap-8">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="CPU">CPU</SelectItem>
                        <SelectItem value="GPU">GPU</SelectItem>
                        <SelectItem value="RAM">RAM</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="AMD">AMD</SelectItem>
                        <SelectItem value="Intel">Intel</SelectItem>
                        <SelectItem value="NVIDIA">NVIDIA</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Min price" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Max price" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={cn(
                  "cursor-pointer hover:bg-black/10",
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === "..." ? (
                  <PaginationEllipsis className="text-black/70" />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum as number)}
                    isActive={currentPage === pageNum}
                    className={cn(
                      "cursor-pointer hover:bg-black/10",
                      currentPage === pageNum
                        ? "bg-black text-white"
                        : "text-black"
                    )}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={cn(
                  "cursor-pointer hover:bg-black/10",
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentParts.map((part) => (
              <PCPartCard key={part.id} part={part} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
