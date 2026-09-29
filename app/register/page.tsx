import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-dvh">
      <RegisterForm />
    </main>
  );
}
export const metadata: Metadata = {
  title: "Créer un compte",
};
