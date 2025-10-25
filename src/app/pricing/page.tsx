import { PricingSection } from "@/components/blocks/pricing-section";

const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Try before you buy",
    features: [
      "3 AI transformations per day",
      "Standard AI model",
      "Limited styles",
      "Watermarked output",
    ],
    cta: "Start Free",
  },
  {
    id: "basic-plus",
    name: "Basic Plus",
    price: {
      monthly: 9.99,
      yearly: 99.99, // 2 months free bonus
    },
    description: "More power for daily users",
    features: [
      "15 AI transformations per day",
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
      monthly: 19.99,
      yearly: 199.99, // 2 months discount
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
    description: "Custom plan for agencies",
    features: [
      "Custom limits and features",
      "API access",
      "White-label usage",
      "Priority support",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
];

const page = () => {
  return (
    <div className="relative flex justify-center items-center w-full mt-20 scale-90 md:scale-100">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="Simple Pricing"
        subtitle="Choose the plan that best fits your needs"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  );
};
export default page;
