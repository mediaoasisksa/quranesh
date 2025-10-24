import { BookOpen, Mail, MessageCircle, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Footer = () => {
  const { t } = useLanguage();

  const footerSections = [
    {
      titleKey: "platform",
      links: [
        { nameKey: "features", href: "#features" },
        { nameKey: "pricing", href: "#pricing" },
        { nameKey: "howItWorks", href: "#how-it-works" },
        { nameKey: "successStories", href: "#testimonials" },
      ],
    },
    {
      titleKey: "learning",
      links: [
        { nameKey: "arabicGrammar", href: "#" },
        { nameKey: "pronunciationGuide", href: "#" },
        { nameKey: "quranicContext", href: "#" },
        { nameKey: "practiceExercises", href: "#" },
      ],
    },
    {
      titleKey: "support",
      links: [
        { nameKey: "helpCenter", href: "#" },
        { nameKey: "contactUs", href: "#" },
        { nameKey: "communityForum", href: "#" },
        { nameKey: "feedback", href: "#" },
      ],
    },
    {
      titleKey: "company",
      links: [
        { nameKey: "aboutUs", href: "#" },
        { nameKey: "islamicGuidelines", href: "#" },
        { nameKey: "privacyPolicy", href: "#" },
        { nameKey: "termsOfService", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Quranic
                </span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('footerDescription')}
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-primary" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-primary/10 hover:bg-primary/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>

            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-foreground mb-4">
                  {t(section.titleKey as any)}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {t(link.nameKey as any)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              {t('footerCopyright')}
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('privacyPolicy')}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('termsOfService')}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t('islamicGuidelines')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
