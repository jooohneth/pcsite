import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try{
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error);
      } else {
        setMessage(data.message);
        navigate("/");
      }               
    }
     catch(err) {
      setError(err.message); // ???????????
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-white">
      <div className="w-full max-w-md space-y-6 p-8 bg-black border border-white/10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input required value={username} id="username" onChange={e => {
              setUsername(e.target.value);
              setError("");
            }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input required type="password" id="password" value={password} onChange={e => {
              setPassword(e.target.value);
              setError("");
            }} />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}
          <Button className="w-full" type="submit">
            Login
          </Button>
          <Button className="w-full" onClick={()=>navigate(-1)}>
            Go Back
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <a href="/register" className=" text-blue-400">
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}
