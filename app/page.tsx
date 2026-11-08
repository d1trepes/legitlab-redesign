import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Categories } from "@/components/Categories";
import { Examples } from "@/components/Examples";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { Articles } from "@/components/Articles";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <Examples />
        <Process />
        <Pricing />
        <Articles />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
