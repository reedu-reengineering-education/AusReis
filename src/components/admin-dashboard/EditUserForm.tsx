// components/AdminDashboard/EditUserForm.tsx
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export default function EditUserForm({
  user,
  onSave,
  onClose,
}: {
  user: any;
  onSave: (user: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <Card className="max-w-4xl w-full">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Edit User</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Input
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="mb-4"
            />
            <Input
              name="role"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
              className="mb-4"
            />
            <Input
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
              className="mb-4"
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
