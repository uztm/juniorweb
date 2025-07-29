"use client";

import React, { useState } from "react";
import Image from "next/image";

type Product = {
    id: number;
    name: string;
    image: string;
    quantity: number;
    price: number;
};

const featuredProducts: Product[] = [
    { id: 1, name: "Samsung Pods", image: "/products/airpods.png", quantity: 1, price: 2190 },
    { id: 2, name: "Galaxy Watch Ultra", image: "/products/galaxywatch.png", quantity: 1, price: 3010 },
    { id: 3, name: "DOLL Lap Top", image: "/products/laptop.png", quantity: 1, price: 9990 },
    { id: 4, name: "S24 Ultra", image: "/products/phone.png", quantity: 2, price: 5090 },
    { id: 5, name: "Xiaomi Band 8", image: "/products/galaxywatch.png", quantity: 3, price: 4010 },
    { id: 6, name: "External Drive", image: "/products/laptop.png", quantity: 1, price: 3300 },
    { id: 7, name: "Macbook Pro M3", image: "/products/laptop.png", quantity: 1, price: 12990 },
    { id: 8, name: "iPad Mini", image: "/products/phone.png", quantity: 2, price: 5590 },
    { id: 9, name: "Beats Headphones", image: "/products/airpods.png", quantity: 1, price: 2890 },
    { id: 10, name: "Amazfit Watch", image: "/products/galaxywatch.png", quantity: 1, price: 3790 },
    { id: 11, name: "Realme Buds", image: "/products/airpods.png", quantity: 2, price: 1590 },
    { id: 12, name: "Dell XPS", image: "/products/laptop.png", quantity: 1, price: 9990 },
];

const newProducts: Product[] = [
    { id: 101, name: "iPhone 14", image: "/products/phone.png", quantity: 1, price: 9090 },
    { id: 102, name: "Samsung Watch", image: "/products/galaxywatch.png", quantity: 2, price: 2790 },
    { id: 103, name: "WD Drive", image: "/products/laptop.png", quantity: 1, price: 3190 },
    { id: 104, name: "Huawei Laptop", image: "/products/laptop.png", quantity: 1, price: 8490 },
    { id: 105, name: "Honor Earbuds", image: "/products/airpods.png", quantity: 2, price: 1290 },
    { id: 106, name: "Redmi Watch 3", image: "/products/galaxywatch.png", quantity: 1, price: 2290 },
    { id: 107, name: "Sony Camera", image: "/products/laptop.png", quantity: 1, price: 11290 },
    { id: 108, name: "Kindle Reader", image: "/products/phone.png", quantity: 1, price: 4790 },
    { id: 109, name: "MSI Gaming Laptop", image: "/products/laptop.png", quantity: 1, price: 15490 },
    { id: 110, name: "Anker Charger", image: "/products/airpods.png", quantity: 2, price: 990 },
    { id: 111, name: "Garmin Watch", image: "/products/galaxywatch.png", quantity: 1, price: 6590 },
    { id: 112, name: "Bluetooth Speaker", image: "/products/phone.png", quantity: 2, price: 2590 },
];

export default function MarketPage() {
    const [balance] = useState(277);
    const [showNew, setShowNew] = useState(false);

    const displayedProducts = showNew ? newProducts : featuredProducts;

    return (
        <main className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between items-center bg-white shadow px-6 py-4 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/products/coins.png" alt="Coin" fill className="object-contain" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{balance}</p>
                </div>

                <div className="flex gap-3 mt-3 md:mt-0">
                    <button
                        onClick={() => setShowNew(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${!showNew ? "bg-[#397AFF] text-white" : "text-black border-blue-700 border"
                            }`}
                    >
                        Narx boʻyicha
                    </button>
                    <button
                        onClick={() => setShowNew(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${showNew ? "bg-[#397AFF] text-white" : "text-black border-blue-700 border"
                            }`}
                    >
                        Yangi qoʻshilganlar
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-[1320px] mx-auto">
                {displayedProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white shadow-md rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow"
                    >
                        {/* Image */}
                        <div className="w-full h-[180px] bg-gray-100 rounded-xl relative mb-3">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>

                        {/* Title & Quantity */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">Mavjud: {product.quantity}</p>

                        {/* Price Button */}
                        <a
                            href="#"
                            className="mt-auto text-base font-semibold text-white bg-[#397AFF] hover:bg-blue-600 hover:scale-105 transition-all duration-200 px-4 py-2 rounded-full flex items-center justify-center gap-2"
                        >
                            <div className="relative w-5 h-5">
                                <Image src="/products/coins.png" alt="Coin" fill className="object-contain" />
                            </div>
                            <span>{product.price}</span>
                        </a>
                    </div>
                ))}
            </div>
        </main>
    );
}
