"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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

  const currentField = useMemo(() => fields[currentIndex], [fields, currentIndex]);
  const isLastQuestion = currentIndex === fields.length - 1;

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
      router.push(`/forms/${shareId}/thank-you?message=${message}`);
    } catch (submitError: any) {
      toast.error(submitError.message || "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#060913]" />;
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
      <div className="min-h-screen bg-[#060913] text-foreground flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card/30 border border-primary/10 rounded-xl p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">{form.title}</h1>
          <p className="text-foreground/70">This form has no questions yet.</p>
        </div>
      </div>
    );
  }

  const answer = answers[currentField.id];

  return (
    <div className="min-h-screen bg-[#060913] text-foreground py-14 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card/30 border border-primary/10 rounded-xl p-6">
          <p className="text-sm text-primary mb-2">
            Question {currentIndex + 1} of {fields.length}
          </p>
          <h1 className="text-2xl font-bold">{form.title}</h1>
          <p className="text-foreground/70 mt-1">{currentField.label}</p>
          {currentField.isRequired ? (
            <p className="text-xs text-red-400 mt-1">Required question</p>
          ) : null}

          <div className="mt-5 space-y-3">
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
              />
            ) : null}

            {currentField.fieldType === "LONG_TEXT" ? (
              <Textarea
                value={typeof answer === "string" ? answer : ""}
                onChange={(event) => setAnswer(currentField.id, event.target.value)}
                placeholder={currentField.placeholder || "Type your answer"}
              />
            ) : null}

            {currentField.fieldType === "SINGLE_SELECT" || currentField.fieldType === "DROPDOWN" ? (
              <div className="space-y-2">
                {currentField.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={currentField.id}
                      checked={answer === option.value}
                      onChange={() => setAnswer(currentField.id, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : null}

            {currentField.fieldType === "MULTI_SELECT" || currentField.fieldType === "CHECKBOX" ? (
              <div className="space-y-2">
                {currentField.options.map((option) => (
                  <label key={option.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Array.isArray(answer) ? answer.includes(option.value) : false}
                      onChange={() => toggleMultiOption(currentField.id, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={goPrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            {!isLastQuestion ? (
              <Button className="bg-primary" onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button className="bg-primary" onClick={submit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
