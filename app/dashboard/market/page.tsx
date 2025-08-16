"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Heart,
  Grid3X3,
  List,
  X,
  Plus,
  Minus,
  Check,
  Loader2,
  Filter,
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
import { api } from "@/Services/api/apiService";
import { useStudentContext } from "@/context/StudentContext";

type Product = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  description: string;
  isNew?: boolean;
  isFeatured?: boolean;
};

type CartItem = Product & { cartQuantity: number };

export default function MarketPage() {
  const { data } = useStudentContext();

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
              description: `${item.name} - yuqori sifatli mahsulot.`,
              isNew: index < 3,
              isFeatured: index % 2 === 0,
            })
          );

          setProducts(mapped);
          setFilteredProducts(mapped);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  // Cart logic
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, cartQuantity: Math.min(i.cartQuantity + 1, i.quantity) }
            : i
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };
  const updateCartQuantity = (id: string, qty: number) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => i.id !== id));
    setCart((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, cartQuantity: Math.min(qty, i.quantity) } : i
      )
    );
  };
  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.id !== id));

  const toggleWishlist = (id: string) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const totalItems = cart.reduce((sum, i) => sum + i.cartQuantity, 0);
  const totalCost = cart.reduce((sum, i) => sum + i.price * i.cartQuantity, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        Mahsulotlar yuklanmoqda...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          {/* Coins */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow flex-shrink-0">
            <Image
              src="/products/coins.png"
              alt="coin"
              width={20}
              height={20}
            />
            <span className="font-bold text-sm">
              {data?.data.activeCoin || 0}
            </span>
            <span className="text-[10px] opacity-80">tanga</span>
          </div>

          {/* Search */}
          <div className="flex-1 relative max-w-md mx-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm h-9"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={() => setShowCart(true)}
              className="relative bg-blue-600 hover:bg-blue-700 rounded-full p-2 h-9 w-9 flex items-center justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] px-1 rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <Search className="w-10 h-10 mx-auto mb-2" />
            Hech narsa topilmadi
          </div>
        )}
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <CardContent className="p-0">
              <div className="relative flex items-center justify-center aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${product.image}&view=open`}
                  alt={product.name}
                  className="w-[70%] object-cover group-hover:scale-105 transition"
                />
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    Yangi
                  </Badge>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-2 right-2 bg-white/80 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition ${
                      wishlist.includes(product.id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 font-bold text-blue-600">
                    <Image
                      src="/products/coins.png"
                      alt="coin"
                      width={18}
                      height={18}
                    />
                    {product.price}
                  </span>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> Qo‘shish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${selectedProduct.image}&view=open`}
                    alt={selectedProduct.name}
                    className="w-[70%] object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedProduct.description}</p>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/products/coins.png"
                      alt="coin"
                      width={20}
                      height={20}
                    />
                    <span className="text-xl font-bold text-blue-600">
                      {selectedProduct.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Mavjud: {selectedProduct.quantity} dona
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" /> Savatga qo‘shish
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Savat ({totalItems} ta)</DialogTitle>
          </DialogHeader>
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Savat bo‘sh</div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border p-3 rounded-lg"
                >
                  <img
                    src={`https://api.pdp.uz/api/attachment/v1/attachment/download?id=${item.image}&view=open`}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="text-sm text-gray-500">
                      {item.price} × {item.cartQuantity}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateCartQuantity(item.id, item.cartQuantity - 1)
                      }
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="px-2">{item.cartQuantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
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
              <div className="flex justify-between font-semibold border-t pt-3">
                <span>Jami:</span>
                <span className="text-blue-600">{totalCost}</span>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={totalCost > (data?.data.activeCoin || 0)}
              >
                <Check className="w-4 h-4 mr-1" /> Xarid qilish
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
