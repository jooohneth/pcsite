import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { useEffect, useState } from "react";
import Item from "./items";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  user: {
    id: string;
    username: string;
  };
  items: {
    product_id: string;
    quantity: number;
  }[];
  subtotal: number;
  shipping_cost: number;
  taxes: number;
  total_amount: number;
  created_at: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("auth-token");

    const fetchOrders = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <SheetContent className="bg-black text-white border-neutral-700">
      <SheetHeader>
        <SheetTitle>Orders</SheetTitle>
        <SheetDescription>View your order history here.</SheetDescription>
      </SheetHeader>
      <ScrollArea className="px-4 w-full">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}

        {orders.length > 0 && (
          <>
            <div className="grid grid-cols-5 items-center gap-4 underline underline-offset-4 text-sm text-muted-foreground">
              <div className="col-span-1 text-center">Items</div>
              <div className="col-span-1">Order ID</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Total</div>
              <div className="col-span-1"></div>
            </div>

            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-5 items-center gap-4 w-full text-sm font-medium border-b border-neutral-700 py-2"
              >
                <div className="col-span-1 text-center">
                  {order.items.length}
                </div>
                <div className="col-span-1">{`${order.order_number.slice(
                  0,
                  3
                )}-${order.order_number.slice(-9, -5)}`}</div>
                <div className="col-span-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
                <div className="col-span-1">
                  ${order.total_amount.toFixed(2)}
                </div>

                <div className="col-span-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className=" hover:bg-white hover:text-black transition-all duration-400"
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl bg-black/90 text-white border-neutral-700">
                      <DialogHeader>
                        <DialogTitle>Items</DialogTitle>
                        <DialogDescription className="mb-4">
                          All PC Parts ordered in {order.order_number}, by{" "}
                          {order.user.username}
                        </DialogDescription>

                        <ScrollArea className="h-[50vh] mt-4">
                          {order.items.map((item) => (
                            <Item key={item.product_id} id={item.product_id} />
                          ))}
                        </ScrollArea>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </>
        )}

        {orders.length <= 0 && !isLoading && (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </ScrollArea>
      <SheetFooter>
        <SheetClose asChild>
          <Button
            type="submit"
            className="hover:bg-white hover:text-black transition-all duration-400"
          >
            Continue Browsing
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};

export default Orders;
