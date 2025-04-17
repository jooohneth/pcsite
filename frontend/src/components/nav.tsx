import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart/cart-drawer";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";
import { toast } from "sonner";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import Orders from "@/components/order/orders";
import { Separator } from "@/components/ui/separator";
const Nav = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(
    localStorage.getItem("auth-token") !== null
  );

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem("auth-token");
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center px-10 py-4 bg-black font-mono text-white rounded-md shadow-xl">
      <Link to="/">
        <h1 className="text-4xl font-bold">Node_Zero</h1>
      </Link>
      <Separator className="md:hidden" />
      <div className="flex items-center gap-8 md:gap-4">
        <CartDrawer />
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center">
              {isAuthed ? (
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              ) : (
                <div className="flex items-center justify-center bg-white rounded-full w-10 h-10">
                  <User className="text-black" />
                </div>
              )}
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-black text-white border-neutral-700 mr-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Account</h4>
                <p className="text-sm text-muted-foreground">
                  {isAuthed
                    ? "Manage your account or logout."
                    : "Access your account or create a new one."}
                </p>
              </div>
              <div className="grid gap-2">
                {isAuthed ? (
                  <>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                        >
                          View Orders
                        </Button>
                      </SheetTrigger>
                      <Orders />
                    </Sheet>
                    <Button
                      variant="outline"
                      className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                      onClick={() => {
                        handleLogout();
                        toast.warning("Logged out!");
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                        >
                          Login
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black text-white border-neutral-700">
                        <LoginForm
                          onSuccess={handleLoginSuccess}
                          setIsAuthed={setIsAuthed}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={isRegisterOpen}
                      onOpenChange={setIsRegisterOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                        >
                          Register
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-black text-white border-neutral-700">
                        <RegisterForm onSuccess={handleRegisterSuccess} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Nav;
