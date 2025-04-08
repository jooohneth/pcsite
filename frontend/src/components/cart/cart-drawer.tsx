"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRightCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PCPart } from "../pc-card";

interface CartItem {
  part: PCPart;
  quantity: number;
}

export function CartDrawer() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (e) {}
    } else {
      console.log("No cart data found in localStorage");
    }
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem("cart");

      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
    };

    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.part.price * item.quantity,
    0
  );

  const updateQuantity = (partId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(partId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.part.id === partId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (partId: string) => {
    const updatedCart = cartItems.filter((item) => item.part.id !== partId);

    setCartItems(updatedCart);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/70 transition-all duration-800 text-lg relative"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Cart
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-600 text-white">
              {totalItems}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-black text-white border-t border-white/20">
        <div className="mx-auto w-full max-w-5xl">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6" />
              Your Cart
            </DrawerTitle>
            <DrawerDescription className="text-white/70">
              {totalItems === 0
                ? "Your cart is empty"
                : `You have ${totalItems} item${
                    totalItems !== 1 ? "s" : ""
                  } in your cart`}
            </DrawerDescription>
          </DrawerHeader>

          {cartItems.length > 0 ? (
            <>
              <ScrollArea className="h-[50vh] px-4">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.part.id}
                      className="flex items-center gap-4 py-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-md truncate">
                          {item.part.name}
                        </h4>
                        <p className="text-sm text-white/70">
                          {item.part.manufacturer}
                        </p>
                        <p className="text-green-500 font-bold">
                          ${item.part.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20"
                          onClick={() =>
                            updateQuantity(item.part.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3 text-black" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-white/20"
                          onClick={() =>
                            updateQuantity(item.part.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3 text-black" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-red-500/20"
                        onClick={() => removeFromCart(item.part.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4 bg-white/10" />

              <div className="px-4 py-2">
                <div className="flex justify-between text-lg mb-2">
                  <span>Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white/70 mb-4">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <DrawerFooter className="pt-2">
                <div className="flex gap-2 text-black">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white text-black hover:bg-red-200 transition-all duration-700 text-lg"
                    onClick={clearCart}
                  >
                    Clear Cart
                    <Trash2 className="ml-1 h-5 w-5" />
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="flex-1 bg-white text-black hover:bg-white/70 transition-all duration-800 text-lg"
                    >
                      Continue Shopping
                      <ArrowRightCircle className="ml-1 h-5 w-5" />
                    </Button>
                  </DrawerClose>
                </div>

                <Button className="bg-white text-black hover:bg-green-200 transition-all duration-800 text-lg p-6">
                  Checkout <ShoppingBag className="ml-1 h-5 w-5" />
                </Button>
              </DrawerFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[30vh] px-4">
              <ShoppingCart className="h-16 w-16 text-white/30 mb-4" />
              <p className="text-white/70 mb-6">Your cart is empty</p>
              <DrawerClose asChild>
                <Button className="bg-white text-black hover:bg-white/70 transition-all duration-800 text-lg">
                  Browse Parts
                  <ArrowRightCircle className="ml-1 h-5 w-5" />
                </Button>
              </DrawerClose>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
