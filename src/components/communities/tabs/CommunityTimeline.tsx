import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Heart, MessageCircle, Share2, AlertCircle } from "lucide-react";
import { Community } from "../types";
import { useCommunityTimeline } from "@/hooks/use-communities";
import { formatDistanceToNow } from "date-fns";

interface CommunityTimelineProps {
  community: Community;
}

export const CommunityTimeline = ({ community }: CommunityTimelineProps) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    post_type: "general",
    title: "",
    content: ""
  });

  const { data: posts, isLoading } = useCommunityTimeline(community.id);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'achievement': return <Heart className="w-5 h-5 text-green-500" />;
      case 'event': return <Share2 className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPostTypeBadge = (type: string) => {
    switch (type) {
      case 'announcement': return 'default';
      case 'achievement': return 'secondary';
      case 'event': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading timeline...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Community Timeline</CardTitle>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Post Type</Label>
                    <Select value={postForm.post_type} onValueChange={(value) => setPostForm({ ...postForm, post_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="announcement">Announcement</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title (Optional)</Label>
                    <Input
                      value={postForm.title}
                      onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                      placeholder="Enter post title..."
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      placeholder="What's happening in your community?"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      // Will be implemented when backend is ready
                      console.log('Creating post:', postForm);
                      setIsCreateOpen(false);
                    }}>
                      Post
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Timeline Posts */}
      <div className="space-y-4">
        {posts?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-muted-foreground">No posts yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Be the first to post an update!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts?.map((post: any) => (
            <Card key={post._id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author_id?.avatar_url} />
                    <AvatarFallback>
                      {post.author_id?.full_name?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {post.author_id?.full_name || 'Unknown User'}
                          </span>
                          <Badge variant={getPostTypeBadge(post.post_type)}>
                            {post.post_type}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {getPostIcon(post.post_type)}
                    </div>

                    {post.title && (
                      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    )}

                    <p className="text-sm text-foreground whitespace-pre-wrap mb-4">
                      {post.content}
                    </p>

                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.images.map((img: string, idx: number) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Post"
                            className="rounded-lg object-cover w-full h-48"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
