import { InfoPage } from "@/components/shared/InfoPage";

const Terms = () => (
  <InfoPage
    eyebrow="Terms"
    title="Terms of Use"
    description="Plain-English rules for using Community Acquired Finance."
    sections={[
      {
        title: "Educational use only",
        body: <p>This site provides general education. It does not create a professional-client relationship and should not be treated as personalized advice.</p>,
      },
      {
        title: "Your decisions",
        body: <p>You are responsible for confirming important decisions with official sources, plan documents, your employer, or an appropriate licensed professional.</p>,
      },
      {
        title: "Accuracy and updates",
        body: <p>We work to keep information useful and current, but rules, plan details, costs, and laws can change. We do not guarantee that every page is complete or current at all times.</p>,
      },
      {
        title: "External links",
        body: <p>External links are provided for convenience and sourcing. We do not control outside websites and are not responsible for their content or policies.</p>,
      },
      {
        title: "Limitation of liability",
        body: <p>Use this site at your own risk. Community Acquired Finance is not responsible for losses or decisions made from using educational content or calculator estimates.</p>,
      },
    ]}
  />
);

export default Terms;
