"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/trpc/server";
import { toast } from "sonner";

type FieldType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "EMAIL"
  | "NUMBER"
  | "SINGLE_SELECT"
  | "MULTI_SELECT";

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState<Awaited<ReturnType<typeof api.form.getById.query>> | null>(null);
  const [fields, setFields] = useState<Awaited<ReturnType<typeof api.formField.getByFormId.query>>>([]);
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("SHORT_TEXT");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [formData, fieldData] = await Promise.all([
        api.form.getById.query({ id: formId }),
        api.formField.getByFormId.query({ formId }),
      ]);
      setForm(formData);
      setFields(fieldData.sort((a, b) => a.fieldOrder - b.fieldOrder));
    } catch (error: any) {
      toast.error(error.message || "Failed to load form");
    }
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!loading && isAuthenticated && user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated, user, formId, router]);

  const canHaveOptions = useMemo(
    () => fieldType === "SINGLE_SELECT" || fieldType === "MULTI_SELECT",
    [fieldType],
  );

  const handleAddField = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const optionList = canHaveOptions
        ? options
            .split(",")
            .map((option) => option.trim())
            .filter(Boolean)
            .map((option, index) => ({
              label: option,
              value: option.toLowerCase().replace(/\s+/g, "-"),
              optionOrder: index,
            }))
        : undefined;

      await api.formField.create.mutate({
        formId: form.id,
        label,
        fieldType,
        isRequired: required,
        fieldOrder: fields.length,
        options: optionList,
      });

      setLabel("");
      setRequired(false);
      setOptions("");
      toast.success("Question added");
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (next: "PUBLISHED" | "ARCHIVED") => {
    try {
      if (next === "PUBLISHED") {
        await api.form.publish.mutate({ id: formId });
      } else {
        await api.form.archive.mutate({ id: formId });
      }
      await loadData();
      toast.success(`Form ${next.toLowerCase()} successfully`);
    } catch (error: any) {
      toast.error(error.message || "Failed to change form status");
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="min-h-screen bg-[#060913]" />;
  }

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h1 className="text-2xl font-bold">{form?.title || "Form builder"}</h1>
          <p className="text-sm text-foreground/60 mt-2">
            Share link:{" "}
            <button
              type="button"
              onClick={() => router.push(`/forms/${form?.shareId}`)}
              className="text-primary underline cursor-pointer"
            >
              /forms/{form?.shareId}
            </button>
          </p>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => setStatus("PUBLISHED")} className="bg-primary">
              Publish
            </Button>
            <Button variant="outline" onClick={() => setStatus("ARCHIVED")}>
              Archive
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Back to dashboard
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleAddField}
          className="bg-card/30 border border-primary/10 rounded-xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold">Add a question</h2>
          <div className="space-y-2">
            <Label htmlFor="label">Question label</Label>
            <Input
              id="label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              required
              placeholder="What did you enjoy most?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fieldType">Field type</Label>
            <select
              id="fieldType"
              value={fieldType}
              onChange={(event) => setFieldType(event.target.value as FieldType)}
              className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
            >
              <option value="SHORT_TEXT">Short text</option>
              <option value="LONG_TEXT">Long text</option>
              <option value="EMAIL">Email</option>
              <option value="NUMBER">Number</option>
              <option value="SINGLE_SELECT">Single select</option>
              <option value="MULTI_SELECT">Multi select</option>
            </select>
          </div>
          {canHaveOptions ? (
            <div className="space-y-2">
              <Label htmlFor="options">Options (comma separated)</Label>
              <Input
                id="options"
                value={options}
                onChange={(event) => setOptions(event.target.value)}
                placeholder="Naruto, Luffy, Eren"
                required
              />
            </div>
          ) : null}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={required}
              onChange={(event) => setRequired(event.target.checked)}
            />
            Required question
          </label>
          <Button type="submit" className="bg-primary" disabled={saving}>
            {saving ? "Saving..." : "Add question"}
          </Button>
        </form>

        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Questions ({fields.length})</h2>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-primary/10 p-3">
                <p className="font-medium">
                  {index + 1}. {field.label}
                </p>
                <p className="text-sm text-foreground/60">
                  {field.fieldType} {field.isRequired ? "• required" : ""}
                </p>
              </div>
            ))}
            {fields.length === 0 ? (
              <p className="text-sm text-foreground/60">No questions yet. Add your first question.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
