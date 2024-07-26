import { SiteConfig } from "@/types/siteConfig";
import { BsGithub, BsTwitterX } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const OPEN_SOURCE_URL = "https://github.com/";

const baseSiteConfig = {
  name: "YouTube Script Writer",
  description:
    "Leverage this AI-driven scriptwriting tool to effortlessly create compelling YouTube scripts that resonate with your audience and boost your channel's growth.",
  url: "https://landingpage.weijunext.com",
  ogImage: "https://landingpage.weijunext.com/og.png",
  metadataBase: "/",
  keywords: [
    "landing page boilerplate",
    "landing page template",
    "awesome landing page",
    "next.js landing page",
  ],
  authors: [
    {
      name: "weijunext",
      url: "https://weijunext.com",
      twitter: "https://twitter.com/weijunext",
    },
  ],
  creator: "@weijunext",
  openSourceURL: "https://github.com/weijunext/landing-page-boilerplate",
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  nextThemeColor: "light", // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/logo.jpeg",
  },
  headerLinks: [
    { name: "repo", href: OPEN_SOURCE_URL, icon: BsGithub },
    {
      name: "twitter",
      href: "https://x.com/",
      icon: BsTwitterX,
    },
  ],
  footerLinks: [
    { name: "email", href: "mailto:weijunext@gmail.com", icon: MdEmail },
    { name: "twitter", href: "https://x.com/", icon: BsTwitterX },
    { name: "github", href: "https://github.com/", icon: BsGithub },
  ],
  footerProducts: [
    { url: "https://weijunext.com/", name: "J实验室" },
    { url: "https://smartexcel.cc/", name: "Smart Excel" },
    {
      url: "https://landingpage.weijunext.com/",
      name: "Landing Page Boilerplate",
    },
    { url: "https://nextjs.weijunext.com/", name: "Next.js Practice" },
    { url: "https://starter.weijunext.com/", name: "Next.js Starter" },
    { url: "https://githubbio.com", name: "Github Bio Generator" },
    {
      url: "https://github.com/weijunext/indie-hacker-tools",
      name: "Indie Hacker Tools",
    },
  ],
};

export const siteConfig: SiteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
};
