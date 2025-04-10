import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const Nav = () => {
  return (
    <div className="flex justify-between items-center px-10 py-8 bg-black font-mono text-white rounded-md shadow-xl scale-90">
      <Link to="/">
        <h1 className="text-4xl font-bold">PCSite</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
                className=""
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-black text-white border-neutral-700 mr-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Account</h4>
                <p className="text-sm text-muted-foreground">
                  Access your account or create a new one.
                </p>
              </div>
              <div className="grid gap-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="w-full bg-black border-neutral-700 hover:bg-neutral-800 hover:text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Nav;
