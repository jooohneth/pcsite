import { useState, useEffect, useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PCPartCard, type PCPart } from "./pc-card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FiltersModal, type FilterValues } from "./filter-modal";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 300;

export default function Catalog() {
  const [parts, setParts] = useState<PCPart[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    type: "all",
    manufacturer: "all",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();

      if (activeFilters.type !== "all")
        params.append("type", activeFilters.type.toLowerCase());
      if (activeFilters.manufacturer !== "all")
        params.append("manufacturer", activeFilters.manufacturer);
      if (activeFilters.minPrice)
        params.append("min_price", activeFilters.minPrice);
      if (activeFilters.maxPrice)
        params.append("max_price", activeFilters.maxPrice);
      if (debouncedSearchQuery.trim())
        params.append("search", debouncedSearchQuery.trim());

      const queryString = params.toString();
      const url = `http://3.238.151.248:8000/api/parts/${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("auth-token")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setParts(data);
      if (data.length === 0) {
        setError("No parts found matching your criteria");
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch parts"
      );
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilters, debouncedSearchQuery]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const handleFiltersApply = (newFilters: FilterValues) => {
    setActiveFilters(newFilters);
  };

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
    <div className="mx-auto md:px-12 py-6 font-mono lg:scale-90">
      <div className="pb-6 pt-10 text-4xl text-center font-bold">
        <span className="underline underline-offset-8 hover:underline-offset-[3rem] ease-in-out duration-800">
          Products
        </span>
      </div>

      <div className="pt-8 flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between items-center mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <FiltersModal onApplyFilters={handleFiltersApply} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[300px] pl-10"
            />
          </div>
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
