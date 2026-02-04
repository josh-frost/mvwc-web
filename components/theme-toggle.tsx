"use client";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: "home" as const, label: "Home" },
    { value: "away" as const, label: "Away" },
    { value: "dark" as const, label: "Dark" },
  ];

  const currentTheme = themes.find((t) => t.value === theme);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 py-2 px-3 text-sm md:text-base font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
          title="Change theme"
        >
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px]">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center w-full">
              <Check
                className={`mr-2 h-4 w-4 shrink-0 ${
                  theme === t.value ? "opacity-100" : "opacity-0"
                }`}
              />
              <span>{t.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
