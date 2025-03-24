import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Toggle } from "./ui/toggle";
import { LineChart, CandlestickChart } from "lucide-react";

interface ChartControlsProps {
  onTimeRangeChange?: (range: string) => void;
  onChartTypeChange?: (type: "line" | "candlestick") => void;
  selectedTimeRange?: string;
  selectedChartType?: "line" | "candlestick";
}

const ChartControls: React.FC<ChartControlsProps> = ({
  onTimeRangeChange = () => {},
  onChartTypeChange = () => {},
  selectedTimeRange = "1D",
  selectedChartType = "line",
}) => {
  const [timeRange, setTimeRange] = useState<string>(selectedTimeRange);
  const [chartType, setChartType] = useState<"line" | "candlestick">(
    selectedChartType,
  );

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    onTimeRangeChange(value);
  };

  const handleChartTypeChange = (value: "line" | "candlestick") => {
    setChartType(value);
    onChartTypeChange(value);
  };

  return (
    <div className="flex justify-between items-center w-full p-4 bg-gray-900 rounded-t-lg border-b border-gray-800">
      <Tabs
        defaultValue={timeRange}
        onValueChange={handleTimeRangeChange}
        className="w-auto"
      >
        <TabsList className="bg-gray-800">
          <TabsTrigger value="1D" className="data-[state=active]:bg-gray-700">
            1D
          </TabsTrigger>
          <TabsTrigger value="1W" className="data-[state=active]:bg-gray-700">
            1W
          </TabsTrigger>
          <TabsTrigger value="1M" className="data-[state=active]:bg-gray-700">
            1M
          </TabsTrigger>
          <TabsTrigger value="1Y" className="data-[state=active]:bg-gray-700">
            1Y
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex space-x-2">
        <Toggle
          pressed={chartType === "line"}
          onPressedChange={() => handleChartTypeChange("line")}
          aria-label="Toggle line chart"
          className={`${chartType === "line" ? "bg-gray-700" : ""}`}
        >
          <LineChart className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Line</span>
        </Toggle>
        <Toggle
          pressed={chartType === "candlestick"}
          onPressedChange={() => handleChartTypeChange("candlestick")}
          aria-label="Toggle candlestick chart"
          className={`${chartType === "candlestick" ? "bg-gray-700" : ""}`}
        >
          <CandlestickChart className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Candlestick</span>
        </Toggle>
      </div>
    </div>
  );
};

export default ChartControls;
