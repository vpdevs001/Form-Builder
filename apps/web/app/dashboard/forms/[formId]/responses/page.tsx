"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Download, Loader2, Trash2, TrendingUp } from "lucide-react";
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
  const [summary, setSummary] = useState<Awaited<
    ReturnType<typeof api.analytics.getFormSummary.query>
  > | null>(null);
  const [submissions, setSubmissions] = useState<
    Awaited<ReturnType<typeof api.submission.getByFormId.query>>
  >([]);
  const [fieldBreakdown, setFieldBreakdown] = useState<
    Awaited<ReturnType<typeof api.analytics.getFieldBreakdown.query>>
  >([]);
  const [trend, setTrend] = useState<
    Awaited<ReturnType<typeof api.analytics.getSubmissionTrend.query>>
  >([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>("");
  const [selectedFieldValues, setSelectedFieldValues] = useState<
    Awaited<ReturnType<typeof api.submissionValue.getByFieldId.query>>
  >([]);
  const [loadingValues, setLoadingValues] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const [formData, summaryData, submissionData, breakdownData, trendData] = await Promise.all(
          [
            api.form.getById.query({ id: formId }),
            api.analytics.getFormSummary.query({ formId }),
            api.submission.getByFormId.query({ id: formId }),
            api.analytics.getFieldBreakdown.query({ formId }),
            api.analytics.getSubmissionTrend.query({ formId, interval: "DAY" }),
          ],
        );
        if (user && formData.creatorId !== user.id) {
          toast.error("You do not have access to this form.");
          router.push("/dashboard");
          return;
        }
        setForm(formData);
        setSummary(summaryData);
        setSubmissions(submissionData);
        setFieldBreakdown(breakdownData);
        setTrend(trendData);
        if (breakdownData.length > 0 && !selectedFieldId) {
          setSelectedFieldId(breakdownData[0]!.fieldId);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load responses");
      }
    };

    if (!loading && isAuthenticated && user) {
      load();
    }
  }, [loading, isAuthenticated, user, router, formId, selectedFieldId]);

  useEffect(() => {
    if (!selectedFieldId) {
      setSelectedFieldValues([]);
      return;
    }
    let active = true;
    setLoadingValues(true);
    api.submissionValue.getByFieldId
      .query({ fieldId: selectedFieldId })
      .then((values) => {
        if (active) setSelectedFieldValues(values);
      })
      .catch((error: any) => {
        if (active) toast.error(error.message || "Failed to load field values");
      })
      .finally(() => {
        if (active) setLoadingValues(false);
      });
    return () => {
      active = false;
    };
  }, [selectedFieldId]);

  const trendTotal = useMemo(() => trend.reduce((acc, point) => acc + point.count, 0), [trend]);

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
      [
        "Responses Remaining",
        summary.responsesRemaining ? String(summary.responsesRemaining) : "Unlimited",
      ],
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

  const handleDeleteSubmission = async (submissionId: string) => {
    setDeletingSubmissionId(submissionId);
    try {
      await api.submission.delete.mutate({ id: submissionId });
      setSubmissions((prev) => prev.filter((submission) => submission.id !== submissionId));
      toast.success("Submission deleted.");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete submission");
    } finally {
      setDeletingSubmissionId(null);
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
              Download summary
            </Button>
            <Button variant="outline" onClick={exportSubmissionsCsv}>
              <Download className="w-4 h-4 mr-1" />
              Download responses
            </Button>
            <Button variant="outline" onClick={exportBreakdownCsv}>
              <Download className="w-4 h-4 mr-1" />
              Download breakdown
            </Button>
            <Button className="bg-primary" onClick={exportAllCsv} disabled={exporting}>
              <Download className="w-4 h-4 mr-1" />
              Download all data
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
            <p className="text-2xl font-bold">{summary?.responsesRemaining ?? "∞"}</p>
          </div>
        </div>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Submission trend (daily)
          </h2>
          {trend.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm text-foreground/60">
                Total points: {trend.length} • Total submissions: {trendTotal}
              </p>
              {trend.slice(-10).map((point) => (
                <div key={point.period} className="flex items-center gap-2">
                  <p className="w-28 text-xs text-foreground/60">{point.period}</p>
                  <div
                    className="h-2 rounded bg-primary/80"
                    style={{ width: `${Math.max(point.count * 20, 8)}px` }}
                  />
                  <span className="text-xs text-foreground/70">{point.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/60">No trend data yet.</p>
          )}
        </div>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Field breakdown</h2>
          <div className="mb-4">
            <label className="text-xs text-foreground/60 block mb-1">View field responses</label>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
            >
              <option value="">Select a field</option>
              {fieldBreakdown.map((field) => (
                <option key={field.fieldId} value={field.fieldId}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 p-3 rounded-md border border-primary/10 bg-[#060913]/40">
            {loadingValues ? (
              <p className="text-sm text-foreground/60">Loading field values...</p>
            ) : selectedFieldId ? (
              <p className="text-sm text-foreground/60">
                Raw values fetched via `submissionValue.getByFieldId`: {selectedFieldValues.length}
              </p>
            ) : (
              <p className="text-sm text-foreground/60">
                Select a field to inspect raw value rows.
              </p>
            )}
          </div>
          <div className="space-y-4">
            {fieldBreakdown.map((field) => (
              <div key={field.fieldId} className="rounded-lg border border-primary/10 p-4">
                <p className="font-semibold">{field.label}</p>
                <p className="text-xs text-foreground/50 mb-3">
                  {field.fieldType} • {field.totalResponses} responses
                </p>
                <div className="space-y-2">
                  {field.topValues.slice(0, 5).map((value) => (
                    <div
                      key={`${field.fieldId}-${value.value}`}
                      className="flex justify-between text-sm"
                    >
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
          <h2 className="text-lg font-semibold mb-4">Submissions</h2>
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
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/submissions/${submission.id}`)}
                  >
                    Open details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-400 border-red-400/20"
                    disabled={deletingSubmissionId === submission.id}
                    onClick={() => handleDeleteSubmission(submission.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
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
