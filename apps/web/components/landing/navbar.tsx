"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Sparkles, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "~/components/ui/sheet";
import { NAV_LINKS } from "~/lib/constants";
import { useAuth } from "~/providers/auth-provider";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#060913]/85 backdrop-blur-md border-b border-primary/10 shadow-lg shadow-black/20 py-3"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 text-white animate-pulse-fast" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-white via-primary/90 to-primary bg-clip-text text-transparent tracking-tight">
            Form<span className="text-primary font-extrabold tracking-normal">Craft</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollToSection(e, link.href)}
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium hover:scale-105 duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors text-sm font-semibold gap-1.5 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                className="border-foreground/10 hover:border-secondary/50 text-foreground/80 hover:text-secondary hover:bg-secondary/5 transition-colors text-sm font-semibold gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/10 transition-colors text-sm font-semibold cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/95 text-white font-bold px-5 shadow-[0_0_15px_rgba(255,107,0,0.3)] hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-all group duration-300 text-sm cursor-pointer">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary px-3 text-xs gap-1 cursor-pointer">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary px-3 text-xs cursor-pointer">
                Login
              </Button>
            </Link>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#060913]/95 border-l border-primary/20 backdrop-blur-md flex flex-col justify-between py-8">
              <div className="space-y-8 mt-8">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-primary to-secondary flex items-center justify-center text-white">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-linear-to-r from-white via-primary/90 to-primary bg-clip-text text-transparent">
                    Form<span className="text-primary font-extrabold">Craft</span>
                  </span>
                </div>

                {/* Mobile links */}
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleScrollToSection(e, link.href)}
                        className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors py-1"
                      >
                        {link.label}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <SheetClose asChild>
                      <Link href="/dashboard" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 cursor-pointer">
                          <LayoutDashboard className="w-4 h-4" />
                          Go to Dashboard
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button onClick={logout} variant="outline" className="w-full text-foreground/80 border-primary/20 hover:bg-secondary/10 hover:text-secondary hover:border-secondary/40 font-semibold gap-1.5 cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full text-foreground/80 border-primary/20 hover:bg-primary/10 hover:text-primary font-semibold cursor-pointer">
                          Login
                        </Button>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/95 text-white font-bold shadow-[0_0_15px_rgba(255,107,0,0.3)] cursor-pointer">
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Button>
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
