// components/AdminDashboard/SearchBar.tsx
import { Input } from "@/components/ui/input";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Input
      placeholder="Search..."
      value={value}
      onChange={onChange}
      className=" bg-background"
    />
  );
}
