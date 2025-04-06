"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PCPart } from "../pc-card";

interface AddToCartButtonProps {
  part: PCPart;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function AddToCartButton({
  part,
  variant = "default",
  size = "default",
  className = "",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);

    // Get current cart from localStorage
    const savedCart = localStorage.getItem("cart");
    let currentCart = [];

    if (savedCart) {
      try {
        currentCart = JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex(
      (item: any) => item.part.id === part.id
    );

    if (existingItemIndex >= 0) {
      // Increment quantity if item exists
      currentCart[existingItemIndex].quantity += 1;
    } else {
      // Add new item with quantity 1
      currentCart.push({
        part: part,
        quantity: 1,
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart));

    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);

    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${className} ${
        isAdding ? "bg-green-600 hover:bg-green-700" : ""
      }`}
      onClick={addToCart}
      disabled={isAdding}
    >
      {isAdding ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
