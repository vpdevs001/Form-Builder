"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export default function FormResponsesPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { user, loading, isAuthenticated } = useAuth();

  const [summary, setSummary] = useState<Awaited<ReturnType<typeof api.analytics.getFormSummary.query>> | null>(null);
  const [submissions, setSubmissions] = useState<
    Awaited<ReturnType<typeof api.analytics.getRecentSubmissions.query>>
  >([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const [summaryData, recentData] = await Promise.all([
          api.analytics.getFormSummary.query({ formId }),
          api.analytics.getRecentSubmissions.query({ formId, limit: 20 }),
        ]);
        setSummary(summaryData);
        setSubmissions(recentData);
      } catch (error: any) {
        toast.error(error.message || "Failed to load responses");
      }
    };

    if (!loading && isAuthenticated && user) {
      load();
    }
  }, [loading, isAuthenticated, user, router, formId]);

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen bg-[#060913]" />;
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h1 className="text-2xl font-bold">Response analytics</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Form ID: <span className="font-mono">{formId}</span>
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/forms/${formId}/builder`)}>
              Open builder
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Total submissions</p>
            <p className="text-2xl font-bold">{summary?.totalSubmissions ?? 0}</p>
          </div>
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Unique respondent emails</p>
            <p className="text-2xl font-bold">{summary?.uniqueRespondentEmails ?? 0}</p>
          </div>
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Accepting responses</p>
            <p className="text-2xl font-bold">{summary?.acceptsResponses ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent submissions</h2>
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div key={submission.id} className="rounded-lg border border-primary/10 p-3">
                <p className="text-sm">
                  <span className="text-foreground/60">Submitted:</span>{" "}
                  {new Date(submission.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-foreground/70">
                  <span className="text-foreground/60">Email:</span>{" "}
                  {submission.respondentEmail || "Not provided"}
                </p>
              </div>
            ))}
            {submissions.length === 0 ? (
              <p className="text-sm text-foreground/60">No responses yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
