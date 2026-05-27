"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GripVertical, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormWorkspaceNav } from "~/components/forms/form-workspace-nav";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/providers/auth-provider";
import { api } from "~/trpc/server";

type FieldType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "EMAIL"
  | "NUMBER"
  | "SINGLE_SELECT"
  | "MULTI_SELECT"
  | "CHECKBOX"
  | "DROPDOWN"
  | "RATING"
  | "DATE";

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  SHORT_TEXT: "Short text",
  LONG_TEXT: "Long text",
  EMAIL: "Email",
  NUMBER: "Number",
  SINGLE_SELECT: "Single select",
  MULTI_SELECT: "Multi select",
  CHECKBOX: "Checkbox",
  DROPDOWN: "Dropdown",
  RATING: "Rating",
  DATE: "Date",
};

export default function FormBuilderPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState<Awaited<ReturnType<typeof api.form.getById.query>> | null>(null);
  const [fields, setFields] = useState<Awaited<ReturnType<typeof api.formField.getByFormId.query>>>([]);
  const [label, setLabel] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [helpText, setHelpText] = useState("");
  const [fieldType, setFieldType] = useState<FieldType>("SHORT_TEXT");
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editHelpText, setEditHelpText] = useState("");
  const [editPlaceholder, setEditPlaceholder] = useState("");
  const [editRequired, setEditRequired] = useState(false);
  const [editFieldType, setEditFieldType] = useState<FieldType>("SHORT_TEXT");
  const [editOptions, setEditOptions] = useState("");

  const loadData = async () => {
    try {
      const [formData, fieldData] = await Promise.all([
        api.form.getById.query({ id: formId }),
        api.formField.getByFormId.query({ formId }),
      ]);
      if (user && formData.creatorId !== user.id) {
        toast.error("You do not have access to this form.");
        router.push("/dashboard");
        return;
      }
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
    () =>
      ["SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN"].includes(fieldType),
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

      if (canHaveOptions && (!optionList || optionList.length === 0)) {
        toast.error("Add at least one option for this field type.");
        setSaving(false);
        return;
      }

      await api.formField.create.mutate({
        formId: form.id,
        label,
        placeholder: placeholder || undefined,
        helpText: helpText || undefined,
        fieldType,
        isRequired: required,
        fieldOrder: fields.length,
        options: optionList,
      });

      setLabel("");
      setPlaceholder("");
      setHelpText("");
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

  const handleDeleteField = async (fieldId: string) => {
    setDeletingId(fieldId);
    try {
      await api.formField.delete.mutate({ id: fieldId });
      toast.success("Question removed");
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete question");
    } finally {
      setDeletingId(null);
    }
  };

  const beginEditField = (field: Awaited<ReturnType<typeof api.formField.getByFormId.query>>[number]) => {
    setEditingFieldId(field.id);
    setEditLabel(field.label);
    setEditHelpText(field.helpText || "");
    setEditPlaceholder(field.placeholder || "");
    setEditRequired(field.isRequired);
    setEditFieldType(field.fieldType as FieldType);
    setEditOptions(field.options.map((option) => option.label).join(", "));
  };

  const saveEditedField = async () => {
    if (!editingFieldId) return;
    const optionCapable = ["SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN"].includes(editFieldType);
    const optionList = optionCapable
      ? editOptions
          .split(",")
          .map((option) => option.trim())
          .filter(Boolean)
          .map((option, index) => ({
            label: option,
            value: option.toLowerCase().replace(/\s+/g, "-"),
            optionOrder: index,
          }))
      : undefined;
    try {
      await api.formField.update.mutate({
        id: editingFieldId,
        label: editLabel,
        helpText: editHelpText || undefined,
        placeholder: editPlaceholder || undefined,
        isRequired: editRequired,
        fieldType: editFieldType,
        options: optionList,
      });
      toast.success("Question updated");
      setEditingFieldId(null);
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update question");
    }
  };

  const setStatus = async (next: "PUBLISHED" | "ARCHIVED") => {
    try {
      if (next === "PUBLISHED") {
        if (fields.length === 0) {
          toast.error("Add at least one question before publishing.");
          return;
        }
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
              <p className="text-xs uppercase tracking-wider text-primary font-bold">Question builder</p>
              <h1 className="text-2xl font-bold mt-1">{form?.title || "Form builder"}</h1>
              <p className="text-sm text-foreground/60 mt-1">
                Theme: {form?.theme} • {fields.length} question{fields.length === 1 ? "" : "s"}
              </p>
            </div>
            <FormWorkspaceNav formId={formId} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={() => setStatus("PUBLISHED")} className="bg-primary">
              Publish
            </Button>
            <Button variant="outline" onClick={() => setStatus("ARCHIVED")}>
              Archive
            </Button>
            <Button variant="outline" onClick={() => router.push(`/forms/${form?.shareId}`)}>
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <form
            onSubmit={handleAddField}
            className="lg:col-span-2 bg-card/30 border border-primary/10 rounded-2xl p-6 space-y-4 h-fit"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold">Add question</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Question</Label>
              <Input
                id="label"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                required
                placeholder="What did you enjoy most?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldType">Answer type</Label>
              <select
                id="fieldType"
                value={fieldType}
                onChange={(event) => setFieldType(event.target.value as FieldType)}
                className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
              >
                {Object.entries(FIELD_TYPE_LABELS).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={placeholder}
                onChange={(event) => setPlaceholder(event.target.value)}
                placeholder="Optional hint text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="helpText">Help text</Label>
              <Textarea
                id="helpText"
                value={helpText}
                onChange={(event) => setHelpText(event.target.value)}
                placeholder="Optional guidance for respondents"
                rows={2}
              />
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

            <Button type="submit" className="w-full bg-primary" disabled={saving}>
              {saving ? "Adding..." : "Add question"}
            </Button>
          </form>

          <div className="lg:col-span-3 bg-card/30 border border-primary/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Questions ({fields.length})</h2>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-primary/10 p-4 bg-[#060913]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <GripVertical className="w-4 h-4 text-foreground/30 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold text-white">
                          {index + 1}. {field.label}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{FIELD_TYPE_LABELS[field.fieldType as FieldType]}</Badge>
                          {field.isRequired ? <Badge className="bg-red-500/15 text-red-300">Required</Badge> : null}
                        </div>
                        {field.helpText ? (
                          <p className="text-xs text-foreground/50 mt-2">{field.helpText}</p>
                        ) : null}
                        {field.options.length > 0 ? (
                          <p className="text-xs text-foreground/50 mt-2">
                            Options: {field.options.map((option) => option.label).join(", ")}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => beginEditField(field)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-400/20"
                        disabled={deletingId === field.id}
                        onClick={() => handleDeleteField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {editingFieldId === field.id ? (
                    <div className="mt-4 space-y-3 border-t border-primary/10 pt-4">
                      <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
                      <Input
                        placeholder="Placeholder"
                        value={editPlaceholder}
                        onChange={(e) => setEditPlaceholder(e.target.value)}
                      />
                      <Textarea
                        placeholder="Help text"
                        value={editHelpText}
                        onChange={(e) => setEditHelpText(e.target.value)}
                        rows={2}
                      />
                      <select
                        value={editFieldType}
                        onChange={(e) => setEditFieldType(e.target.value as FieldType)}
                        className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
                      >
                        {Object.entries(FIELD_TYPE_LABELS).map(([value, text]) => (
                          <option key={value} value={value}>
                            {text}
                          </option>
                        ))}
                      </select>
                      {["SINGLE_SELECT", "MULTI_SELECT", "CHECKBOX", "DROPDOWN"].includes(editFieldType) ? (
                        <Input
                          value={editOptions}
                          onChange={(e) => setEditOptions(e.target.value)}
                          placeholder="Options (comma separated)"
                        />
                      ) : null}
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={editRequired}
                          onChange={(e) => setEditRequired(e.target.checked)}
                        />
                        Required
                      </label>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-primary" onClick={saveEditedField}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingFieldId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              {fields.length === 0 ? (
                <div className="rounded-xl border border-dashed border-primary/20 p-10 text-center">
                  <p className="text-foreground/60">No questions yet.</p>
                  <p className="text-sm text-foreground/40 mt-1">
                    Add your first question using the panel on the left.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
