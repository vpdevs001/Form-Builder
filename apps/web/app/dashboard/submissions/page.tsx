"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/trpc/server";

export default function MySubmissionsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [submissions, setSubmissions] = useState<Awaited<ReturnType<typeof api.submission.getByUser.query>>>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!loading && isAuthenticated && user) {
      api.submission
        .getByUser.query({ userId: user.id })
        .then(setSubmissions)
        .catch((error: any) => toast.error(error.message || "Failed to load your submissions"));
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">My submissions</h1>
        <p className="text-sm text-foreground/60">Loaded using `submission.getByUser`.</p>
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div key={submission.id} className="rounded-lg border border-primary/10 p-4 bg-card/30">
              <p className="text-sm">Form ID: <span className="font-mono">{submission.formId}</span></p>
              <p className="text-sm text-foreground/70">Submitted at {new Date(submission.createdAt).toLocaleString()}</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => router.push(`/dashboard/submissions/${submission.id}`)}
              >
                Open details
              </Button>
            </div>
          ))}
          {submissions.length === 0 ? <p className="text-sm text-foreground/60">No submissions tied to your account yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
