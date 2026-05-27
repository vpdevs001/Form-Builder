"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function PublicFormsPage() {
  const [forms, setForms] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.form.getPublic
      .query()
      .then((res) => {
        if (mounted) setForms(res || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = forms.filter((f) => f.title?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold">Public Forms</h1>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
              placeholder="Search public forms..."
            />
            <Button onClick={() => router.push("/")}>Back</Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-foreground/60">No public forms found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((f) => (
              <Card key={f.id} className="bg-card/30">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/60 mb-2">{f.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/50">
                      By {f.creatorName || f.creatorId}
                    </span>
                    <Button size="sm">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
