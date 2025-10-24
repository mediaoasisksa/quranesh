import { useLanguage } from "@/contexts/language-context";

const Goal = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      {/* Modern Wave Divider */}
      <div className="w-full overflow-hidden leading-none -mt-20">
        <svg 
          className="relative block w-full h-20" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#F6EFE2"
            fillOpacity="0.8"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-6">
        {/* Our Goal Section */}
        <div className="mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
            {/* Lottie Animation */}
            <div className="flex-shrink-0">
              <dotlottie-wc 
                src="https://lottie.host/c3f1a249-d896-4a7d-a489-6d7854a71176/fb22AVs3qo.lottie" 
                style={{width: '200px', height: '200px'}} 
                speed="1" 
                autoplay 
                loop
              ></dotlottie-wc>
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('ourGoal')}
              </h2>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 md:p-12 border border-primary/10 shadow-lg">
              <p className="text-lg md:text-xl text-foreground leading-relaxed text-center">
                {t('ourGoalDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Goal;
