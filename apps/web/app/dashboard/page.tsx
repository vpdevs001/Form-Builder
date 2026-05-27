"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Loader2, Plus, Sparkles, FileText, Globe, BarChart3, Settings } from "lucide-react";
import { api } from "~/trpc/server";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [forms, setForms] = useState<
    Awaited<ReturnType<typeof api.form.getByCreator.query>>
  >([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PUBLIC" | "PRIVATE" | "UNLISTED">("ALL");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      api.form.getByCreator
        .query({ creatorId: user.id })
        .then((res) => setForms(res || []))
        .catch((err) => console.error(err));
    }
  }, [loading, isAuthenticated, user]);

  const filteredForms = useMemo(() => {
    return forms
      .filter((f) => f.title.toLowerCase().includes(query.toLowerCase()))
      .filter((f) => (filter === "ALL" ? true : f.visibility === filter));
  }, [forms, query, filter]);

  const publishedCount = useMemo(
    () => forms.filter((form) => form.status === "PUBLISHED").length,
    [forms],
  );

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#060913] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-foreground/60 text-sm font-mono">Verifying your Access Key...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-foreground relative pb-16">
      {/* Background Chakra Aura glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-125 h-125 rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/40 backdrop-blur-md border border-primary/10 rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Guild Account
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {user.firstName} {user.lastName || ""}
            </h1>
            <p className="text-sm text-foreground/50 font-medium">
              Rank: <span className="text-primary font-bold">{user.role}</span> | Email:{" "}
              <span className="text-foreground/75">{user.email}</span>
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => router.push("/dashboard/forms/new")}
              className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-white font-bold gap-1.5 py-5 px-5 rounded-xl shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Form
            </Button>
            <Button
              onClick={() => router.push("/public-forms")}
              variant="outline"
              className="w-full sm:w-auto border-foreground/10 text-foreground/80 font-bold gap-1.5 py-5 px-4 rounded-xl transition-all"
            >
              Public Forms
            </Button>
            <Button
              onClick={() => router.push("/dashboard/submissions")}
              variant="outline"
              className="w-full sm:w-auto border-foreground/10 text-foreground/80 font-bold gap-1.5 py-5 px-4 rounded-xl transition-all"
            >
              My Submissions
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-foreground/10 text-foreground/80 font-bold gap-1.5 py-5 px-4 rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.push("/account/change-details")}>
                  Change Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/change-password")}>
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-foreground/60">Total Forms</CardTitle>
              <FileText className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">{forms.length}</div>
              <p className="text-xs text-foreground/45 mt-1 font-medium">Forms in your workspace</p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-secondary/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-foreground/60">Published</CardTitle>
              <Globe className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">{publishedCount}</div>
              <p className="text-xs text-foreground/45 mt-1 font-medium">Live and accepting traffic</p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-accent/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-foreground/60">
                Completion Rate
              </CardTitle>
              <BarChart3 className="w-4 h-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white">
                {forms.length > 0 ? Math.round((publishedCount / forms.length) * 100) : 0}%
              </div>
              <p className="text-xs text-foreground/45 mt-1 font-medium">
                Published form ratio
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/30 backdrop-blur-sm border border-primary/10 hover:border-primary/20 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-foreground/60 font-heading">
                API Access
              </CardTitle>
              <Settings className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-emerald-500">Active</div>
              <p className="text-xs text-foreground/45 mt-1 font-medium">
                Scalar credentials verified
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="bg-card/20 border border-primary/5 rounded-2xl p-6 text-center flex flex-col items-center justify-center shadow-lg">
          <div className="w-full max-w-4xl mx-auto mb-4 flex flex-col sm:flex-row items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
              placeholder="Search your forms..."
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-[#060913]/60 border border-primary/20 rounded-md px-3 py-2 text-sm text-foreground"
            >
              <option value="ALL">All</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
              <option value="UNLISTED">Unlisted</option>
            </select>
            <Button onClick={() => router.push("/dashboard/forms/new")} className="bg-primary">
              Create New Form
            </Button>
          </div>

          <div className="w-full max-w-6xl mx-auto">
            {filteredForms.length === 0 ? (
              <div className="p-12">
                <div className="p-4 rounded-full bg-primary/5 border border-primary/10 mb-4 animate-float-medium">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-extrabold text-white mb-2">
                  No forms found
                </h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredForms.map((f) => (
                  <div key={f.id} className="bg-card/30 border border-primary/10 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white">{f.title}</h4>
                        <p className="text-sm text-foreground/60 line-clamp-2">
                          {f.description || "No description"}
                        </p>
                        <p className="text-xs text-foreground/40 mt-2">
                          {f.visibility} • {f.status}
                        </p>
                      </div>
                      <p className="text-xs text-foreground/50 whitespace-nowrap">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/forms/${f.id}/settings`)}
                      >
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/dashboard/forms/${f.id}/builder`)}
                        className="bg-primary"
                      >
                        Builder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/forms/${f.id}/responses`)}
                      >
                        Responses
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/forms/${f.shareId}`)}
                      >
                        Fill Page
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
