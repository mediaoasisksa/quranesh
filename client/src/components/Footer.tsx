import { BookOpen, Mail, MessageCircle, Globe } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Success Stories", href: "#testimonials" },
      ],
    },
    {
      title: "Learning",
      links: [
        { name: "Arabic Grammar", href: "#" },
        { name: "Pronunciation Guide", href: "#" },
        { name: "Quranic Context", href: "#" },
        { name: "Practice Exercises", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Community Forum", href: "#" },
        { name: "Feedback", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Islamic Guidelines", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
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
                Empowering Huffaz worldwide to transform their Quranic knowledge
                into practical Arabic communication skills through AI-powered
                learning.
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
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {link.name}
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
              © 2024 Quranic. All rights reserved. Developed with respect for
              Islamic values.
            </div>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Islamic Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
