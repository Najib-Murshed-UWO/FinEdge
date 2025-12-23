import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Biller {
  id: string;
  name: string;
  category: string;
  accountNumber: string;
  phone?: string;
  email?: string;
  website?: string;
}

// Mock billers data
const mockBillers: Biller[] = [
  {
    id: "biller-001",
    name: "Electric Company",
    category: "Utilities",
    accountNumber: "ELC-123456789",
    phone: "1-800-555-0100",
    website: "www.electricco.com",
  },
  {
    id: "biller-002",
    name: "Water Department",
    category: "Utilities",
    accountNumber: "WTR-987654321",
    phone: "1-800-555-0200",
  },
  {
    id: "biller-003",
    name: "Internet Provider",
    category: "Telecommunications",
    accountNumber: "INT-456789123",
    email: "support@internet.com",
    website: "www.internet.com",
  },
  {
    id: "biller-004",
    name: "Credit Card Company",
    category: "Financial",
    accountNumber: "CC-789123456",
  },
];

const billerCategories = [
  "Utilities",
  "Telecommunications",
  "Financial",
  "Insurance",
  "Healthcare",
  "Education",
  "Government",
  "Other",
];

export function BillersSection() {
  const [billers, setBillers] = useState<Biller[]>(mockBillers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBiller, setEditingBiller] = useState<Biller | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    accountNumber: "",
    phone: "",
    email: "",
    website: "",
  });
  const { toast } = useToast();

  const handleOpenDialog = (biller?: Biller) => {
    if (biller) {
      setEditingBiller(biller);
      setFormData({
        name: biller.name,
        category: biller.category,
        accountNumber: biller.accountNumber,
        phone: biller.phone || "",
        email: biller.email || "",
        website: biller.website || "",
      });
    } else {
      setEditingBiller(null);
      setFormData({
        name: "",
        category: "",
        accountNumber: "",
        phone: "",
        email: "",
        website: "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBiller(null);
    setFormData({
      name: "",
      category: "",
      accountNumber: "",
      phone: "",
      email: "",
      website: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.accountNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingBiller) {
      setBillers(
        billers.map((b) =>
          b.id === editingBiller.id
            ? { ...b, ...formData, id: editingBiller.id }
            : b
        )
      );
      toast({
        title: "Biller updated",
        description: `${formData.name} has been updated successfully.`,
      });
    } else {
      const newBiller: Biller = {
        id: `biller-${Date.now()}`,
        ...formData,
      };
      setBillers([...billers, newBiller]);
      toast({
        title: "Biller added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    const biller = billers.find((b) => b.id === id);
    setBillers(billers.filter((b) => b.id !== id));
    toast({
      title: "Biller removed",
      description: `${biller?.name} has been removed.`,
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Manage Billers</h3>
          <p className="text-sm text-muted-foreground">
            Add and manage your billers for easy payments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-biller">
          <Plus className="h-4 w-4 mr-2" />
          Add Biller
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Billers</CardTitle>
          <CardDescription>List of all your registered billers</CardDescription>
        </CardHeader>
        <CardContent>
          {billers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No billers added yet. Click "Add Biller" to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Biller Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billers.map((biller) => (
                    <TableRow key={biller.id} data-testid={`row-biller-${biller.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {biller.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{biller.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {biller.accountNumber}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {biller.phone && <div>{biller.phone}</div>}
                          {biller.email && <div className="text-muted-foreground">{biller.email}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenDialog(biller)}
                            data-testid={`button-edit-biller-${biller.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(biller.id)}
                            data-testid={`button-delete-biller-${biller.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBiller ? "Edit Biller" : "Add New Biller"}</DialogTitle>
            <DialogDescription>
              {editingBiller
                ? "Update biller information"
                : "Add a new biller to manage your payments"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Biller Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Electric Company"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {billerCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  placeholder="Your account number with this biller"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="1-800-555-0100"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="support@biller.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="www.biller.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">{editingBiller ? "Update" : "Add"} Biller</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

