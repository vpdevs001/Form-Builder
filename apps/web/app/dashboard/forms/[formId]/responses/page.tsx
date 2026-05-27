"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormWorkspaceNav } from "~/components/forms/form-workspace-nav";
import { useAuth } from "~/providers/auth-provider";
import { downloadCsv } from "~/lib/csv-export";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export default function FormResponsesPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState<Awaited<ReturnType<typeof api.form.getById.query>> | null>(null);
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof api.analytics.getFormSummary.query>> | null>(null);
  const [submissions, setSubmissions] = useState<
    Awaited<ReturnType<typeof api.analytics.getRecentSubmissions.query>>
  >([]);
  const [fieldBreakdown, setFieldBreakdown] = useState<
    Awaited<ReturnType<typeof api.analytics.getFieldBreakdown.query>>
  >([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const [formData, summaryData, recentData, breakdownData] = await Promise.all([
          api.form.getById.query({ id: formId }),
          api.analytics.getFormSummary.query({ formId }),
          api.analytics.getRecentSubmissions.query({ formId, limit: 50 }),
          api.analytics.getFieldBreakdown.query({ formId }),
        ]);
        if (user && formData.creatorId !== user.id) {
          toast.error("You do not have access to this form.");
          router.push("/dashboard");
          return;
        }
        setForm(formData);
        setSummary(summaryData);
        setSubmissions(recentData);
        setFieldBreakdown(breakdownData);
      } catch (error: any) {
        toast.error(error.message || "Failed to load responses");
      }
    };

    if (!loading && isAuthenticated && user) {
      load();
    }
  }, [loading, isAuthenticated, user, router, formId]);

  const exportSummaryCsv = () => {
    if (!summary || !form) return;
    downloadCsv(`${form.title}-summary.csv`, [
      ["Metric", "Value"],
      ["Form Title", form.title],
      ["Total Submissions", String(summary.totalSubmissions)],
      ["Unique Respondent Emails", String(summary.uniqueRespondentEmails)],
      ["Accepts Responses", summary.acceptsResponses ? "Yes" : "No"],
      ["Is Expired", summary.isExpired ? "Yes" : "No"],
      ["Response Limit", summary.responseLimit ? String(summary.responseLimit) : "None"],
      ["Responses Remaining", summary.responsesRemaining ? String(summary.responsesRemaining) : "Unlimited"],
      ["First Submission", summary.firstSubmissionAt || "N/A"],
      ["Last Submission", summary.lastSubmissionAt || "N/A"],
      ["Published At", summary.publishedAt || "N/A"],
    ]);
    toast.success("Summary CSV downloaded.");
  };

  const exportSubmissionsCsv = () => {
    if (!form) return;
    downloadCsv(`${form.title}-submissions.csv`, [
      ["Submission ID", "Submitted At", "Respondent Email", "IP Address", "User Agent"],
      ...submissions.map((submission) => [
        submission.id,
        submission.createdAt,
        submission.respondentEmail || "",
        submission.ipAddress,
        submission.userAgent || "",
      ]),
    ]);
    toast.success("Submissions CSV downloaded.");
  };

  const exportBreakdownCsv = () => {
    if (!form) return;
    const rows: string[][] = [["Field Label", "Field Type", "Value", "Count"]];
    for (const field of fieldBreakdown) {
      if (field.topValues.length === 0) {
        rows.push([field.label, field.fieldType, "", "0"]);
        continue;
      }
      for (const value of field.topValues) {
        rows.push([field.label, field.fieldType, value.value, String(value.count)]);
      }
    }
    downloadCsv(`${form.title}-field-breakdown.csv`, rows);
    toast.success("Field breakdown CSV downloaded.");
  };

  const exportAllCsv = async () => {
    setExporting(true);
    try {
      exportSummaryCsv();
      exportSubmissionsCsv();
      exportBreakdownCsv();
    } finally {
      setExporting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-card/30 border border-primary/10 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-bold">Analytics</p>
              <h1 className="text-2xl font-bold mt-1">{form?.title || "Response analytics"}</h1>
              <p className="text-sm text-foreground/60 mt-1">
                {summary?.totalSubmissions ?? 0} total submissions
              </p>
            </div>
            <FormWorkspaceNav formId={formId} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportSummaryCsv}>
              <Download className="w-4 h-4 mr-1" />
              Export summary
            </Button>
            <Button variant="outline" onClick={exportSubmissionsCsv}>
              <Download className="w-4 h-4 mr-1" />
              Export submissions
            </Button>
            <Button variant="outline" onClick={exportBreakdownCsv}>
              <Download className="w-4 h-4 mr-1" />
              Export breakdown
            </Button>
            <Button className="bg-primary" onClick={exportAllCsv} disabled={exporting}>
              <Download className="w-4 h-4 mr-1" />
              Export all CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Total submissions</p>
            <p className="text-2xl font-bold">{summary?.totalSubmissions ?? 0}</p>
          </div>
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Unique emails</p>
            <p className="text-2xl font-bold">{summary?.uniqueRespondentEmails ?? 0}</p>
          </div>
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Accepting responses</p>
            <p className="text-2xl font-bold">{summary?.acceptsResponses ? "Yes" : "No"}</p>
          </div>
          <div className="bg-card/30 border border-primary/10 rounded-xl p-4">
            <p className="text-sm text-foreground/60">Responses remaining</p>
            <p className="text-2xl font-bold">
              {summary?.responsesRemaining ?? "∞"}
            </p>
          </div>
        </div>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Field breakdown</h2>
          <div className="space-y-4">
            {fieldBreakdown.map((field) => (
              <div key={field.fieldId} className="rounded-lg border border-primary/10 p-4">
                <p className="font-semibold">{field.label}</p>
                <p className="text-xs text-foreground/50 mb-3">
                  {field.fieldType} • {field.totalResponses} responses
                </p>
                <div className="space-y-2">
                  {field.topValues.slice(0, 5).map((value) => (
                    <div key={`${field.fieldId}-${value.value}`} className="flex justify-between text-sm">
                      <span className="text-foreground/75">{value.value || "(empty)"}</span>
                      <span className="text-foreground/50">{value.count}</span>
                    </div>
                  ))}
                  {field.topValues.length === 0 ? (
                    <p className="text-sm text-foreground/50">No answers yet.</p>
                  ) : null}
                </div>
              </div>
            ))}
            {fieldBreakdown.length === 0 ? (
              <p className="text-sm text-foreground/60">No field analytics yet.</p>
            ) : null}
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
