import FAQ from "@/components/home/FAQ";
import Feature from "@/components/home/Feature";
import Hero from "@/components/home/Hero";
import WallOfLove from "@/components/home/WallOfLove";
import Writer from "@/components/writer/writer";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import Terms from './terms';

export default async function LangHome({
  params: { lang },
}: {
  params: { lang: string };
}) {
  // const langName = (lang && lang[0]) || defaultLocale;
  let langName =
    lang && lang[0] && lang[0] !== "index" ? lang[0] : defaultLocale;
  
  const dict = await getDictionary(langName);
  if (lang && lang[1] && lang[1] === 'terms') {
    return <Terms locale={dict.terms_of_service} />
  } else {
    return (
      <>
        {/* Hero Section */}
        <Hero locale={dict.Hero} CTALocale={dict.CTAButton} />
  
        {/* <SocialProof locale={dict.SocialProof} /> */}
        {/* display technology stack, partners, project honors, etc. */}
        {/* <ScrollingLogos /> */}
  
        <Writer locale={dict.Writer} lang={lang} />
  
        {/* USP (Unique Selling Proposition) */}
        <Feature id="Features" locale={dict.Feature} langName={langName} />
  
        {/* 价格 */}
        {/* <Pricing id="Pricing" locale={dict.Pricing} langName={langName} /> */}
  
        {/* Testimonials / Wall of Love */}
        <WallOfLove id="WallOfLove" locale={dict.WallOfLove} />
  
        {/* FAQ (Frequently Asked Questions) */}
        <FAQ id="FAQ" locale={dict.FAQ} langName={langName} />
  
        {/* CTA (Call to Action) */}
        {/* <CTA locale={dict.CTA} CTALocale={dict.CTAButton} /> */}
      </>
    );
  }
  
}
