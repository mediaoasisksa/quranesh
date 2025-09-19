import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Goal from "@/components/Goal";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Goal />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
