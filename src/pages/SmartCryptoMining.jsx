import React from "react";
import bgimg from "../assets/home/bgbitcoins.png";
// import { preStorixCardData } from "../../utils/constant";
import { HiHandThumbUp } from "react-icons/hi2";
import { AuthRoutes } from "../context/Routes";
import { Link } from "react-router-dom";
import hand from "../assets//home/hand1.png"
import thumb from "../assets/home/thumps2.png"
import reward from "../assets/home/reward.png"
import dollar from "../assets/home/dollar.png"


export const preStorixCardData = [
  {
    img: hand,
    title: "Zero Reward Denials.",
    desc: "Trade with a peace of mind and get more ",
  },
  {
    img: thumb,
    title: "Your Favorite Platforms.",
    desc: "MetaTrader 5, Match‑Trader and cTrader.",
  },
  {
    img: reward,
    title: "Flexible Reward Cycles.",
    desc: "The choice is yours: weekly or monthly.",
  },
  {
    img: dollar,
    title: "We Grow Together.",
    desc: "Trade up to $300.000 in simulated capital.",
  },
];

const SmartCryptoMining = () => {
  return (
    <div>
      <div className="w-full mt-5 h-full mb-5 relative overflow-hidden">
        <div 
          className="absolute inset-0  bg-no-repeat transition-transform duration-[300ms] ease-in-out hover:translate-x-4"
          style={{ 
            backgroundImage: `url(${bgimg})`,
            transform: 'translateX(0)',
            animation: 'slideRight 8s ease-in-out infinite alternate'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center px-4">
          <div className="bg-black/70 p-6 md:p-12 lg:p-20 rounded-xl text-white max-w-6xl w-full backdrop-blur-sm">
            <h1 className="text-[2.4rem] font-extrabold text-center lg:text-left">
              Smart CRYPTO Mining
            </h1>

            <h2 className="mt-6 text-[1.5rem] bg-sky-400 px-4 py-3 rounded-xl text-center font-semibold shadow-lg">
              Plans starting at just $100 – Begin your crypto journey today!
            </h2>

            <p className="mt-6 text-[1.2rem] leading-relaxed text-center lg:text-left">
              Join the future of digital finance with XPFI-Coin reliable and
              transparent mining solutions. Our plans are designed for both
              beginners and seasoned investors looking to earn steady passive
              income through cryptocurrency mining.
            </p>

            <ul className="mt-10 space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl">
              {[
                "Real-Time Dashboard : Monitor your mining performance 24/7",
                "Secure & Scalable : Scale up your plan anytime based on performance",
                "Fully Managed Service : No hardware, no hassle – we handle everything for you",
                "Guaranteed Uptime : 99.9% Server Availability",
                "Estimated Monthly Returns : 30%-35%",
                "Minimum Investment : $100",
                "Plan Duration : 6 months",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <HiHandThumbUp className="text-sky-400 mt-1 text-2xl" />
                  <span dangerouslySetInnerHTML={{ __html: item.replace(/: (.*)/, ': <span class="text-sky-300 font-semibold">$1</span>') }} />
                </li>
              ))}
            </ul>

            
            <div className="mt-10 text-center lg:text-right">
              <Link to={AuthRoutes.LOGIN}>
                <button className="text-[1.5rem] border border-white font-semibold px-[2rem] py-[1rem] bg-black text-white rounded-full shadow-lg hover:bg-white hover:text-black transition duration-300">
                  Start Mining Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
{/* 
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12">
            Why Pretorix?
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {preStorixCardData.map((card, id) => (
              <div
                key={id}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="h-12 w-12 object-contain mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm sm:text-base text-sky-200">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Add the animation keyframes */}
      <style>
        {`
          @keyframes slideRight {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(20px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SmartCryptoMining;
