import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
        setError("Passwords do not match");
        return;
    }
    try{
        const response = await fetch("http://localhost:8000/api/register/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        })
        
        const data = await response.json();
        if (!response.ok) {
          setError(data.error);
        } else {
          setMessage(data.message);
          navigate("/login");
        }
    } catch (err){
        setError(err.message); // ???????????????????
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-white">
      <div className="w-full max-w-md space-y-6 p-8 bg-black border border-white/10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center ">Register</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input value={username} id="username" onChange={e => {
                setUsername(e.target.value)
                setError("")
            }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" value={password} onChange={e => {
                setPassword(e.target.value)
                setError("")
            }} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password2">Confirm Password</Label>
            <Input type="password" id="password2" value={password2} onChange={e => {
                setPassword2(e.target.value) 
                setError("")}
            } />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}
          <Button className="w-full" type="submit">
            Register
          </Button>
          <Button className="w-full" onClick={()=>navigate(-1)}>
            Go Back
          </Button>
        </form>
        <p className="text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <a href="/login" className=" text-blue-400">
            Login here
          </a>
        </p>
      </div>
    </div>
  )
}
