
import React from "react";
import { Link } from "react-router-dom";
import { User, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-market-primary text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-market-accent" />
          <Link to="/" className="text-xl font-bold">
            MarketGod Insights
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-market-accent transition-colors">
            Dashboard
          </Link>
          <Link to="/technical" className="hover:text-market-accent transition-colors">
            Technical Analysis
          </Link>
          <Link to="/fundamental" className="hover:text-market-accent transition-colors">
            Fundamental Analysis
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="bg-transparent border-white/20 hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
          <Button size="sm" className="bg-market-accent hover:bg-market-accent/80">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
