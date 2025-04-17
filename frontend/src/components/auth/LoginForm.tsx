import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
  setIsAuthed?: (isAuthed: boolean) => void;
}

export function LoginForm({ onSuccess, setIsAuthed }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await fetch("http://3.238.151.248:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
      } else {
        setMessage(data.message || "Login successful!");
        if (onSuccess) onSuccess();
        if (setIsAuthed) setIsAuthed(true);
        setTimeout(() => navigate("/"), 500);
        localStorage.setItem("auth-token", data.token);
        toast.success("Login successful!");
      }
    } catch (err: unknown) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>
          Enter your credentials to access your account.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4 py-4" onSubmit={handleLogin}>
        <div className="space-y-2">
          <Label htmlFor="login-username">Username</Label>
          <Input
            required
            value={username}
            id="login-username"
            onChange={(e) => setUsername(e.target.value)}
            className="bg-neutral-900 border-neutral-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            required
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-900 border-neutral-700"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            className="bg-neutral-900 border-neutral-700 hover:bg-white/90 hover:text-black"
          >
            Login
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
