"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { dbService } from "@/lib/db";
import { 
  Activity, 
  BookOpen, 
  CheckSquare, 
  Layers, 
  LayoutDashboard, 
  Menu, 
  Moon, 
  Sun, 
  X, 
  Award,
  Zap,
  User,
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get user stats (streak & XP) if logged in
  const userStats = user ? dbService.getUserProgress(user.uid) : null;
  const userLevel = userStats ? Math.floor(userStats.xp / 100) + 1 : 1;
  const nextLevelXp = userLevel * 100;
  const currentLevelXp = userStats ? userStats.xp % 100 : 0;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pathways", href: "/pathways", icon: Activity },
    { name: "Quizzes", href: "/quiz", icon: CheckSquare },
    { name: "Flashcards", href: "/flashcards", icon: Layers },
    { name: "Study Notes", href: "/notes", icon: BookOpen },
    { name: "Help Center", href: "/help", icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Activity className="h-6 w-6 animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BioCycle Hub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Options */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Gamification Stats */}
            {user && userStats && (
              <div className="flex items-center space-x-3 text-xs bg-muted/50 py-1 px-3 rounded-full border border-border">
                {/* Streak */}
                <div className="flex items-center text-orange-500 font-semibold" title="Daily Streak">
                  <Zap className="h-4 w-4 fill-orange-500 mr-1 animate-bounce" />
                  <span>{userStats.streak} Days</span>
                </div>
                <div className="h-3 w-px bg-border" />
                {/* XP / Level */}
                <div className="flex items-center space-x-1 font-semibold text-primary">
                  <Award className="h-4 w-4 mr-1 text-accent" />
                  <span>Lvl {userLevel}</span>
                  <span className="text-muted-foreground">({currentLevelXp}/{100} XP)</span>
                </div>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* User Dropdown / Login button */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold">{user.displayName}</span>
                  <span className="text-[10px] text-muted-foreground">Student</span>
                </div>
                
                <div className="relative group">
                  <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-sm shadow-md hover:scale-105 transition-all">
                    {user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 hidden group-hover:block transition-all hover:block">
                    <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <User className="h-4 w-4" />
                      <span>Profile Dashboard</span>
                    </Link>
                    <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                      <Settings className="h-4 w-4" />
                      <span>Admin Control</span>
                    </Link>
                    <hr className="border-border my-1" />
                    <button
                      onClick={() => logout()}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-muted"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth"
                className="bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md text-sm font-semibold shadow-md shadow-primary/20 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-border py-4 px-4 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-base font-medium transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {user && userStats && (
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border text-sm">
              <div className="flex items-center text-orange-500 font-semibold">
                <Zap className="h-5 w-5 fill-orange-500 mr-1" />
                <span>{userStats.streak} Day Streak</span>
              </div>
              <div className="flex items-center text-primary font-semibold">
                <Award className="h-5 w-5 text-accent mr-1" />
                <span>Lvl {userLevel} ({userStats.xp % 100}/100 XP)</span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border flex flex-col space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1 flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-xs">
                    {user.displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{user.displayName}</span>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-primary text-primary-foreground text-center py-2.5 rounded-md font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
