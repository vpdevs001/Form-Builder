"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/trpc/server";
import { toast } from "sonner";

export default function NewFormPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "UNLISTED" | "PRIVATE">("PUBLIC");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const created = await api.form.create.mutate({
        creatorId: user.id,
        title,
        description: description || undefined,
        visibility,
        status: "DRAFT",
        acceptsResponses: true,
        notifyCreator: true,
        notifyRespondent: false,
        theme: "Naruto",
      });
      toast.success("Form created. Add your questions now.");
      router.push(`/dashboard/forms/${created.id}/builder`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated || !user) {
    return <div className="min-h-screen bg-[#060913]" />;
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-16 px-4">
      <div className="max-w-2xl mx-auto bg-card/30 border border-primary/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-2">Create a new form</h1>
        <p className="text-sm text-foreground/60 mb-6">
          After creating this form, you can add questions one by one in the editor.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Weekly Product Feedback"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Tell respondents what this form is about."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <select
              id="visibility"
              value={visibility}
              onChange={(event) =>
                setVisibility(event.target.value as "PUBLIC" | "UNLISTED" | "PRIVATE")
              }
              className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
            >
              <option value="PUBLIC">Public</option>
              <option value="UNLISTED">Unlisted</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary" disabled={submitting}>
              {submitting ? "Creating..." : "Create form"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
