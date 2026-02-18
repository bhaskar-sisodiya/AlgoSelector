// src/pages/LandingPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaDatabase, FaGithub } from "react-icons/fa";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ScrollSection from "../components/layout/ScrollSection";

const LandingPage = ({ onNavigateToAuth }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
    >
      <Navbar onLoginClick={onNavigateToAuth} />

      {/* Hero Section */}
      <ScrollSection
        id="section-hero"
        nextSectionId="section-how"
        bgImage="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2560&auto=format&fit=crop"
        showArrow={true}
      >
        <div className="text-center max-w-5xl mx-auto">
          <div className="badge badge-primary badge-outline mb-4 text-white border-white/50">
            v2.0 Now Live
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 text-white drop-shadow-2xl tracking-tight">
            Predict. Select.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Explain.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            Stop guessing. Our engine selects the optimal algorithm by analyzing your dataset's <strong className="text-white font-bold">statistical meta-features</strong>, not by processing raw data.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {/* Launch AutoML */}
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToAuth}
              className="relative group px-8 py-4 rounded-2xl 
                bg-gradient-to-r from-primary to-secondary 
                text-white font-bold text-lg
                shadow-lg shadow-primary/30
                overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-3">
                <FaRobot className="text-xl" />
                Launch AutoML
              </span>

              {/* Glow Effect */}
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300 blur-xl" />
            </motion.button>

            {/* View Code */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl 
                border border-white/30 
                backdrop-blur-md
                text-white font-semibold text-lg
                hover:bg-white hover:text-black
                transition-all duration-300 flex items-center gap-3"
            >
              <FaGithub className="text-xl" />
              View Code
            </motion.button>
          </div>
        </div>
      </ScrollSection>

      {/* How It Works Section */}
      <ScrollSection
        id="section-how"
        nextSectionId="section-explain"
        bgImage="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop"
      >
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-white/80 text-lg">
            From meta-features to model selection.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaDatabase,
              title: "1. Upload",
              desc: "Upload CSV. We extract meta-features (Skewness, Kurtosis, Entropy) only.",
            },
            {
              icon: FaBrain,
              title: "2. Meta-Predict",
              desc: "Our model maps these meta-features to historical algorithm performance.", 
            },
            {
              icon: FaRobot,
              title: "3. Recommend",
              desc: "Receive the best performing algorithm predicted for your specific data profile.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="card glass text-white p-8 hover:-translate-y-2 transition-transform duration-300 border border-white/20 bg-white/5"
            >
              <div className="text-4xl mb-4 text-primary bg-black/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner border border-white/10">
                <item.icon />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">
                {item.title}
              </h3>
              <p className="text-white/80 font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* Explainability Section */}
      <ScrollSection
        id="section-explain"
        nextSectionId="section-footer"
        bgImage="https://images.unsplash.com/photo-1509023464722-18d99632736b?q=80&w=2560&auto=format&fit=crop"
        align="left"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Transparent Decisions.
            </h2>
            <p className="text-xl text-white/90 mb-6 leading-relaxed font-light drop-shadow-md">
              We don't just give you a model; we tell you <em>why</em>. Our system uses 
              <span className="font-bold text-primary"> Rule-Based Logic</span> derived 
              from your dataset's <span className="text-white font-bold">meta-features</span> (like sparsity & class imbalance) to explain 
              algorithm selection.
            </p>
            <p className="text-lg text-white/80 mb-6 leading-relaxed drop-shadow-sm">
              Need deeper insights? Our <span className="text-secondary font-bold">AI Assistant</span> breaks down the relationship between data properties and model choice.
            </p>
            
            <div className="mt-8 flex gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 backdrop-blur-md">
                     <FaBrain />
                  </div>
                  <span className="text-white/80 font-semibold drop-shadow-md">Meta-Feature Extraction</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 backdrop-blur-md">
                     <FaRobot />
                  </div>
                  <span className="text-white/80 font-semibold drop-shadow-md">Performance Prediction</span>
               </div>
            </div>
          </div>
          
          {/* Rule-Based Visualization (Decision Tree) */}
          <div className="relative">
             <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                
                {/* Glow effects */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col items-center gap-4 relative z-10">
                  
                  {/* Root Node: Meta-Feature 1 */}
                  <div className="px-6 py-3 bg-gray-900/80 rounded-lg border border-white/20 text-white font-mono text-sm shadow-lg">
                    Meta-Feature: Class Imbalance &gt; 0.5?
                  </div>
                  
                  {/* Arrow */}
                  <div className="h-8 w-px bg-white/20"></div>
                  
                  {/* Branch */}
                  <div className="grid grid-cols-2 gap-8 w-full">
                     {/* Left Branch (YES) */}
                     <div className="flex flex-col items-center">
                        <div className="w-full h-px bg-white/20 mb-2 relative">
                           <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-2 rounded-full text-xs text-green-400 border border-green-400/30">Yes</span>
                        </div>
                        <div className="px-4 py-2 bg-gray-900/80 rounded-lg border border-white/20 text-white font-mono text-xs text-center shadow-lg">
                           High Dimensionality?
                        </div>
                        <div className="h-4 w-px bg-white/20 mt-2"></div>
                        <div className="px-4 py-2 bg-primary/20 border border-primary/50 text-primary-content rounded-lg font-bold text-sm mt-2 shadow-[0_0_15px_rgba(87,13,248,0.3)]">
                           XGBoost
                        </div>
                     </div>
                     
                     {/* Right Branch (NO) */}
                     <div className="flex flex-col items-center">
                        <div className="w-full h-px bg-white/20 mb-2 relative">
                           <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-2 rounded-full text-xs text-red-400 border border-red-400/30">No</span>
                        </div>
                        <div className="px-4 py-2 bg-gray-900/80 rounded-lg border border-white/20 text-white font-mono text-xs text-center shadow-lg">
                           Linearly Separable?
                        </div>
                        <div className="h-4 w-px bg-white/20 mt-2"></div>
                        <div className="px-4 py-2 bg-secondary/20 border border-secondary/50 text-secondary-content rounded-lg font-bold text-sm mt-2 shadow-[0_0_15px_rgba(240,0,184,0.3)]">
                           SVM
                        </div>
                     </div>
                  </div>
                  
                </div>
                
                {/* AI Insight Overlay */}
                <div className="mt-8 bg-black/50 rounded-xl p-4 border border-white/10 flex gap-3 relative z-10">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                      <FaRobot className="text-white" />
                   </div>
                   <div>
                      <p className="text-xs text-gray-300 mb-1 font-bold uppercase tracking-wider">Meta-Learner Insight</p>
                      <p className="text-sm text-white italic leading-relaxed">
                         "Based on the meta-features (high skewness and sparsity), Tree-Based Ensembles are predicted to yield 98% accuracy."
                      </p>
                   </div>
                </div>

             </div>
          </div>
        </div>
      </ScrollSection>

      {/* Footer Section */}
      <section
        id="section-footer"
        className="h-screen w-full snap-start relative flex flex-col justify-end overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4"
        >
          <h2 className="text-5xl font-bold mb-6 text-white drop-shadow-xl">
            Ready to optimize?
          </h2>
          <button
            onClick={onNavigateToAuth}
            className="btn btn-wide btn-primary btn-lg text-white border-none shadow-xl hover:scale-105 transition-transform font-bold"
          >
            Get Started Free
          </button>
        </motion.div>
        <div className="relative z-10 w-full">
          <Footer />
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;