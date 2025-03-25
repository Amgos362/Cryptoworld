import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface PricePoint {
  timestamp: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

interface PriceChartProps {
  data?: PricePoint[];
  currency?: string;
  chartType?: "line" | "candlestick";
  timeframe?: "1D" | "1W" | "1M" | "1Y";
  isLoading?: boolean;
  onChartTypeChange?: (type: "line" | "candlestick") => void;
  onTimeframeChange?: (timeframe: "1D" | "1W" | "1M" | "1Y") => void;
}

const generateMockData = (
  timeframe: "1D" | "1W" | "1M" | "1Y",
  chartType: "line" | "candlestick",
): PricePoint[] => {
  const now = new Date();
  const data: PricePoint[] = [];
  let points = 24;
  let startPrice = 45000 + Math.random() * 5000;
  let timeIncrement = 60 * 60 * 1000; // 1 hour in milliseconds

  switch (timeframe) {
    case "1W":
      points = 7 * 24;
      timeIncrement = 60 * 60 * 1000; // 1 hour
      break;
    case "1M":
      points = 30;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "1Y":
      points = 365;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
    default: // 1D
      points = 24;
      timeIncrement = 60 * 60 * 1000; // 1 hour
  }

  for (let i = 0; i < points; i++) {
    const timestamp = now.getTime() - (points - i) * timeIncrement;
    const volatility =
      timeframe === "1D"
        ? 100
        : timeframe === "1W"
          ? 300
          : timeframe === "1M"
            ? 800
            : 2000;
    const change = (Math.random() - 0.5) * volatility;

    if (chartType === "line") {
      startPrice += change;
      data.push({
        timestamp,
        price: startPrice,
      });
    } else {
      const open = startPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 200;
      const low = Math.min(open, close) - Math.random() * 200;
      const volume = Math.random() * 1000 + 500;

      data.push({
        timestamp,
        price: close,
        open,
        high,
        low,
        close,
        volume,
      });

      startPrice = close;
    }
  }

  return data;
};

const formatChartData = (data: PricePoint[]) => {
  return data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date(point.timestamp).toLocaleDateString(),
    price: point.price,
    open: point.open,
    high: point.high,
    low: point.low,
    close: point.close,
    volume: point.volume,
  }));
};

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  currency = "Bitcoin (BTC)",
  chartType = "line",
  timeframe = "1D",
  isLoading: initialLoading = false,
  onChartTypeChange,
  onTimeframeChange,
}) => {
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [formattedData, setFormattedData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<{
    value: number;
    percentage: number;
  }>({ value: 0, percentage: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Generate mock data if no data is provided
    const mockData = data || generateMockData(timeframe, chartType);
    setChartData(mockData);
    setFormattedData(formatChartData(mockData));
    setIsLiveData(false);
    setIsLoading(false);

    if (mockData.length > 0) {
      const latest = mockData[mockData.length - 1].price;
      const earliest = mockData[0].price;
      setCurrentPrice(latest);
      const changeValue = latest - earliest;
      const changePercentage = (changeValue / earliest) * 100;
      setPriceChange({ value: changeValue, percentage: changePercentage });
    }
  }, [data, currency, timeframe, chartType]);

  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-[400px] rounded-lg" />;
    }

    if (formattedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px] bg-gray-900">
          No data available
        </div>
      );
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey={timeframe === "1D" ? "time" : "date"}
              tick={{ fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#9ca3af" }}
              axisLine={{ stroke: "#4b5563" }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderColor: "#4b5563",
                color: "#f9fafb",
              }}
              formatter={(value: any) => [
                `$${value.toLocaleString()}`,
                "Price",
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      // Candlestick chart
      return (
        <ResponsiveContainer width="100%" height={400}>
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <ResponsiveContainer width="100%" height="70%">
                <LineChart
                  data={formattedData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey={timeframe === "1D" ? "time" : "date"}
                    tick={{ fill: "#9ca3af" }}
                    axisLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    tick={{ fill: "#9ca3af" }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#4b5563",
                      color: "#f9fafb",
                    }}
                    formatter={(value: any) => [
                      `$${value.toLocaleString()}`,
                      "Price",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#10b981"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#ef4444"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[30%]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis
                    dataKey={timeframe === "1D" ? "time" : "date"}
                    tick={{ fill: "#9ca3af" }}
                    axisLine={{ stroke: "#4b5563" }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af" }}
                    axisLine={{ stroke: "#4b5563" }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#4b5563",
                      color: "#f9fafb",
                    }}
                    formatter={(value: any) => [
                      value.toLocaleString(),
                      "Volume",
                    ]}
                  />
                  <Bar dataKey="volume" fill="#6366f1" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card className="w-full h-full bg-gray-950 border-gray-800 p-4 overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">{currency}</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                $
                {currentPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-sm font-medium ${priceChange.percentage >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {priceChange.percentage >= 0 ? "+" : ""}
                {priceChange.percentage.toFixed(2)}%
              </span>
              {isLiveData && (
                <span className="text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                  LIVE
                </span>
              )}
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-white">
                  <Info size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-sm">
                  Price data for {currency} over {timeframe} timeframe
                  {isLiveData ? " (live data)" : " (simulated data)"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {error && (
          <div className="mb-2 px-3 py-2 bg-red-900/20 border border-red-800 rounded text-red-400 text-xs flex items-center">
            <AlertCircle size={14} className="mr-2" />
            {error}
          </div>
        )}

        <div className="flex-grow">{renderChart()}</div>

        <div className="mt-4">
          <Tabs
            defaultValue={timeframe}
            onValueChange={(value) => onTimeframeChange?.(value as any)}
          >
            <TabsList className="grid grid-cols-4 w-full bg-gray-900">
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;
