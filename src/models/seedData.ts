import { Product } from './types';

export const LUXURY_PALETTE = {
  olive: { name: 'Verde Oliva Imperial', hex: '#3E503B', class: 'bg-[#3E503B]' },
  rose: { name: 'Palo de Rosa Sublime', hex: '#E2A9A0', class: 'bg-[#E2A9A0]' },
  gold: { name: 'Dorado Champán', hex: '#C5A059', class: 'bg-[#C5A059]' },
  white: { name: 'Blanco Marfil Perla', hex: '#FAF7F2', class: 'bg-[#FAF7F2]' },
  black: { name: 'Negro Ébano Nocturno', hex: '#1C1F1B', class: 'bg-[#1C1F1B]' },
  sage: { name: 'Salvia Silvestre', hex: '#7A8C74', class: 'bg-[#7A8C74]' },
  champagne: { name: 'Seda Champán', hex: '#E8DCB8', class: 'bg-[#E8DCB8]' },
  blush: { name: 'Rosa Empolvado', hex: '#F3D4CF', class: 'bg-[#F3D4CF]' },
};

export const INITIAL_PRODUCTS: Product[] = [
  // --- COLECCIÓN DAMA (Rosados, Dorados, Blancos, Toques Oliva) ---
  {
    id: 'prod-dama-01',
    name: 'Vestido Gala Aurelia de Seda y Rosa Empolvado',
    subtitle: 'Edición Limitada Alta Costura',
    description: 'Vestido largo de noche confeccionado en satén de seda italiana en tonalidad palo de rosa con delicados bordados en hilos de oro champán en cintura y hombros.',
    details: [
      'Satén de seda 100% italiana con caída fluida',
      'Escote en V cruzado con forro de seda interior',
      'Cinturón desmontable con hebilla bañada en oro satinado',
      'Cierre invisible en espalda y abertura lateral sutil'
    ],
    fabric: '100% Satén de Seda Mulberry',
    careInstructions: 'Lavado en seco especializado',
    gender: 'dama',
    category: 'Vestidos',
    style: 'Formal & Gala',
    price: 340000,
    originalPrice: 420000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [LUXURY_PALETTE.rose, LUXURY_PALETTE.champagne, LUXURY_PALETTE.white],
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 14,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 38,
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'prod-dama-02',
    name: 'Blazer Entallado Blanco Marfil con Botones Dorados',
    subtitle: 'Sastrería Contemporánea',
    description: 'Blazer estructurado con solapa de lanza y botones repujados con baño de oro 24k. Una pieza insignia que transmite autoridad y refinamiento.',
    details: [
      'Tejido estructurado de lana fría y elastano',
      'Forro interior de satén rosado suave',
      'Bolsillos con tapeta y hombreras arquitectónicas',
      'Botones ornamentales labrados en oro cepillado'
    ],
    fabric: 'Lana virgen 85%, Seda 10%, Elastano 5%',
    careInstructions: 'Limpieza en seco profesional',
    gender: 'dama',
    category: 'Trajes & Blazers',
    style: 'Casual Chic',
    price: 290000,
    originalPrice: 350000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [LUXURY_PALETTE.white, LUXURY_PALETTE.rose, LUXURY_PALETTE.olive],
    images: [
      'https://images.unsplash.com/photo-1548624149-f9b31d7be5df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 19,
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 29,
    createdAt: '2026-08-05T12:00:00Z'
  },
  {
    id: 'prod-dama-03',
    name: 'Conjunto Lino Natural & Blusa Dorada Ethereal',
    subtitle: 'Brisa Mediterránea',
    description: 'Pantalón palazzo de lino puro en tono crema marfil combinado con top fluido de cuello halter con hilos dorados entrelazados.',
    details: [
      'Lino orgánico prelavado con textura ultra suave',
      'Tiro alto con pretina elástica trasera oculta',
      'Top con lazo de ajuste al cuello con herrajes dorados',
      'Transpirabilidad y confort térmico premium'
    ],
    fabric: '100% Lino Orgánico de Normandía',
    gender: 'dama',
    category: 'Prendas de Lino',
    style: 'Lino & Verano',
    price: 260000,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [LUXURY_PALETTE.white, LUXURY_PALETTE.gold, LUXURY_PALETTE.rose],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 8,
    featured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 16,
    createdAt: '2026-08-10T14:00:00Z'
  },
  {
    id: 'prod-dama-04',
    name: 'Vestido Midi Plisado Verde Oliva Esmeralda',
    subtitle: 'Elegancia Versátil',
    description: 'Vestido midi con falda plisada soleil en sutil verde oliva con reflejos satinados. Cinturón de terciopelo con hebilla en oro envejecido.',
    details: [
      'Microplisado permanente soleil de alta precisión',
      'Manga tres cuartos abullonada con puño elástico fino',
      'Corte a la cintura favorecedor para todo tipo de silueta',
      'Tejido con movimiento grácil y fluido'
    ],
    fabric: 'Gasa de seda y microfibra de alta densidad',
    gender: 'dama',
    category: 'Vestidos',
    style: 'Casual Chic',
    price: 280000,
    originalPrice: 320000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [LUXURY_PALETTE.olive, LUXURY_PALETTE.rose, LUXURY_PALETTE.black],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 12,
    featured: true,
    rating: 5.0,
    reviewsCount: 42,
    createdAt: '2026-08-08T09:00:00Z'
  },
  {
    id: 'prod-dama-05',
    name: 'Camisa Seda Pura Blanca con Cadena Dorada',
    subtitle: 'Básico Sublime',
    description: 'Camisa camisera de crepé de seda pura marfil con detalle removible de cadena dorada en el cuello y botones de nácar genuino.',
    details: [
      'Crepé de chine 100% seda de grado superior',
      'Botones de madreperla natural cosidos a mano',
      'Cadena de eslabones pulidos con baño en oro de 18k desmontable',
      'Corte relajado pero estilizado'
    ],
    fabric: '100% Seda Crepe de Chine',
    gender: 'dama',
    category: 'Camisas & Tops',
    style: 'Minimalista Urbano',
    price: 210000,
    sizes: ['S', 'M', 'L'],
    colors: [LUXURY_PALETTE.white, LUXURY_PALETTE.rose, LUXURY_PALETTE.champagne],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 22,
    featured: false,
    rating: 4.8,
    reviewsCount: 25,
    createdAt: '2026-08-12T11:00:00Z'
  },

  // --- COLECCIÓN CABALLERO (Verde Oliva, Dorados, Blancos, Sastrería) ---
  {
    id: 'prod-cab-01',
    name: 'Traje Sastre Verde Oliva Imperial de 2 Piezas',
    subtitle: 'Sastrería a Medida Italiana',
    description: 'Impecable traje de corte sartorial contemporáneo en exquisito paño verde oliva. Saco de dos botones con solapa de muesca y pantalón de pretina extendida con ajustadores laterales de metal dorado.',
    details: [
      'Lana super 130s de hilatura fina con sutil brillo mate',
      'Medio forro interior en viscosa color champán dorado',
      'Ajustadores metálicos de hebilla lateral en tono oro envejecido',
      'Bolsillos de ojal y doble abertura trasera'
    ],
    fabric: '100% Lana Merino Super 130s',
    careInstructions: 'Lavado en seco profesional',
    gender: 'caballero',
    category: 'Trajes & Blazers',
    style: 'Sastrería Clásica',
    price: 490000,
    originalPrice: 580000,
    sizes: ['36', '38', '40', '42', '44'],
    colors: [LUXURY_PALETTE.olive, LUXURY_PALETTE.black, LUXURY_PALETTE.white],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 11,
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 47,
    createdAt: '2026-08-02T16:00:00Z'
  },
  {
    id: 'prod-cab-02',
    name: 'Camisa Guayabera de Lino Blanco con Alforzas',
    subtitle: 'Elegancia Caribeña & Verano',
    description: 'Guayabera de lujo de cuatro bolsillos con alforzas milimétricas cosidas a mano. Botones de concha de nácar pulida e hilos de refuerzo en tono dorado suave.',
    details: [
      '100% Lino puro de peso medio con tratamiento antiarrugas suave',
      'Bordados de alforzas verticales de alta precisión',
      'Cuello estructurado resistente al calor y humedad',
      'Bolsillos funcionales y corte recto distinguido'
    ],
    fabric: '100% Lino Puro Irlandés',
    gender: 'caballero',
    category: 'Camisas & Tops',
    style: 'Lino & Verano',
    price: 230000,
    originalPrice: 270000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [LUXURY_PALETTE.white, LUXURY_PALETTE.champagne, LUXURY_PALETTE.olive],
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429fbb41?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 25,
    featured: true,
    rating: 4.9,
    reviewsCount: 31,
    createdAt: '2026-08-04T10:00:00Z'
  },
  {
    id: 'prod-cab-03',
    name: 'Blazer Desestructurado Verde Oliva Safari & Ciudad',
    subtitle: 'Casual de Lujo',
    description: 'Blazer ligero sin forro en mezcla de lino y algodón orgánico verde militar/oliva. Ideal para reuniones informales de negocios o eventos al atardecer.',
    details: [
      'Construcción soft-tailored sin hombreras para máxima naturalidad',
      'Bolsillos de parche redondeados estilo napolitano',
      'Botones de cuerno natural con anclaje dorado',
      'Costuras interiores envueltas en bies de algodón marfil'
    ],
    fabric: '55% Lino, 45% Algodón Egipcio',
    gender: 'caballero',
    category: 'Trajes & Blazers',
    style: 'Casual Chic',
    price: 330000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [LUXURY_PALETTE.olive, LUXURY_PALETTE.champagne, LUXURY_PALETTE.black],
    images: [
      'https://images.unsplash.com/photo-1555069519-127aadedf1ee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 15,
    featured: true,
    rating: 4.8,
    reviewsCount: 22,
    createdAt: '2026-08-09T15:00:00Z'
  },
  {
    id: 'prod-cab-04',
    name: 'Pantalón Gurkha de Vestir Blanco Nieve & Oro',
    subtitle: 'Diseño Sartorial Vintage',
    description: 'Pantalón de tiro alto con pretina cruzada estilo Gurkha y doble hebilla de latón dorado. Pliegues frontales profundos y caída impecable.',
    details: [
      'Cintura Gurkha cruzada autoajustable con doble hebilla dorada',
      'Doble pliegue frontal hacia afuera',
      'Bajo terminado con dobladillo de 4.5 cm',
      'Tejido de sarga de algodón peinado de alta torsión'
    ],
    fabric: 'Sarga de Algodón Peinado 100%',
    gender: 'caballero',
    category: 'Pantalones & Faldas',
    style: 'Formal & Gala',
    price: 245000,
    sizes: ['30', '32', '34', '36'],
    colors: [LUXURY_PALETTE.white, LUXURY_PALETTE.olive, LUXURY_PALETTE.black],
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 17,
    featured: false,
    rating: 4.9,
    reviewsCount: 19,
    createdAt: '2026-08-11T13:00:00Z'
  },
  {
    id: 'prod-cab-05',
    name: 'Suéter Cuello Polo Seda y Cachemira Oliva Dorado',
    subtitle: 'Lujo Silencioso',
    description: 'Suéter de punto fino de seda y cachemira ultrafina con cuello polo sin botones y ribete dorado en mangas.',
    details: [
      '70% Seda Mulberry, 30% Cachemira de Mongolia',
      'Tacto ultrasuave apto para contacto directo con la piel',
      'Cuello abierto tipo Johnny collar',
      'Remate elástico fino en puños y bajo'
    ],
    fabric: '70% Seda, 30% Cachemira',
    gender: 'caballero',
    category: 'Camisas & Tops',
    style: 'Minimalista Urbano',
    price: 275000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [LUXURY_PALETTE.olive, LUXURY_PALETTE.rose, LUXURY_PALETTE.white],
    images: [
      'https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 13,
    featured: false,
    rating: 4.8,
    reviewsCount: 14,
    createdAt: '2026-08-14T17:00:00Z'
  },

  // --- ACCESORIOS & CALZADO UNISEX / ALTA GAMA ---
  {
    id: 'prod-acc-01',
    name: 'Reloj Cronógrafo Cronos Oro & Esfera Verde Bosque',
    subtitle: 'Joyería y Precisión',
    description: 'Reloj cronógrafo de vestir con caja de acero inoxidable bañada en oro de 18 quilates, esfera verde oliva cepillada y cristal de zafiro antirreflejos.',
    details: [
      'Movimiento de cuarzo suizo de alta precisión',
      'Caja de 40mm con bisel pulido a espejo en oro amarillo',
      'Correa de piel genuina de curtición vegetal verde oliva',
      'Resistencia al agua 5 ATM (50 metros)'
    ],
    fabric: 'Acero inoxidable 316L, Baño de Oro 18k, Cristal de Zafiro',
    gender: 'unisex',
    category: 'Accesorios de Lujo',
    style: 'Formal & Gala',
    price: 420000,
    originalPrice: 510000,
    sizes: ['Única (40mm)'],
    colors: [LUXURY_PALETTE.gold, LUXURY_PALETTE.olive, LUXURY_PALETTE.black],
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 9,
    featured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 52,
    createdAt: '2026-08-03T11:00:00Z'
  },
  {
    id: 'prod-acc-02',
    name: 'Mocasines Italianos de Terciopelo Verde Oliva & Broche Dorado',
    subtitle: 'Calzado Artesanal Hecho a Mano',
    description: 'Mocasines de terciopelo verde oliva con antifaz de broche dorado forjado a mano. Suela de cuero cosida con técnica Blake.',
    details: [
      'Terciopelo italiano de seda y algodón repelente a manchas',
      'Forro interior de piel de cabritilla ultra flexible',
      'Suela de cuero natural apomazado con vira fina',
      'Herraje dorado con acabado satinado anti-rayaduras'
    ],
    fabric: 'Terciopelo de Seda y Cuero Vacuno Italiano',
    gender: 'caballero',
    category: 'Calzado Elegante',
    style: 'Formal & Gala',
    price: 360000,
    sizes: ['38', '39', '40', '41', '42', '43'],
    colors: [LUXURY_PALETTE.olive, LUXURY_PALETTE.black, LUXURY_PALETTE.rose],
    images: [
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 10,
    featured: false,
    rating: 4.9,
    reviewsCount: 27,
    createdAt: '2026-08-07T08:00:00Z'
  },
  {
    id: 'prod-dama-06',
    name: 'Stilettos Sandalia Oro Rosa con Cristales',
    subtitle: 'Noches de Gala',
    description: 'Sandalias de tacón fino de 8.5 cm en piel metalizada oro rosa con tiras cruzadas en el empeine y cierre con hebilla joya.',
    details: [
      'Piel metalizada oro rosa de curtido artesanal',
      'Plantilla acolchada con memoria de 5mm para confort prolongado',
      'Tacón aguja reforzado con alma de acero',
      'Suela de cuero pulido con protector antideslizante'
    ],
    fabric: 'Piel genuina metalizada',
    gender: 'dama',
    category: 'Calzado Elegante',
    style: 'Fiesta & Noche',
    price: 310000,
    sizes: ['35', '36', '37', '38', '39'],
    colors: [LUXURY_PALETTE.rose, LUXURY_PALETTE.gold, LUXURY_PALETTE.white],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=80'
    ],
    inStock: true,
    stockCount: 16,
    featured: true,
    rating: 4.9,
    reviewsCount: 34,
    createdAt: '2026-08-13T10:00:00Z'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'AURA-9842',
    customerId: 'cust-demo-1',
    customerName: 'Valentina Restrepo',
    customerEmail: 'valentina.restrepo@example.com',
    customerPhone: '+57 312 456 7890',
    shippingAddress: {
      fullName: 'Valentina Restrepo',
      documentId: '1020304050',
      email: 'valentina.restrepo@example.com',
      phone: '+57 312 456 7890',
      address: 'Calle 93 # 14-20, Apto 502',
      city: 'Bogotá',
      department: 'Cundinamarca',
      postalCode: '110221',
      notes: 'Portería 24 horas'
    },
    items: [
      {
        id: 'prod-dama-01-S-rose',
        productId: 'prod-dama-01',
        name: 'Vestido Gala Aurelia de Seda y Rosa Empolvado',
        price: 340000,
        originalPrice: 420000,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
        gender: 'dama' as const,
        selectedSize: 'S',
        selectedColor: LUXURY_PALETTE.rose,
        quantity: 1,
        stockAvailable: 14
      }
    ],
    subtotal: 340000,
    shippingFee: 0,
    discount: 34000,
    couponCode: 'AURA10',
    total: 306000,
    paymentMethod: 'card' as const,
    paymentStatus: 'paid' as const,
    paymentReference: 'TXN-VISA-883921',
    orderStatus: 'preparacion' as const,
    trackingCode: 'ENV-COL-99281',
    shippingCarrier: 'Coordinadora Express VIP',
    estimatedDelivery: '22 de Agosto, 2026',
    createdAt: '2026-08-18T14:30:00Z',
    updatedAt: '2026-08-19T09:15:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'AURA-9843',
    customerId: 'cust-demo-2',
    customerName: 'Santiago Morales',
    customerEmail: 'santiago.morales@example.com',
    customerPhone: '+57 300 897 1234',
    shippingAddress: {
      fullName: 'Santiago Morales',
      documentId: '79881234',
      email: 'santiago.morales@example.com',
      phone: '+57 300 897 1234',
      address: 'Carrera 43A # 1Sur-29, El Poblado',
      city: 'Medellín',
      department: 'Antioquia',
      postalCode: '050021'
    },
    items: [
      {
        id: 'prod-cab-01-40-olive',
        productId: 'prod-cab-01',
        name: 'Traje Sastre Verde Oliva Imperial de 2 Piezas',
        price: 490000,
        originalPrice: 580000,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80',
        gender: 'caballero' as const,
        selectedSize: '40',
        selectedColor: LUXURY_PALETTE.olive,
        quantity: 1,
        stockAvailable: 11
      }
    ],
    subtotal: 490000,
    shippingFee: 0,
    discount: 0,
    total: 490000,
    paymentMethod: 'pse' as const,
    paymentStatus: 'paid' as const,
    paymentReference: 'PSE-BANCOLOMBIA-452109',
    orderStatus: 'enviado' as const,
    trackingCode: 'ENV-MED-77123',
    shippingCarrier: 'Servientrega Premier',
    estimatedDelivery: '21 de Agosto, 2026',
    createdAt: '2026-08-17T11:20:00Z',
    updatedAt: '2026-08-18T16:00:00Z'
  }
];

export const INITIAL_PQRS = [
  {
    id: 'pqrs-101',
    ticketNumber: 'PQRS-2026-8801',
    customerId: 'cust-demo-1',
    customerName: 'Mariana Gómez',
    customerEmail: 'mariana.gomez@example.com',
    customerPhone: '+57 315 789 0123',
    orderId: 'AURA-9820',
    type: 'Consulta General' as const,
    subject: 'Guía de tallas y medidas exactas para el Vestido Aurelia',
    status: 'respondido' as const,
    priority: 'media' as const,
    messages: [
      {
        id: 'msg-1',
        sender: 'customer' as const,
        senderName: 'Mariana Gómez',
        text: 'Hola, tengo duda entre la talla S y M para el vestido Aurelia rosa. Mis medidas de busto son 88cm y cintura 68cm. ¿Cuál me recomendarían?',
        timestamp: '2026-08-19T10:00:00Z'
      },
      {
        id: 'msg-2',
        sender: 'admin' as const,
        senderName: 'Soporte Aura & Elegance (Admin)',
        text: 'Estimada Mariana, un gusto saludarte. Para tus medidas (88cm busto y 68cm cintura), la talla S te quedará entallada de forma impecable ya que el satén tiene una leve elasticidad en el forro. ¡Quedamos atentos si necesitas algo más!',
        timestamp: '2026-08-19T10:25:00Z',
        isOfficialResponse: true
      }
    ],
    createdAt: '2026-08-19T10:00:00Z',
    updatedAt: '2026-08-19T10:25:00Z'
  },
  {
    id: 'pqrs-102',
    ticketNumber: 'PQRS-2026-8802',
    customerName: 'Carlos Eduardo Peña',
    customerEmail: 'carlos.pena@example.com',
    type: 'Peticion' as const,
    subject: 'Solicitud de personalización en ajustadores de traje sastre',
    status: 'abierto' as const,
    priority: 'alta' as const,
    messages: [
      {
        id: 'msg-3',
        sender: 'customer' as const,
        senderName: 'Carlos Eduardo Peña',
        text: 'Buenas tardes, quisiera saber si el traje verde oliva se puede entregar con basta lista de 82cm de entrepierna antes del viernes.',
        timestamp: '2026-08-20T11:10:00Z'
      }
    ],
    createdAt: '2026-08-20T11:10:00Z',
    updatedAt: '2026-08-20T11:10:00Z'
  }
];
