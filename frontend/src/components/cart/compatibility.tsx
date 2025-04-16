import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  AlertTriangle,
  Power,
  Thermometer,
  Wrench,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CartItem {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  price: number;
  quantity: number;
}

interface CompatibilityData {
  total_tdp: number;
  psu_warnings: {
    psu_name: string;
    wattage: number | string;
    warning: string;
  }[];
}

interface CompatibilityModalProps {
  cartItems: CartItem[];
}

const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  cartItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [compatibilityData, setCompatibilityData] =
    useState<CompatibilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompatibility = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty. Add items to check compatibility.");
      setCompatibilityData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCompatibilityData(null);

    const partIds = cartItems.map((item) => item.id);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/cart/tdp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: partIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data: CompatibilityData = await response.json();
      setCompatibilityData(data);
    } catch (err: any) {
      console.error("Failed to fetch compatibility data:", err);
      setError(
        err.message || "Failed to check compatibility. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchCompatibility();
    } else {
      setCompatibilityData(null);
      setError(null);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black transition-all duration-400"
          disabled={cartItems.length === 0}
        >
          <Wrench className="mr-2 h-4 w-4" /> Check Compatibility
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 text-white border-neutral-700">
        <DialogHeader>
          <DialogTitle>Compatibility Check</DialogTitle>
          <DialogDescription>
            Estimated power consumption and PSU compatibility based on items in
            your cart.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Checking...</span>
            </div>
          )}
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-900/50 border-red-700 text-red-300"
            >
              <AlertTriangle className="h-4 w-4 !text-red-400" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {compatibilityData && !isLoading && !error && (
            <>
              <div className="flex items-center justify-between p-3 bg-neutral-800 rounded-md">
                <div className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-orange-400" />
                  <span>Estimated Total TDP:</span>
                </div>
                <span className="font-semibold text-lg">
                  {compatibilityData.total_tdp} W
                </span>
              </div>

              <h4 className="font-semibold mt-4 mb-2 flex items-center">
                <Power
                  className={`h-5 w-5 mr-2 ${
                    compatibilityData.psu_warnings.length === 0
                      ? "text-green-400"
                      : "text-red-500"
                  }`}
                />{" "}
                PSU Status:
              </h4>
              {compatibilityData.psu_warnings.length === 0 ? (
                <Alert className="bg-green-900/50 border-green-700 text-green-300">
                  <CheckCircle className="h-4 w-4 !text-green-400" />
                  <AlertTitle>Good</AlertTitle>
                  <AlertDescription>
                    PSU wattage appears sufficient for the estimated TDP.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {compatibilityData.psu_warnings.map((warning, index) => (
                    <Alert
                      key={index}
                      variant="destructive"
                      className="bg-yellow-900/50 border-yellow-700 text-yellow-300"
                    >
                      <AlertTriangle className="h-4 w-4 !text-yellow-400" />
                      <AlertTitle>Warning: {warning.psu_name}</AlertTitle>
                      <AlertDescription>
                        <div className="!text-yellow-100">
                          {warning.warning} (PSU Wattage: {warning.wattage}
                          {typeof warning.wattage === "number" ? "W" : ""})
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompatibilityModal;
