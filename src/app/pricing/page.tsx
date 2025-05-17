import { PricingSection } from "@/components/blocks/pricing-section";

const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
  {
    id: "free",
    name: "Ücretsiz",
    price: {
      monthly: "Ücretsiz",
      yearly: "Ücretsiz",
    },
    description: "Satın almadan önce deneyin",
    features: [
      "Günde 3 yapay zeka dönüşümü",
      "Standart yapay zeka modeli",
      "Sınırlı stiller",
      "Filigranlı çıktı",
    ],
    cta: "Ücretsiz Başla",
  },
  {
    id: "basic-plus",
    name: "Basic Plus",
    price: {
      monthly: 19.99,
      yearly: 199.99, // bonus: 2 ay bedava gibi
    },
    description: "Günlük kullanıcılar için daha fazla güç",
    features: [
      "Günde 15 yapay zeka dönüşümü",
      "3 bonus stil",
      "Filigran yok",
      "Daha hızlı işlem",
    ],
    cta: "Hemen Yükselt",
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 39.99,
      yearly: 399.99, // 2 ay indirimli
    },
    description: "Sınırsız yapay zeka dönüşümü",
    features: [
      "Sınırsız kullanım",
      "Tüm stiller açık",
      "Öncelikli işlem",
      "Görsel geçmişine erişim",
    ],
    cta: "Pro Ol",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Kurumsal",
    price: {
      monthly: "Özel",
      yearly: "Özel",
    },
    description: "Ajanslar için özel plan",
    features: [
      "Özel limitler ve özellikler",
      "API erişimi",
      "Markasız kullanım (white-label)",
      "Öncelikli destek",
    ],
    cta: "Bize Ulaşın",
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
        title="Basit Fiyatlandırma"
        subtitle="İhtiyacınıza en uygun planı seçin"
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  );
};
export default page;
