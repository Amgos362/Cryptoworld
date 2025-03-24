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
import { Info } from "lucide-react";

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

const PriceChart: React.FC<PriceChartProps> = ({
  data,
  currency = "Bitcoin (BTC)",
  chartType = "line",
  timeframe = "1D",
  isLoading = false,
  onChartTypeChange,
  onTimeframeChange,
}) => {
  const [chartData, setChartData] = useState<PricePoint[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<{
    value: number;
    percentage: number;
  }>({ value: 0, percentage: 0 });

  useEffect(() => {
    // Use provided data or generate mock data
    const newData = data || generateMockData(timeframe, chartType);
    setChartData(newData);

    if (newData.length > 0) {
      const latest = newData[newData.length - 1].price;
      const earliest = newData[0].price;
      setCurrentPrice(latest);
      const changeValue = latest - earliest;
      const changePercentage = (changeValue / earliest) * 100;
      setPriceChange({ value: changeValue, percentage: changePercentage });
    }
  }, [data, timeframe, chartType]);

  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-[400px] rounded-lg" />;
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[400px]">
          No data available
        </div>
      );
    }

    // Calculate chart dimensions
    const width = 100;
    const height = 400;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Find min and max values for scaling
    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices) * 0.99;
    const maxPrice = Math.max(...prices) * 1.01;

    // This is a placeholder for the actual chart rendering
    // In a real implementation, you would use a charting library like recharts, d3, or chart.js
    return (
      <div className="relative w-full h-[400px] bg-gray-900 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <p className="text-sm">
            Chart visualization would be rendered here using a library like
            recharts
          </p>
        </div>

        {/* Sample visualization to show the concept */}
        <div className="absolute inset-0 flex items-end">
          {chartData.map((point, index) => {
            const height =
              ((point.price - minPrice) / (maxPrice - minPrice)) * 70;
            const isPositive =
              index > 0 ? point.price >= chartData[index - 1].price : true;

            return (
              <div
                key={index}
                className="flex-1 flex items-end justify-center hover:bg-gray-800/20 group"
                onMouseEnter={() => setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div
                  className={`w-[80%] ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                  style={{ height: `${height}%`, minHeight: "1px" }}
                ></div>

                {hoveredPoint === point && (
                  <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs p-2 rounded pointer-events-none">
                    <p>
                      Price: $
                      {point.price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p>
                      Time: {new Date(point.timestamp).toLocaleTimeString()}
                    </p>
                    {chartType === "candlestick" && point.open && (
                      <>
                        <p>
                          Open: $
                          {point.open.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>
                          High: $
                          {point.high?.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>
                          Low: $
                          {point.low?.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p>
                          Close: $
                          {point.close?.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
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
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

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
