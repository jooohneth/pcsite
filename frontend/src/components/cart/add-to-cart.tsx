"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PCPart } from "../pc-card";
import { toast } from "sonner";

interface AddToCartButtonProps {
  part: PCPart;
  isFull: boolean;
}

export function AddToCartButton({ part, isFull }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);

    const savedCart = localStorage.getItem("cart");
    let currentCart = [];

    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.id === part.id
    );

    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += 1;

      toast.success("Added to cart!");
    } else {
      currentCart.push({
        id: part.id,
        name: part.name,
        type: part.type,
        price: part.price,
        quantity: 1,
      });
      toast.success("Added to cart!");
    }

    currentCart = currentCart.map((item: PCPart & { quantity: number }) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      price: item.price,
      quantity: item.quantity,
    }));

    localStorage.setItem("cart", JSON.stringify(currentCart));

    setTimeout(() => {
      setIsAdding(false);
    }, 500);

    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <Button
      variant="outline"
      className={`flex-1 bg-white text-black hover:bg-gray-100 ${
        isAdding ? "bg-green-300" : ""
      }`}
      onClick={addToCart}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Check className={`${isFull ? "mr-2" : "mr-0"} h-4 w-4`} />
          {isFull && "Added"}
        </>
      ) : (
        <>
          <ShoppingCart className={`${isFull ? "mr-2" : "mr-0"} h-4 w-4`} />
          {isFull && "Add to Cart"}
        </>
      )}
    </Button>
  );
}
