import { useUser } from "@/hooks/use-user";
import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Calendar, User, Edit } from "lucide-react";

export const Route = createFileRoute("/dashboard/Profile/")({
  component: RouteComponent,
});

function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No User Data</CardTitle>
            <CardDescription>
              Please log in to view your profile
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const initials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : user.email.substring(0, 2).toUpperCase();

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username || user.email}
                />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {user.username || "Anonymous"}
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {joinDate}</span>
            </div>
            <Separator />
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Active User</Badge>
              <Badge variant="outline">Verified</Badge>
            </div>
            <Button className="w-full" variant="default">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-muted-foreground">
                    Welcome to your profile! This is where you can manage your
                    account information, view your activity, and customize your
                    preferences.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Account Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        User ID
                      </span>
                      <span className="text-sm font-mono">{user.id}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        Email
                      </span>
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">
                        Username
                      </span>
                      <span className="text-sm">
                        {user.username || "Not set"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Profile Updated
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Your profile was recently accessed
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Just now
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-green-500/10 p-2">
                            <Mail className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Account Created
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Welcome to the platform!
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {joinDate}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Account Settings
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage your account settings and preferences here.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Email Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Privacy Settings
                    </Button>
                    <Separator className="my-4" />
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

function RouteComponent() {
  return <ProfilePage />;
}
