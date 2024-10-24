// components/AdminDashboard/SearchBar.tsx
// Component: SearchBar for filtering data in the admin dashboard
import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;

  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  placeholder?: string; // Add placeholder prop
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-background"
    />
  );
}
