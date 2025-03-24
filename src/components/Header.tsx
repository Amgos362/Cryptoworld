import React from "react";
import { Search, Menu, X, Moon, Sun, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-gray-800 shadow-md">
      <div className="container flex items-center justify-between h-20 px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-xl font-bold text-white">CryptoTrack</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#"
            className="text-white hover:text-blue-400 transition-colors"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            Markets
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            Portfolio
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-blue-400 transition-colors"
          >
            News
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex relative w-64 lg:w-80">
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="bg-gray-900 border-gray-700 text-gray-300 pl-10 pr-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800"
              >
                Connect Wallet
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 py-4">
          <div className="container px-4 mx-auto space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search cryptocurrencies..."
                className="bg-gray-800 border-gray-700 text-gray-300 pl-10 pr-4 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            <nav className="flex flex-col space-y-3">
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors py-2"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors py-2"
              >
                Markets
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors py-2"
              >
                Portfolio
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors py-2"
              >
                News
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
