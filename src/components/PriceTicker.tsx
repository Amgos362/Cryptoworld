import React, { useState, useEffect } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
}

const PriceTicker: React.FC = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 65432.1,
      priceChange24h: 1250.75,
      priceChangePercentage24h: 1.95,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3521.45,
      priceChange24h: -85.32,
      priceChangePercentage24h: -2.37,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 142.87,
      priceChange24h: 7.65,
      priceChangePercentage24h: 5.66,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.45,
      priceChange24h: 0.02,
      priceChangePercentage24h: 4.65,
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.52,
      priceChange24h: -0.03,
      priceChangePercentage24h: -5.45,
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 6.78,
      priceChange24h: 0.34,
      priceChangePercentage24h: 5.28,
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.12,
      priceChange24h: -0.01,
      priceChangePercentage24h: -7.69,
    },
  ]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptocurrencies((prevCurrencies) =>
        prevCurrencies.map((crypto) => {
          const randomChange =
            (Math.random() - 0.5) * 2 * (crypto.price * 0.005);
          const newPrice = crypto.price + randomChange;
          const percentageChange = (randomChange / crypto.price) * 100;

          return {
            ...crypto,
            price: newPrice,
            priceChange24h: crypto.priceChange24h + randomChange / 10,
            priceChangePercentage24h:
              crypto.priceChangePercentage24h + percentageChange / 10,
          };
        }),
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-gray-900 border-b border-gray-800 overflow-hidden"
      style={{ backgroundColor: "#121212" }}
    >
      <div className="flex items-center overflow-x-auto whitespace-nowrap py-3 px-4 animate-scroll">
        {cryptocurrencies.map((crypto) => (
          <div key={crypto.id} className="flex items-center mr-8 last:mr-0">
            <div className="flex flex-col mr-3">
              <span className="text-white font-medium">{crypto.symbol}</span>
              <span className="text-gray-400 text-xs">{crypto.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-medium">
                $
                {crypto.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`flex items-center text-xs ${crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {crypto.priceChangePercentage24h >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}

        {/* Duplicate the items for continuous scrolling effect */}
        {cryptocurrencies.map((crypto) => (
          <div
            key={`${crypto.id}-dup`}
            className="flex items-center mr-8 last:mr-0"
          >
            <div className="flex flex-col mr-3">
              <span className="text-white font-medium">{crypto.symbol}</span>
              <span className="text-gray-400 text-xs">{crypto.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white font-medium">
                $
                {crypto.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`flex items-center text-xs ${crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {crypto.priceChangePercentage24h >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(crypto.priceChangePercentage24h).toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
