import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalculatorByKey } from "@/components/calculators/CalculatorByKey";
import { CALCULATOR_ICONS } from "@/components/calculators/CalculatorIcon";
import { CalculatorCard } from "@/components/shared/CalculatorCard";
import { PageHero } from "@/components/shared/PageHero";
import { getCalculatorBySlug } from "@/data/calculators";
import NotFound from "@/pages/NotFound";

const CalculatorPage = () => {
  const { calculatorSlug } = useParams();
  const calculator = getCalculatorBySlug(calculatorSlug);

  if (!calculator) return <NotFound />;

  const Icon = CALCULATOR_ICONS[calculator.icon];

  return (
    <>
      <PageHero eyebrow={calculator.eyebrow} title={calculator.title} description={calculator.description}>
        <Button asChild variant="outline" size="sm" className="min-h-11">
          <Link to="/tools"><ArrowLeft className="h-4 w-4" /> All calculators</Link>
        </Button>
      </PageHero>
      <section className="container py-8 md:py-12">
        <CalculatorCard
          icon={Icon}
          title="Calculate your estimate"
          description="Change any input and the estimate updates immediately. Use Start over to restore the example values."
          relatedArticle={calculator.relatedArticle}
        >
          <CalculatorByKey k={calculator.key} />
        </CalculatorCard>
      </section>
    </>
  );
};

export default CalculatorPage;
