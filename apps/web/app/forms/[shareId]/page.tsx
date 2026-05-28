"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { getFormTheme } from "~/lib/form-themes";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";
import { toast } from "sonner";

type AnswerMap = Record<string, string | string[]>;

export default function FillFormPage() {
  const router = useRouter();
  const params = useParams<{ shareId: string }>();
  const shareId = params.shareId;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [form, setForm] = useState<Awaited<ReturnType<typeof api.form.getByShareId.query>> | null>(null);
  const [fields, setFields] = useState<Awaited<ReturnType<typeof api.formField.getByFormId.query>>>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});

  useEffect(() => {
    const load = async () => {
      try {
        const formData = await api.form.getByShareId.query({ shareId });
        if (formData.status !== "PUBLISHED" || formData.visibility === "PRIVATE") {
          setError("This form is not available for responses.");
          return;
        }
        if (!formData.acceptsResponses) {
          setError("This form is currently not accepting responses.");
          return;
        }
        const fieldData = await api.formField.getByFormId.query({ formId: formData.id });
        const ordered = [...fieldData].sort((a, b) => a.fieldOrder - b.fieldOrder);
        setForm(formData);
        setFields(ordered);
      } catch (loadError: any) {
        setError(loadError.message || "Form not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shareId]);

  const theme = useMemo(() => getFormTheme(form?.theme), [form?.theme]);
  const currentField = useMemo(() => fields[currentIndex], [fields, currentIndex]);
  const isLastQuestion = currentIndex === fields.length - 1;
  const progress = fields.length > 0 ? ((currentIndex + 1) / fields.length) * 100 : 0;

  const setAnswer = (fieldId: string, value: string | string[]) => {
    setAnswers((previous) => ({ ...previous, [fieldId]: value }));
  };

  const toggleMultiOption = (fieldId: string, value: string) => {
    const current = answers[fieldId];
    const currentValues = Array.isArray(current) ? current : [];
    if (currentValues.includes(value)) {
      setAnswer(
        fieldId,
        currentValues.filter((entry) => entry !== value),
      );
      return;
    }
    setAnswer(fieldId, [...currentValues, value]);
  };

  const validateCurrentField = () => {
    if (!currentField?.isRequired) return true;
    const answer = answers[currentField.id];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return Boolean(answer && answer.trim().length > 0);
  };

  const goNext = () => {
    if (!validateCurrentField()) {
      toast.error("Please answer this required question before proceeding.");
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, fields.length - 1));
  };

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  };

  const submit = async () => {
    const missingRequired = fields.some((field) => {
      if (!field.isRequired) return false;
      const answer = answers[field.id];
      if (Array.isArray(answer)) return answer.length === 0;
      return !answer || answer.trim().length === 0;
    });

    if (missingRequired) {
      toast.error("Please answer all required questions before submitting.");
      return;
    }

    if (!form) return;
    setSubmitting(true);
    try {
      const values = fields
        .map((field) => ({
          fieldId: field.id,
          value: Array.isArray(answers[field.id])
            ? (answers[field.id] as string[]).join(", ")
            : ((answers[field.id] as string | undefined) ?? ""),
        }))
        .filter((item) => item.value.trim().length > 0);

      const respondentEmailFromField = fields.find((field) => field.fieldType === "EMAIL");
      const respondentEmail = respondentEmailFromField
        ? (answers[respondentEmailFromField.id] as string | undefined)
        : undefined;

      await api.submission.create.mutate({
        formId: form.id,
        ipAddress: "0.0.0.0",
        userAgent: navigator.userAgent,
        respondentEmail: respondentEmail || undefined,
        values,
      });

      const message = encodeURIComponent(form.thankYouMessage || "Thank you for your response!");
      const themeParam = encodeURIComponent(form.theme);
      router.push(`/forms/${shareId}/thank-you?message=${message}&theme=${themeParam}`);
    } catch (submitError: any) {
      toast.error(submitError.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className={cn("min-h-screen", getFormTheme().bg)} />;
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#060913] text-foreground flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card/30 border border-primary/10 rounded-xl p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Form unavailable</h1>
          <p className="text-foreground/70">{error || "This form could not be loaded."}</p>
        </div>
      </div>
    );
  }

  if (!currentField) {
    return (
      <div className={cn("min-h-screen text-foreground flex items-center justify-center p-4", theme.bg)}>
        <div className={cn("max-w-lg w-full rounded-2xl p-6 text-center border backdrop-blur-md", theme.card)}>
          <p className={cn("text-xs uppercase tracking-widest mb-2", theme.accentText)}>{theme.japanese}</p>
          <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
          <p className="text-foreground/70">This form has no questions yet.</p>
        </div>
      </div>
    );
  }

  const answer = answers[currentField.id];

  return (
    <div className={cn("min-h-screen text-foreground relative overflow-hidden", theme.bg)}>
      <div className={cn("absolute inset-0 bg-linear-to-br pointer-events-none", theme.glow)} />
      <div className="absolute top-8 right-4 w-28 h-28 opacity-20 pointer-events-none hidden sm:block">
        <Image src={theme.decorImage} alt="" fill className="object-contain" aria-hidden />
      </div>
      <div className="absolute bottom-8 left-4 w-36 h-36 opacity-15 pointer-events-none hidden md:block">
        <Image src={theme.decorImage} alt="" fill className="object-contain" aria-hidden />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="px-4 pt-6">
          <div className="max-w-2xl mx-auto">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={cn("h-full transition-all duration-300", theme.progress)}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={cn("text-xs mt-3 font-semibold tracking-wide", theme.accentText)}>
              {theme.label} • Question {currentIndex + 1} of {fields.length}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-10">
          <div className={cn("max-w-2xl w-full rounded-2xl border backdrop-blur-md p-8 shadow-2xl relative", theme.card)}>
            <div className="absolute -top-16 right-0 w-32 h-32 opacity-90 pointer-events-none hidden sm:block">
              <Image
                src={theme.characterImage}
                alt=""
                fill
                className="object-contain drop-shadow-lg"
                aria-hidden
              />
            </div>

            {currentIndex === 0 && form.description ? (
              <p className="text-sm text-foreground/60 mb-4">{form.description}</p>
            ) : null}

            <p className={cn("text-xs uppercase tracking-[0.2em] mb-3", theme.accentText)}>
              {theme.japanese}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight mb-2">{currentField.label}</h1>
            {currentField.helpText ? (
              <p className="text-sm text-foreground/60 mb-2">{currentField.helpText}</p>
            ) : null}
            {currentField.isRequired ? (
              <p className="text-xs text-red-400 mb-6">Required</p>
            ) : (
              <div className="mb-6" />
            )}

            <div className="space-y-3">
              {["SHORT_TEXT", "EMAIL", "NUMBER", "DATE"].includes(currentField.fieldType) ? (
                <Input
                  type={
                    currentField.fieldType === "EMAIL"
                      ? "email"
                      : currentField.fieldType === "NUMBER"
                        ? "number"
                        : currentField.fieldType === "DATE"
                          ? "date"
                          : "text"
                  }
                  value={typeof answer === "string" ? answer : ""}
                  onChange={(event) => setAnswer(currentField.id, event.target.value)}
                  placeholder={currentField.placeholder || "Type your answer"}
                  className="py-6 text-base bg-black/30 border-white/10"
                />
              ) : null}

              {currentField.fieldType === "LONG_TEXT" ? (
                <Textarea
                  value={typeof answer === "string" ? answer : ""}
                  onChange={(event) => setAnswer(currentField.id, event.target.value)}
                  placeholder={currentField.placeholder || "Type your answer"}
                  className="min-h-32 text-base bg-black/30 border-white/10"
                />
              ) : null}

              {currentField.fieldType === "SINGLE_SELECT" ||
              currentField.fieldType === "DROPDOWN" ||
              currentField.fieldType === "RATING" ? (
                <div className="grid gap-2">
                  {currentField.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAnswer(currentField.id, option.value)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                        answer === option.value
                          ? `${theme.border} bg-white/10`
                          : "border-white/10 hover:border-white/25 bg-black/20",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}

              {currentField.fieldType === "MULTI_SELECT" || currentField.fieldType === "CHECKBOX" ? (
                <div className="grid gap-2">
                  {currentField.options.map((option) => {
                    const selected = Array.isArray(answer) ? answer.includes(option.value) : false;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => toggleMultiOption(currentField.id, option.value)}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-left transition-all cursor-pointer",
                          selected
                            ? `${theme.border} bg-white/10`
                            : "border-white/10 hover:border-white/25 bg-black/20",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={goPrevious}
                disabled={currentIndex === 0}
                className="border-white/15 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              {!isLastQuestion ? (
                <Button className={theme.button} onClick={goNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button className={theme.button} onClick={submit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
