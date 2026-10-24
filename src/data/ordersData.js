export const initialOrders = [
  {
    id: "849201",
    customerName: "Dilshod Alimov",
    phone: "+998 90 345 67 89",
    address: "Toshkent sh., Yunusobod tumani, 4-mavze, 12-uy",
    paymentMethod: "Payme",
    promoCode: "SHIFO2026",
    subtotal: 53500,
    deliveryFee: 15000,
    discountAmount: 10700,
    total: 57800,
    status: "delivering", // 'delivering' | 'delivered' | 'processing'
    deliveryMinutes: "25 - 35",
    createdAt: "2026-10-22 17:45",
    items: [
      {
        id: "prod-1",
        name: "Paracetamol 500mg (20 tabletka)",
        price: 8500,
        quantity: 1,
        image: "/images/products/paracetamol.svg"
      },
      {
        id: "prod-4",
        name: "Vitamin C 1000mg + Rux (Efferverscent)",
        price: 45000,
        quantity: 1,
        image: "/images/products/vitaminc.svg"
      }
    ]
  },
  {
    id: "849188",
    customerName: "Shahlo Rahimova",
    phone: "+998 93 512 34 56",
    address: "Toshkent sh., Mirzo Ulug'bek tumani, Qorasuv-1, 8-dom",
    paymentMethod: "Click",
    promoCode: "BEPUL",
    subtotal: 66500,
    deliveryFee: 0,
    discountAmount: 0,
    total: 66500,
    status: "delivered",
    deliveryMinutes: "Yetkazib berildi",
    createdAt: "2026-10-22 15:20",
    items: [
      {
        id: "prod-2",
        name: "Ibuprofen Forte 400mg (Capsules)",
        price: 24000,
        quantity: 2,
        image: "/images/products/ibuprofen.svg"
      },
      {
        id: "prod-3",
        name: "Omeprazol 20mg (Oshqozon himoyasi)",
        price: 18500,
        quantity: 1,
        image: "/images/products/omeprazole.svg"
      }
    ]
  },
  {
    id: "849150",
    customerName: "Bobur Mirzayev",
    phone: "+998 97 789 01 23",
    address: "Toshkent sh., Chilonzor tumani, 9-kvartal, 34-uy",
    paymentMethod: "Naqd / Karta (Kuryerga)",
    promoCode: null,
    subtotal: 185000,
    deliveryFee: 15000,
    discountAmount: 0,
    total: 200000,
    status: "processing",
    deliveryMinutes: "35 - 45",
    createdAt: "2026-10-22 18:10",
    items: [
      {
        id: "prod-7",
        name: "Raqamli Kontaktli Termometr",
        price: 65000,
        quantity: 1,
        image: "/images/products/thermometer.svg"
      },
      {
        id: "prod-8",
        name: "Avtomobil & Uy uchun Birinchi Yordam Aptechkasi",
        price: 120000,
        quantity: 1,
        image: "/images/products/firstaid.svg"
      }
    ]
  }
];
