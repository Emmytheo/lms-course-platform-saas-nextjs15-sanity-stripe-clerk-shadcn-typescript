"use client";

import { BookMarkedIcon, BookOpen } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./SearchInput";
import { ThemeUserButton } from "./ThemeUserButton";

export default function DashboardHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto md:mx-4 px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4 ml-[72px] md:ml-0">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                SkillHub
              </span>
            </Link>

            <div className="hidden md:flex">
              <SearchInput />
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <nav>
              <Link
                prefetch={false}
                href="/lms/student/me"
                className="flex space-x-2 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors md:border md:border-border md:rounded-md md:px-4 md:py-2"
              >
                <BookMarkedIcon className="h-4 w-4" />
                <span className="hidden md:block">My Courses</span>
              </Link>
            </nav>
            <ThemeUserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
