import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Search, ArrowUp, ArrowDown, Star } from "lucide-react";
import { Badge } from "./ui/badge";

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

interface CryptoListProps {
  cryptos?: Cryptocurrency[];
  onSelectCrypto?: (crypto: Cryptocurrency) => void;
  onToggleFavorite?: (id: string) => void;
}

const CryptoList = ({
  cryptos = defaultCryptos,
  onSelectCrypto = () => {},
  onToggleFavorite = () => {},
}: CryptoListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="w-full bg-gray-900 text-white border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Cryptocurrencies</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search cryptocurrency"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 focus:border-blue-500 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800">
                <TableHead className="text-gray-400">Favorite</TableHead>
                <TableHead className="text-gray-400">#</TableHead>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400 text-right">
                  Price
                </TableHead>
                <TableHead className="text-gray-400 text-right">
                  24h Change
                </TableHead>
                <TableHead className="text-gray-400 text-right">
                  Market Cap
                </TableHead>
                <TableHead className="text-gray-400 text-right">
                  Volume (24h)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCryptos.map((crypto, index) => (
                <TableRow
                  key={crypto.id}
                  className="border-gray-800 hover:bg-gray-800 cursor-pointer"
                  onClick={() => onSelectCrypto(crypto)}
                >
                  <TableCell>
                    <Star
                      className={`h-5 w-5 cursor-pointer ${crypto.favorite ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(crypto.id);
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-xs text-gray-400">
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {crypto.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {crypto.change24h > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <Badge
                        className={
                          crypto.change24h > 0
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }
                      >
                        {Math.abs(crypto.change24h).toFixed(2)}%
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {crypto.marketCap.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    $
                    {crypto.volume24h.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Default mock data
const defaultCryptos: Cryptocurrency[] = [
  {
    id: "1",
    name: "Bitcoin",
    symbol: "BTC",
    price: 51342.67,
    change24h: 2.34,
    marketCap: 1000324567890,
    volume24h: 32456789012,
    favorite: true,
  },
  {
    id: "2",
    name: "Ethereum",
    symbol: "ETH",
    price: 2786.43,
    change24h: 1.56,
    marketCap: 334567890123,
    volume24h: 18765432109,
    favorite: false,
  },
  {
    id: "3",
    name: "Binance Coin",
    symbol: "BNB",
    price: 456.78,
    change24h: -0.87,
    marketCap: 76543210987,
    volume24h: 5432109876,
    favorite: false,
  },
  {
    id: "4",
    name: "Solana",
    symbol: "SOL",
    price: 123.45,
    change24h: 5.67,
    marketCap: 45678901234,
    volume24h: 3456789012,
    favorite: true,
  },
  {
    id: "5",
    name: "Cardano",
    symbol: "ADA",
    price: 0.56,
    change24h: -2.34,
    marketCap: 19876543210,
    volume24h: 1234567890,
    favorite: false,
  },
  {
    id: "6",
    name: "XRP",
    symbol: "XRP",
    price: 0.52,
    change24h: 0.12,
    marketCap: 25678901234,
    volume24h: 2345678901,
    favorite: false,
  },
  {
    id: "7",
    name: "Polkadot",
    symbol: "DOT",
    price: 6.78,
    change24h: -1.23,
    marketCap: 8765432109,
    volume24h: 876543210,
    favorite: false,
  },
];

export default CryptoList;
