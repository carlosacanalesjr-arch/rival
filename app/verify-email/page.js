import { Suspense } from "react";
import VerifyEmailScreen from "@/app/components/VerifyEmailScreen";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailScreen />
    </Suspense>
  );
}
