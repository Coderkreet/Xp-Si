import React from "react";

const features = [
    {
        title: "DeFi Integration",
        para: "ZCOIN seamlessly integrates with decentralized finance platforms, enabling users to:",
        points: [
            "Stake and earn rewards",
            "Provide liquidity",
            "Participate in yield farming",
            "Access decentralized lending and borrowing protocols",
        ],
    },
    {
        title: "Play-to-Earn (P2E) Gaming",
        para: "ZCOIN powers a Play-to-Earn ecosystem where users can earn tokens by:",
        points: [
            "Playing blockchain-based games",
            "Winning in-game challenges",
            "Trading digital items and NFTs",
        ],
    },
    {
        title: "NFT & Metaverse Integration",
        para: "ZCOIN supports the minting, trading, and owning of NFTs, and is integrated with Metaverseenvironments:",
        points: [
            "Buy/sell virtual land, skins, and items",
            "Own avatars or collectibles",
            "Use ZCOIN as the native currency within metaverse platforms",
        ],
    },
    {
        title: "Governance (DAO-Based)",
        para:
            "ZCOIN is governed by its community through a DAO (Decentralized Autonomous Organization):"
        , points: [
            "Token holders can vote on proposals",
            "Decide project upgrades, partnerships, token burns, etc.",
            "Ensures a truly democratic ecosystem",
        ],
    },
    {
        title: "Real-World Asset (RWA) Tokenization",
        para: "ZCOIN bridges the gap between digital and physical assets by allowing tokenization of:",
        points: [
            "Real estate",
            "Commodities",
            "Collectibles",
        ],
    },
    {
        title: "Fast & Low-Cost Transactions",
        para: "ZCOIN is optimized for speed and efficiency:",
        points: [
            "Lightning-fast transaction speeds",
            "Negligible gas fees",
            "Scalable architecture that supports mass adoption",
        ],
    },
    {
        title: "Cross-Chain Compatibility",
        para: "ZCOIN supports multi-chain deployment and is compatible with leading blockchains like:",
        points: [
            "Ethereum",
            "BNB Chain",
            "Polygon",
        ],
    },
    {
        title: "Staking & Passive Income",
        para: "Users can stake ZCOIN to:",

        points: [
            "Earn passive income",
            "Participate in reward pools",
            "Support network security",
            "The longer you stake, the higher your rewards",
        ],
    },
    {
        title: "Community-Centric Ecosystem",
        para: "ZCOIN prioritizes community development through:",
        points: [
            "Airdrops",
            "Referral & reward campaigns",
            "DAO-based project decision-making",
        ],
    },
    {
        title: "Token Utility",
        para: "ZCOIN is designed with multiple real-world use cases:",
        points: [
            "In-game purchases",
            "NFT marketplace currency",
            "DeFi platform rewards",
            "Governance rights",
            "Metaverse commerce",
            "Cross-border payments"
        ],
    },
    {
        title: "Security & Smart Contract Audits",
        para: "All smart contracts powering ZCOIN are audited by top security firms, ensuring:",
        points: [
            "Zero backdoors",
            "Protection against exploits",
            "Institutional-grade trust",
        ],
    },
    {
        title: "Web3 Wallet Integration",
        para: "ZCOIN supports integration with popular wallets like:",
        points: [
            "MetaMask",
            "Trust Wallet",
            "WalletConnect",
        ],
    },
];

const DecentralizedInfrastructure = () => {
    return (
        <section className="bg-[#151515] relative text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-sm font-semibold tracking-wider uppercase">
                            Explore The ZCOIN Future
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                        Decentralized Infrastructure
                    </h2>
                    <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                        ZCOIN operates on a fully decentralized blockchain network, removing the need for central
                        authorities. This ensures complete transparency, trustless transactions, and peer-to-peer control
                        over assets.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-[#1e1e1e] border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 ease-in-out"
                        >

                            <h3 className="text-xl font-semibold mb-4 text-[#31a2f3]">{feature.title}</h3>
                            <p className="text-sm mb-4">{feature.para}</p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
                                {feature.points.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default DecentralizedInfrastructure;
