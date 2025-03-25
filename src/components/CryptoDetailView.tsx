import React, { useState } from "react";
import ChartSection from "./ChartSection";
import MarketStats from "./MarketStats";
import CryptoList from "./CryptoList";

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  favorite: boolean;
}

interface CryptoDetailViewProps {
  selectedCurrency?: string;
  chartData?: any[];
  isLoading?: boolean;
}

const CryptoDetailView: React.FC<CryptoDetailViewProps> = ({
  selectedCurrency = "Bitcoin",
  chartData = [],
  isLoading = false,
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency>({
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 51342.67,
    change24h: 2.34,
    marketCap: 1000324567890,
    volume24h: 32456789012,
    favorite: true,
  });

  const [favorites, setFavorites] = useState<string[]>(["1", "4"]);

  const handleSelectCrypto = (crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  return (
    <div className="w-full h-full bg-gray-950 text-white p-4 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Main Chart Section - Takes up 2/3 of the space on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <img
                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${selectedCrypto.symbol}`}
                alt={selectedCrypto.name}
                className="w-8 h-8 mr-2 rounded-full"
              />
              {selectedCrypto.name} ({selectedCrypto.symbol})
              <span
                className={`ml-4 text-lg ${selectedCrypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                ${selectedCrypto.price.toLocaleString()}(
                {selectedCrypto.change24h > 0 ? "+" : ""}
                {selectedCrypto.change24h}%)
              </span>
            </h2>
            <ChartSection
              selectedCurrency={`${selectedCrypto.name} (${selectedCrypto.symbol})`}
              data={chartData}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Market Statistics</h2>
            <MarketStats
              cryptoName={selectedCrypto.name}
              cryptoSymbol={selectedCrypto.symbol}
              currentPrice={selectedCrypto.price}
              priceChange24h={selectedCrypto.change24h}
              marketCap={selectedCrypto.marketCap}
              volume24h={selectedCrypto.volume24h}
              circulatingSupply={19234567}
              totalSupply={21000000}
              allTimeHigh={69000}
              allTimeLow={3000}
              lastUpdated={new Date().toISOString()}
            />
          </div>
        </div>

        {/* Right Sidebar - Takes up 1/3 of the space on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 h-full">
            <h2 className="text-xl font-bold mb-4">Top Cryptocurrencies</h2>
            <CryptoList
              onSelectCrypto={handleSelectCrypto}
              onToggleFavorite={handleToggleFavorite}
              cryptos={[
                {
                  id: "1",
                  name: "Bitcoin",
                  symbol: "BTC",
                  price: 51342.67,
                  change24h: 2.34,
                  marketCap: 1000324567890,
                  volume24h: 32456789012,
                  favorite: favorites.includes("1"),
                },
                {
                  id: "2",
                  name: "Ethereum",
                  symbol: "ETH",
                  price: 2786.43,
                  change24h: 1.56,
                  marketCap: 334567890123,
                  volume24h: 18765432109,
                  favorite: favorites.includes("2"),
                },
                {
                  id: "3",
                  name: "Binance Coin",
                  symbol: "BNB",
                  price: 456.78,
                  change24h: -0.87,
                  marketCap: 76543210987,
                  volume24h: 5432109876,
                  favorite: favorites.includes("3"),
                },
                {
                  id: "4",
                  name: "Solana",
                  symbol: "SOL",
                  price: 123.45,
                  change24h: 5.67,
                  marketCap: 45678901234,
                  volume24h: 3456789012,
                  favorite: favorites.includes("4"),
                },
                {
                  id: "5",
                  name: "Cardano",
                  symbol: "ADA",
                  price: 0.56,
                  change24h: -2.34,
                  marketCap: 19876543210,
                  volume24h: 1234567890,
                  favorite: favorites.includes("5"),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetailView;
