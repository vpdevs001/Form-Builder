"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AccountShell } from "~/components/account/account-shell";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useAuth } from "~/providers/auth-provider";
import { trpc } from "~/trpc/client";

export default function ChangeDetailsPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const changeDetailsMutation = trpc.auth.changeUserDetails.useMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName || "");
      setEmail(user.email);
    }
  }, [user]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const payload: {
      firstName?: string;
      lastName?: string;
      email?: string;
    } = {};

    if (firstName !== user.firstName) payload.firstName = firstName;
    if ((lastName || null) !== user.lastName) payload.lastName = lastName || undefined;
    if (email !== user.email) payload.email = email;

    if (Object.keys(payload).length === 0) {
      toast.error("Change at least one field before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await changeDetailsMutation.mutateAsync(payload);
      utils.auth.me.setData(undefined, updated);
      toast.success("Profile updated successfully.");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#060913] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <AccountShell title="Change details" description="Update your creator profile information.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full bg-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </AccountShell>
  );
}
