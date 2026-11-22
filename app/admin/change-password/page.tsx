import { ChangePasswordForm } from "@/components/page/change-password/change-password-form";
import { PageHeader } from "@/components/page/page-header";

export default function ChangePasswordPage() {
  return (
    <div className="py-4 md:py-6">
      <div className="mx-auto w-full max-w-2xl space-y-3 px-4 lg:px-6">
        <PageHeader
          title="Ubah Password"
          description="Perbarui password akun Anda."
        />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
