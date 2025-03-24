import React, { useState } from "react";
import ChartControls from "./ChartControls";
import PriceChart from "./PriceChart";
import { Card } from "./ui/card";

interface ChartSectionProps {
  selectedCurrency?: string;
  data?: any[];
  isLoading?: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  selectedCurrency = "Bitcoin (BTC)",
  data = [],
  isLoading = false,
}) => {
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "1Y">("1D");
  const [chartType, setChartType] = useState<"line" | "candlestick">("line");

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range as "1D" | "1W" | "1M" | "1Y");
  };

  const handleChartTypeChange = (type: "line" | "candlestick") => {
    setChartType(type);
  };

  return (
    <div className="w-full h-full bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
      <div className="flex flex-col h-full">
        <ChartControls
          selectedTimeRange={timeRange}
          selectedChartType={chartType}
          onTimeRangeChange={handleTimeRangeChange}
          onChartTypeChange={handleChartTypeChange}
        />
        <div className="flex-grow p-4">
          <PriceChart
            currency={selectedCurrency}
            chartType={chartType}
            timeframe={timeRange}
            isLoading={isLoading}
            data={data}
            onTimeframeChange={handleTimeRangeChange}
            onChartTypeChange={handleChartTypeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
