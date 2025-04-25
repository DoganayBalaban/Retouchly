import { PricingSection } from "@/components/blocks/pricing-section";

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

export const TIERS = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Try before you buy",
    features: [
      "3 AI conversions per day",
      "Standard AI model",
      "Limited styles",
      "Watermarked output",
    ],
    cta: "Start for Free",
  },
  {
    id: "basic-plus",
    name: "Basic Plus",
    price: {
      monthly: 4.99,
      yearly: 49.99, // bonus: 2 ay bedava gibi
    },
    description: "More power for casual users",
    features: [
      "15 AI conversions/day",
      "3 bonus styles",
      "No watermark",
      "Faster processing",
    ],
    cta: "Upgrade Now",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 9.99,
      yearly: 89.99, // 2 ay indirimli
    },
    description: "Unlimited AI transformations",
    features: [
      "Unlimited usage",
      "All styles unlocked",
      "Priority processing",
      "Access to image history",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "Tailored plan for agencies",
    features: [
      "Custom limits & features",
      "API Access",
      "White-labeling",
      "Priority support",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
];

const page = () => {
  return (
    <div className="relative flex justify-center items-center w-full mt-20 scale-90">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="Simple Pricing"
        subtitle="Choose the best plan for your needs"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  );
};
export default page;
