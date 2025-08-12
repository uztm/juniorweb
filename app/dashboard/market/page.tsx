"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  Grid3X3,
  List,
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/Services/api/apiService";
import { useStudentContext } from "@/context/StudentContext";

type Product = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
};

type CartItem = Product & {
  cartQuantity: number;
};

type FilterState = {
  category: string;
  priceRange: [number, number];
  rating: number;
  sortBy: string;
};

export default function MarketPage() {
  const { data } = useStudentContext();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 1000],
    rating: 0,
    sortBy: "name",
  });

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await api.get("/api/education/v1/coin-prize/get-all");

        if (res.data?.success && Array.isArray(res.data.data)) {
          const mapped: Product[] = res.data.data.map(
            (item: any, index: number) => ({
              id: item.id,
              name: item.name,
              price: item.coinCost,
              quantity: Math.floor(Math.random() * 50) + 1,
              image: item.fileId,
              description: `${item.name} - bu yuqori sifatli mahsulot bo'lib, o'quvchilar uchun maxsus tayyorlangan.`,
              isNew: index < 3,
            })
          );

          setProducts(mapped);
          setFilteredProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching products", error);
        setError("Mahsulotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter and search logic
  const applyFilters = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }

    // Tab filter
    if (activeTab === "new") {
      filtered = filtered.filter((product) => product.isNew);
    } else if (activeTab === "featured") {
      filtered = filtered.filter((product) => product.isFeatured);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchQuery, filters, activeTab]);

  useEffect(() => {
    setFilteredProducts(applyFilters);
  }, [applyFilters]);

  // Cart functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                cartQuantity: Math.min(
                  item.cartQuantity + quantity,
                  item.quantity
                ),
              }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, cartQuantity: Math.min(quantity, item.quantity) }
          : item
      )
    );
  };

  // Wishlist functions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Purchase function
  const handlePurchase = async () => {
    const totalCost = cart.reduce(
      (sum, item) => sum + item.price * item.cartQuantity,
      0
    );

    try {
      // Here you would make API calls to process the purchase
      alert("Xarid muvaffaqiyatli amalga oshirildi!");
      setCart([]);
      setShowCart(false);
    } catch (error) {
      alert("Xarid qilishda xatolik yuz berdi!");
    }
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const totalCartCost = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Mahsulotlar yuklanmoqda...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <span className="ml-2 text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Mobile Layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            {/* Top Row: Coins + Cart */}
            <div className="flex items-center justify-between">
              {/* Coin Balance */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow">
                <div className="relative w-6 h-6">
                  <Image
                    src="/products/coins.png"
                    alt="Coin"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-bold">
                  {data?.data.activeCoin || 0}
                </span>
                <span className="text-xs opacity-90">tangalar</span>
              </div>

              {/* Cart Button */}
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 hover:bg-blue-700 p-2 rounded-full"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {totalCartItems}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Search Bar */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Mahsulotlarni qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Coin Balance */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-lg">
              <div className="relative w-8 h-8">
                <Image
                  src="/products/coins.png"
                  alt="Coin"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">
                {data?.data.activeCoin || 0}
              </span>
              <span className="text-sm opacity-90">tangalar</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Mahsulotlarni qidiring..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {totalCartItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}

            {/* Products Grid/List */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent
                    className={`p-0 ${
                      viewMode === "list" ? "flex w-full" : ""
                    }`}
                  >
                    {/* Product Image */}
                    <div
                      className={`relative overflow-hidden p-10 ${
                        viewMode === "list" ? "aspect-square" : "aspect-square"
                      } bg-gray-100 rounded-t-lg ${
                        viewMode === "list"
                          ? "rounded-l-lg rounded-tr-none"
                          : ""
                      }`}
                    >
                      <img
                        src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${product.image}&view=open`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Yangi
                          </Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="bg-purple-500 text-white text-xs">
                            Mashhur
                          </Badge>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            wishlist.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div
                      className={`p-4 flex-1 ${
                        viewMode === "list"
                          ? "flex flex-col justify-between"
                          : ""
                      }`}
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        {viewMode === "list" && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <p className="text-sm text-gray-500 mb-3">
                          Mavjud: {product.quantity} dona
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative w-5 h-5">
                            <Image
                              src="/products/coins.png"
                              alt="Coin"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="text-xl font-bold text-blue-600">
                            {product.price}
                          </span>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={product.quantity === 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Qo'shish
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Mahsulot topilmadi
                </h3>
                <p className="text-gray-500">
                  Qidiruv so'zini o'zgartiring yoki filtrlarni qayta sozlang
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square p-6 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${selectedProduct.image}&view=open`}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">{selectedProduct.description}</p>

                  <div className="flex items-center gap-2 text-lg">
                    <span>Narx:</span>
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6">
                        <Image
                          src="/products/coins.png"
                          alt="Coin"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {selectedProduct.price}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500">
                    Mavjud: {selectedProduct.quantity} dona
                  </p>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={selectedProduct.quantity === 0}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Savatga qo'shish
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(selectedProduct.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Shopping Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Savat ({totalCartItems} mahsulot)
            </DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Savat bo'sh</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <img
                    src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${item.image}&view=open`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="relative w-4 h-4">
                        <Image
                          src="/products/coins.png"
                          alt="Coin"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span>
                        {item.price} × {item.cartQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateCartQuantity(item.id, item.cartQuantity - 1)
                      }
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center">{item.cartQuantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateCartQuantity(item.id, item.cartQuantity + 1)
                      }
                      disabled={item.cartQuantity >= item.quantity}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold mb-4">
                  <span>Jami:</span>
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                      <Image
                        src="/products/coins.png"
                        alt="Coin"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-blue-600">{totalCartCost}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePurchase}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={totalCartCost > (data?.data.activeCoin || 0)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {totalCartCost > (data?.data.activeCoin || 0)
                    ? "Yetarli tanga yo'q"
                    : "Xarid qilish"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
