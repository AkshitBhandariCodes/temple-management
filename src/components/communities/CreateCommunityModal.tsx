import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { useCreateCommunity } from '@/hooks/use-communities';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (community: any) => void;
}

export const CreateCommunityModal = ({ isOpen, onClose, onCreate }: CreateCommunityModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    ownerId: ""
  });
  const [uploadingLogo] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const createCommunityMutation = useCreateCommunity();

  // Demo users for owner selection
  const demoUsers: User[] = [
    {
      id: 'user-001',
      name: 'Temple Administrator',
      email: 'admin@temple.com',
      avatar: '/placeholder.svg'
    },
    {
      id: 'user-002',
      name: 'Community Manager',
      email: 'manager@temple.com',
      avatar: '/placeholder.svg'
    },
    {
      id: 'user-003',
      name: 'Finance Manager',
      email: 'finance@temple.com',
      avatar: '/placeholder.svg'
    },
    {
      id: 'user-004',
      name: 'Volunteer Coordinator',
      email: 'volunteer@temple.com',
      avatar: '/placeholder.svg'
    },
    {
      id: 'user-005',
      name: 'Devotee Member',
      email: 'devotee@temple.com',
      avatar: '/placeholder.svg'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setUsers(demoUsers);
      // Auto-select current user as owner
      if (user && user.id) {
        setFormData(prev => ({ ...prev, ownerId: user.id }));
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Community name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.ownerId) {
      toast({
        title: "Error",
        description: "Please select a community owner",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // ✅ Match backend expected format
      const communityData = {
        name: formData.name.trim(),
        slug: slug,
        description: formData.description.trim(),
        owner_id: formData.ownerId,
        logo_url: formData.logo || '/placeholder.svg',
        status: 'active',
        is_active: true
        // ❌ Don't send created_at/updated_at - backend generates them
      };

      console.log("🚀 Creating community with data:", communityData);

      // Use the mutation
      const response = await createCommunityMutation.mutateAsync(communityData);

      console.log("✅ Community created response:", response);

      // Reset form
      setFormData({
        name: "",
        description: "",
        logo: "",
        ownerId: ""
      });

      onClose();
      
      // Call onCreate with the response data
      if (response && response.data) {
        onCreate(response.data);
      }

      toast({
        title: "Success",
        description: "Community created successfully!",
      });
    } catch (error: any) {
      console.error("❌ Community creation error:", error);

      toast({
        title: "Error",
        description: error.message || "Failed to create community",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // For now, just store the file name
      setFormData(prev => ({ ...prev, logo: file.name }));
      toast({
        title: "Logo Selected",
        description: "Logo will be uploaded when community is created",
      });
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Community Logo */}
          <div className="space-y-2">
            <Label>Community Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {formData.logo ? (
                  <img
                    src={`/uploads/${formData.logo}`}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload Logo
                  </Button>
                  {formData.logo && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeLogo}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Community Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter community name"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your community's purpose and activities"
              rows={3}
            />
          </div>

          {/* Owner Selection */}
          <div className="space-y-2">
            <Label htmlFor="owner">Community Owner *</Label>
            <Select
              value={formData.ownerId}
              onValueChange={(value) => handleInputChange("ownerId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select community owner" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCommunityMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {createCommunityMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Community"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};