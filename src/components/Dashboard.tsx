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

interface DashboardProps {
  initialCurrency?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  initialCurrency = "Bitcoin",
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

  // Mock chart data
  const generateMockChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(now.getHours() - 24 + i);

      const basePrice = selectedCrypto.price * 0.95;
      const randomFactor = 1 + Math.random() * 0.1;
      const price = basePrice * randomFactor;

      data.push({
        time: time.toISOString(),
        price: price,
        open: price * 0.99,
        close: price * 1.01,
        high: price * 1.02,
        low: price * 0.98,
        volume: (Math.random() * selectedCrypto.volume24h) / 24,
      });
    }
    return data;
  };

  const mockChartData = generateMockChartData();

  const handleSelectCrypto = (crypto: Cryptocurrency) => {
    setSelectedCrypto(crypto);
  };

  const handleToggleFavorite = (id: string) => {
    // In a real app, this would update the state or call an API
    console.log(`Toggled favorite for crypto with id: ${id}`);
  };

  return (
    <div className="w-full h-full bg-gray-950 text-white p-4 overflow-auto">
      <div className="container mx-auto space-y-6">
        {/* Main content area with chart and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart section - takes up 2/3 of the width on large screens */}
          <div className="lg:col-span-2">
            <ChartSection
              selectedCurrency={`${selectedCrypto.name} (${selectedCrypto.symbol})`}
              data={mockChartData}
              isLoading={false}
            />
          </div>

          {/* Market stats section - takes up 1/3 of the width on large screens */}
          <div>
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

        {/* Cryptocurrency list section */}
        <div className="mt-6">
          <CryptoList
            onSelectCrypto={handleSelectCrypto}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
