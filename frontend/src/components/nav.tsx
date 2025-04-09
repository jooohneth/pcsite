import { Button } from "@/components/ui/button";
const Nav = () => {
  return (
    <div className="flex justify-between items-center px-10 py-8 bg-black font-mono text-white rounded-md shadow-xl">
      <h1 className="text-4xl font-bold">PCSite</h1>
      <a
        href="/login"
      >
        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/70 transition-all duration-800 text-lg"
        >
          Login / Register
        </Button>
      </a>
    </div>
  );
};

export default Nav;
