import { InfoPage } from "@/components/shared/InfoPage";

const AdvertisingPolicy = () => (
  <InfoPage
    eyebrow="Advertising policy"
    title="Advertising Policy"
    description="How ads may appear on Community Acquired Finance without controlling the educational content."
    sections={[
      {
        title: "Future advertising",
        body: <p>Ads may appear on the site in the future to help support hosting, research, and educational content.</p>,
      },
      {
        title: "Editorial independence",
        body: <p>Ads do not determine article conclusions, calculator design, source selection, or educational recommendations.</p>,
      },
      {
        title: "Sponsored content",
        body: <p>If sponsored content is ever published, it should be clearly labeled so readers can tell it apart from regular educational content.</p>,
      },
      {
        title: "Ad placement standards",
        body: <p>Ads should not be placed in a way that confuses readers, interferes with calculators, looks like navigation, or blocks the main educational experience.</p>,
      },
    ]}
  />
);

export default AdvertisingPolicy;
