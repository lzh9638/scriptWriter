"use client";
import PhMoonFill from "@/components/icons/moon";
import { useTheme } from "next-themes";

export function ThemedButton() {
  const { theme, setTheme } = useTheme();

  return (
    <div onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <PhMoonFill /> : <PhMoonFill />}
    </div>
  );
}
