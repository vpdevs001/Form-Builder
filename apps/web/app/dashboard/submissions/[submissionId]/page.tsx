"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/server";

export default function SubmissionDetailPage() {
  const router = useRouter();
  const params = useParams<{ submissionId: string }>();
  const submissionId = params.submissionId;

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Awaited<ReturnType<typeof api.submission.getById.query>> | null>(null);
  const [values, setValues] = useState<Awaited<ReturnType<typeof api.submissionValue.getBySubmissionId.query>>>([]);
  const [fields, setFields] = useState<Awaited<ReturnType<typeof api.formField.getByFormId.query>>>([]);
  const [fieldId, setFieldId] = useState("");
  const [value, setValue] = useState("");
  const [savingValue, setSavingValue] = useState(false);

  const loadData = async () => {
    try {
      const submissionData = await api.submission.getById.query({ id: submissionId });
      const [valueData, fieldData] = await Promise.all([
        api.submissionValue.getBySubmissionId.query({ submissionId }),
        api.formField.getByFormId.query({ formId: submissionData.formId }),
      ]);
      setSubmission(submissionData);
      setValues(valueData);
      setFields(fieldData);
      if (fieldData.length > 0 && !fieldId) setFieldId(fieldData[0]!.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to load submission detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const addValue = async (event: FormEvent) => {
    event.preventDefault();
    if (!fieldId || !value.trim()) return;
    setSavingValue(true);
    try {
      await api.submissionValue.create.mutate({ submissionId, fieldId, value });
      setValue("");
      await loadData();
      toast.success("Value added via submissionValue.create");
    } catch (error: any) {
      toast.error(error.message || "Failed to add value");
    } finally {
      setSavingValue(false);
    }
  };

  const deleteSubmission = async () => {
    try {
      await api.submission.delete.mutate({ id: submissionId });
      toast.success("Submission deleted");
      router.push("/dashboard/submissions");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete submission");
    }
  };

  if (loading || !submission) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h1 className="text-2xl font-bold">Submission detail</h1>
          <p className="text-sm text-foreground/60 mt-1">Loaded with `submission.getById`.</p>
          <p className="text-sm mt-2">Submission ID: <span className="font-mono">{submission.id}</span></p>
          <p className="text-sm">Form ID: <span className="font-mono">{submission.formId}</span></p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/submissions")}>Back</Button>
            <Button variant="outline" className="text-red-400 border-red-400/20" onClick={deleteSubmission}>
              <Trash2 className="w-4 h-4 mr-1" />Delete
            </Button>
          </div>
        </div>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-3">Values</h2>
          <p className="text-sm text-foreground/60 mb-3">Loaded with `submissionValue.getBySubmissionId`.</p>
          <div className="space-y-2">
            {values.map((entry) => (
              <div key={entry.id} className="rounded border border-primary/10 p-2 text-sm">
                <span className="font-mono">{entry.fieldId}</span>: {entry.value}
              </div>
            ))}
            {values.length === 0 ? <p className="text-sm text-foreground/60">No values yet.</p> : null}
          </div>
        </div>

        <form onSubmit={addValue} className="bg-card/30 border border-primary/10 rounded-xl p-6 space-y-3">
          <h2 className="text-lg font-semibold">Add value row</h2>
          <p className="text-sm text-foreground/60">Uses `submissionValue.create` for manual data insertion.</p>
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
          >
            <option value="">Select field</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>{field.label}</option>
            ))}
          </select>
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" />
          <Button type="submit" className="bg-primary" disabled={savingValue}>{savingValue ? "Saving..." : "Add value"}</Button>
        </form>
      </div>
    </div>
  );
}
