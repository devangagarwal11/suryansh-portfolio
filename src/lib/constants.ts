import type { NavLink, SocialLink } from "@/types";

export const siteConfig = {
  name: "Suryansh Srivastava",
  title: "%s | Suryansh Srivastava — Lead Full-Stack Developer",
  defaultTitle: "Suryansh Srivastava — Lead Developer & Designer",
  description:
    "Lead full-stack developer and designer crafting high-performance digital experiences. Explore my portfolio of innovative web applications, SaaS platforms, and creative designs.",
  url: "https://suryanshsrivastavaa.vercel.app/",
  ogImage: "/og-image.png",
  twitterHandle: "@suryanshs",
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/pandey-aditya04/PortFolio-Suryansh",
    icon: "Github",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/suryanshsrivastavaa",
    icon: "Linkedin",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/suryanshs",
    icon: "Twitter",
  },
  {
    name: "Email",
    url: "mailto:suryanshsrivastava05@gmail.com",
    icon: "Mail",
  },
];

export const categories = [
  "All",
  "Web App",
  "Mobile App",
  "UI/UX Design",
  "SaaS",
] as const;
