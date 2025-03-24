import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  BarChart3,
  Coins,
  Clock,
  Globe,
} from "lucide-react";

interface MarketStatsProps {
  cryptoName?: string;
  cryptoSymbol?: string;
  currentPrice?: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  allTimeHigh?: number;
  allTimeLow?: number;
  lastUpdated?: string;
}

const MarketStats: React.FC<MarketStatsProps> = ({
  cryptoName = "Bitcoin",
  cryptoSymbol = "BTC",
  currentPrice = 48235.67,
  priceChange24h = 2.34,
  marketCap = 923456789012,
  volume24h = 28765432109,
  circulatingSupply = 19234567,
  totalSupply = 21000000,
  allTimeHigh = 69000,
  allTimeLow = 3000,
  lastUpdated = "2023-06-15T14:30:00Z",
}) => {
  const formatNumber = (num: number, isCurrency = false) => {
    if (num >= 1e9) {
      return `${isCurrency ? "$" : ""}${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${isCurrency ? "$" : ""}${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `${isCurrency ? "$" : ""}${(num / 1e3).toFixed(2)}K`;
    }
    return `${isCurrency ? "$" : ""}${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="w-full h-full bg-gray-900 border-gray-800 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>
            {cryptoName} ({cryptoSymbol}) Stats
          </span>
          <span className="text-2xl font-bold">
            ${currentPrice.toLocaleString()}
          </span>
        </CardTitle>
        <div className="flex items-center">
          <span
            className={`flex items-center ${priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {priceChange24h >= 0 ? (
              <ArrowUp className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDown className="h-4 w-4 mr-1" />
            )}
            {Math.abs(priceChange24h)}%
          </span>
          <span className="text-gray-400 ml-2">(24h)</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon={<DollarSign className="h-4 w-4" />}
              label="Market Cap"
              value={formatNumber(marketCap, true)}
            />
            <StatItem
              icon={<BarChart3 className="h-4 w-4" />}
              label="24h Volume"
              value={formatNumber(volume24h, true)}
            />
          </div>

          <Separator className="bg-gray-800" />

          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon={<Coins className="h-4 w-4" />}
              label="Circulating Supply"
              value={`${formatNumber(circulatingSupply)} ${cryptoSymbol}`}
            />
            <StatItem
              icon={<Coins className="h-4 w-4" />}
              label="Total Supply"
              value={`${formatNumber(totalSupply)} ${cryptoSymbol}`}
            />
          </div>

          <Separator className="bg-gray-800" />

          <div className="grid grid-cols-2 gap-4">
            <StatItem
              icon={<ArrowUp className="h-4 w-4 text-green-500" />}
              label="All Time High"
              value={`$${allTimeHigh.toLocaleString()}`}
            />
            <StatItem
              icon={<ArrowDown className="h-4 w-4 text-red-500" />}
              label="All Time Low"
              value={`$${allTimeLow.toLocaleString()}`}
            />
          </div>

          <Separator className="bg-gray-800" />

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last Updated</span>
            </div>
            <span>{formatDate(lastUpdated)}</span>
          </div>

          <div className="mt-4 pt-2 border-t border-gray-800">
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
              <Globe className="h-4 w-4 inline mr-2" />
              View More Details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center text-gray-400 mb-1">
        {icon}
        <span className="ml-1 text-sm">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

export default MarketStats;
