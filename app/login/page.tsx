import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-dvh">
      <LoginForm />
    </main>
  );
}
export const metadata: Metadata = {
  title: "Connexion",
};
