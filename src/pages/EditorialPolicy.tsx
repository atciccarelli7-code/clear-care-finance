import { InfoPage } from "@/components/shared/InfoPage";

const EditorialPolicy = () => (
  <InfoPage
    eyebrow="Editorial policy"
    title="Editorial Policy"
    description="How Community Acquired Finance creates, sources, reviews, and updates educational content."
    sections={[
      {
        title: "Purpose",
        body: <p>Community Acquired Finance translates healthcare, benefits, insurance, retirement, and patient-cost topics into plain English for healthcare workers, patients, families, and caregivers.</p>,
      },
      {
        title: "Sources",
        body: <p>We prioritize official government sources, employer or plan documents when applicable, reputable nonprofits, institutional research, and primary-source material whenever possible.</p>,
      },
      {
        title: "Updates and corrections",
        body: <p>Pages may be updated when rules, costs, data, or source material changes. Corrections are welcome through the Contact page.</p>,
      },
      {
        title: "AI assistance",
        body: <p>AI tools may help with drafting, formatting, research organization, and code structure. Final editorial responsibility remains with the site owner.</p>,
      },
    ]}
  />
);

export default EditorialPolicy;
