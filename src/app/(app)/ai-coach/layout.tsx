import { AiCoachProvider } from "@/features/ai-coach/context/ai-provider";

export default function AiCoachLayout({ children }: { children: React.ReactNode }) {
  return <AiCoachProvider>{children}</AiCoachProvider>;
}
