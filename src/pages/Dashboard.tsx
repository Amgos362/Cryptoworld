import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import PriceTicker from "../components/PriceTicker";
import SearchFilter from "../components/SearchFilter";
import CryptoDetailView from "../components/CryptoDetailView";

interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const Dashboard: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("Bitcoin");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<any>({});

  // Generate mock chart data on component mount
  useEffect(() => {
    generateMockChartData();
  }, [selectedCurrency]);

  const generateMockChartData = () => {
    setIsLoading(true);

    // Generate 30 days of mock data
    const mockData: ChartDataPoint[] = [];
    const basePrice = Math.random() * 50000 + 10000; // Random starting price between 10k and 60k

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const volatility = 0.03; // 3% daily volatility
      const dayChange = basePrice * volatility * (Math.random() - 0.5);
      const price = basePrice + dayChange * (30 - i);

      const open = price - Math.random() * price * 0.02;
      const close = price + Math.random() * price * 0.02;
      const high = Math.max(open, close) + Math.random() * price * 0.01;
      const low = Math.min(open, close) - Math.random() * price * 0.01;
      const volume = Math.random() * 10000000000;

      mockData.push({
        date: date.toISOString().split("T")[0],
        price,
        volume,
        open,
        high,
        low,
        close,
      });
    }

    setTimeout(() => {
      setChartData(mockData);
      setIsLoading(false);
    }, 800); // Simulate loading delay
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // In a real app, this would filter cryptocurrencies based on the search term
    console.log(`Searching for: ${term}`);
  };

  const handleFilter = (filters: any) => {
    setActiveFilters(filters);
    // In a real app, this would apply filters to the cryptocurrency list
    console.log("Applied filters:", filters);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Header />
      <main className="flex-grow flex flex-col">
        <PriceTicker />
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        <CryptoDetailView
          selectedCurrency={selectedCurrency}
          chartData={chartData}
          isLoading={isLoading}
        />
      </main>
      <footer className="bg-black text-gray-400 text-sm p-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>© 2023 CryptoTrack. All rights reserved.</p>
              <p className="mt-1">
                Cryptocurrency data provided for informational purposes only.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
