import { InfoPage } from "@/components/shared/InfoPage";
import { DisclaimerBox } from "@/components/shared/DisclaimerBox";

const Disclaimer = () => (
  <>
    <InfoPage
      eyebrow="Disclaimer"
      title="Educational Disclaimer"
      description="What this site is and is not meant to do."
      sections={[
        {
          title: "Not professional advice",
          body: <p>This site is not financial, tax, legal, insurance, or medical advice. It is general education written to help people ask better questions and understand common terms.</p>,
        },
        {
          title: "Calculator estimates",
          body: <p>Healthcare cost, retirement, tax, paycheck, and benefits calculators are estimates. Actual results can vary based on plan rules, employer documents, state rules, tax law, and personal circumstances.</p>,
        },
        {
          title: "Verify important decisions",
          body: <p>Before making a financial, benefits, tax, insurance, legal, or healthcare decision, verify details with official sources, plan documents, your employer, or an appropriate licensed professional.</p>,
        },
      ]}
    />
    <section className="container max-w-3xl pb-16">
      <DisclaimerBox />
    </section>
  </>
);

export default Disclaimer;
