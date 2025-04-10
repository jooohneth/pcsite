import { useState } from "react";
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

interface RegisterFormProps {
  onSuccess?: () => void;
  isAuthed?: boolean;
}

export function RegisterForm({ onSuccess, isAuthed }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setMessage(data.message || "Registration successful! Please login.");
        if (onSuccess) onSuccess();
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
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>
          Create a new account to save your builds and preferences.
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4 py-4" onSubmit={handleRegister}>
        <div className="space-y-2">
          <Label htmlFor="register-username">Username</Label>
          <Input
            value={username}
            id="register-username"
            onChange={(e) => setUsername(e.target.value)}
            className="bg-neutral-900 border-neutral-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-900 border-neutral-700"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password2">Confirm Password</Label>
          <Input
            type="password"
            id="register-password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
            Register
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
