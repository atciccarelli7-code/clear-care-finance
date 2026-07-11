import { FinancialNavigator } from "@/components/navigator/FinancialNavigator";
import { useSeo } from "@/lib/seo";

const StartHere = () => {
  useSeo({
    title: "Financial Navigator: Build Your Next Money Action Plan",
    description: "Build a private, practical action plan for wealth, workplace benefits, healthcare costs, Medicare, Medicaid, or a healthcare-career decision.",
    canonicalPath: "/start-here",
  });

  return <FinancialNavigator />;
};

export default StartHere;
