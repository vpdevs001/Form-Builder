"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Copy, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FormWorkspaceNav } from "~/components/forms/form-workspace-nav";
import { ThemePicker } from "~/components/forms/theme-picker";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useAuth } from "~/providers/auth-provider";
import { type FormThemeName } from "~/lib/form-themes";
import { api } from "~/trpc/server";

export default function FormSettingsPage() {
  const router = useRouter();
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { user, loading, isAuthenticated } = useAuth();

  const [form, setForm] = useState<Awaited<ReturnType<typeof api.form.getById.query>> | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "UNLISTED" | "PRIVATE">("PUBLIC");
  const [theme, setTheme] = useState<FormThemeName>("Naruto");
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [acceptsResponses, setAcceptsResponses] = useState(true);
  const [notifyCreator, setNotifyCreator] = useState(true);
  const [notifyRespondent, setNotifyRespondent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadForm = async () => {
    try {
      const data = await api.form.getById.query({ id: formId });
      if (user && data.creatorId !== user.id) {
        toast.error("You do not have access to this form.");
        router.push("/dashboard");
        return;
      }
      setForm(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setVisibility(data.visibility);
      setTheme(data.theme);
      setThankYouMessage(data.thankYouMessage || "");
      setAcceptsResponses(data.acceptsResponses);
      setNotifyCreator(data.notifyCreator);
      setNotifyRespondent(data.notifyRespondent);
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
      loadForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isAuthenticated, user, formId, router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.form.update.mutate({
        id: formId,
        title,
        description: description || undefined,
        visibility,
        acceptsResponses,
        notifyCreator,
        notifyRespondent,
      });
      await api.form.updateSettings.mutate({
        id: formId,
        theme,
        thankYouMessage: thankYouMessage || undefined,
        notifyCreator,
        notifyRespondent,
      });
      toast.success("Form details saved.");
      await loadForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  const copyShareLink = async () => {
    if (!form) return;
    const url = `${window.location.origin}/forms/${form.shareId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied.");
  };

  const handleDeleteForm = async () => {
    if (!form) return;
    const ok = window.confirm("Delete this form and all related data? This cannot be undone.");
    if (!ok) return;
    setDeleting(true);
    try {
      await api.form.delete.mutate({ id: form.id });
      toast.success("Form deleted.");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete form");
    } finally {
      setDeleting(false);
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-card/30 border border-primary/10 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary font-bold">Form workspace</p>
              <h1 className="text-2xl font-bold mt-1">{form?.title || "Form details"}</h1>
              <p className="text-sm text-foreground/60 mt-1">
                Status: {form?.status} • Visibility: {form?.visibility}
              </p>
            </div>
            <FormWorkspaceNav formId={formId} />
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <section className="bg-card/30 border border-primary/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Basic details</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this form is for"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                className="w-full rounded-md border border-primary/20 bg-[#060913] px-3 py-2 text-sm"
              >
                <option value="PUBLIC">Public (shown in explore)</option>
                <option value="UNLISTED">Unlisted (link only)</option>
                <option value="PRIVATE">Private (not fillable)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thankYou">Thank-you message</Label>
              <Textarea
                id="thankYou"
                value={thankYouMessage}
                onChange={(e) => setThankYouMessage(e.target.value)}
                placeholder="Thank you for your response!"
              />
            </div>
          </section>

          <section className="bg-card/30 border border-primary/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Form theme</h2>
            <p className="text-sm text-foreground/60">
              Respondents will see your form styled with the selected anime theme.
            </p>
            <ThemePicker value={theme} onChange={setTheme} />
          </section>

          <section className="bg-card/30 border border-primary/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Notifications & responses</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={acceptsResponses}
                onChange={(e) => setAcceptsResponses(e.target.checked)}
              />
              Accept new responses
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyCreator}
                onChange={(e) => setNotifyCreator(e.target.checked)}
              />
              Email me when someone submits
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={notifyRespondent}
                onChange={(e) => setNotifyRespondent(e.target.checked)}
              />
              Email respondent after submission
            </label>
          </section>

          {form ? (
            <section className="bg-card/30 border border-primary/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2">Share link</h2>
              <p className="text-sm text-foreground/60 mb-3 font-mono break-all">
                {typeof window !== "undefined" ? `${window.location.origin}/forms/${form.shareId}` : `/forms/${form.shareId}`}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={copyShareLink}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy link
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push(`/forms/${form.shareId}`)}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Preview form
                </Button>
              </div>
            </section>
          ) : null}

          {form ? (
            <section className="bg-card/30 border border-red-500/20 rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-2 text-red-300">Danger zone</h2>
              <p className="text-sm text-foreground/60 mb-4">
                Permanently delete this form and its responses.
              </p>
              <Button
                type="button"
                variant="outline"
                className="border-red-400/30 text-red-300"
                disabled={deleting}
                onClick={handleDeleteForm}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {deleting ? "Deleting..." : "Delete form"}
              </Button>
            </section>
          ) : null}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
              Back
            </Button>
            <Button type="submit" className="bg-primary" disabled={saving}>
              {saving ? "Saving..." : "Save form details"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
