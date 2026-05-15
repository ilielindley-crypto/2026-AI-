import { Suspense } from "react";
import { HomeShell } from "@/components/HomeShell";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-slate-400">
          加载战术中枢…
        </div>
      }
    >
      <HomeShell />
    </Suspense>
  );
}
