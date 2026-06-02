import MainLayout from "@/components/layout/main-layout";
import AccountShell from "@/features/account/components/account-shell";
import ProfileForm from "@/features/account/components/profile-form";
import { getAccountProfile } from "@/lib/account";
import { requireCustomerSession } from "@/lib/session";

export const metadata = {
  title: "Profile | WOODLOOM",
  description: "Manage your WOODLOOM profile details.",
};

export default async function AccountProfilePage() {
  const session = await requireCustomerSession();
  const profile = await getAccountProfile(session);

  return (
    <MainLayout>
      <AccountShell>
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
          <p className="mb-3 text-sm uppercase tracking-[3px] text-[var(--primary)]">
            Profile
          </p>
          <h2 className="mb-8 text-4xl leading-tight">Personal Details</h2>

          <ProfileForm profile={profile} />
        </div>
      </AccountShell>
    </MainLayout>
  );
}
