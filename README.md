# Aura & Elegance — Tienda Virtual de Alta Moda

Plataforma de comercio electrónico y gestión integral de moda exclusiva, sastrería y prendas de lujo con estética editorial (*Editorial Aesthetic*), arquitectura MVC, persistencia en la nube mediante Firebase Firestore, autenticación de usuarios y centro de atención al cliente (PQRS).

---

## 1. Tecnologías y Lenguajes

- **Lenguaje Principal**: [TypeScript](https://www.typescriptlang.org/) (v5.8+) — Tipado estricto, interfaces compartidas y validación de modelos en tiempo de desarrollo.
- **Framework Frontend**: [React](https://react.dev/) (v19) con [Vite](https://vitejs.dev/) (v6) como empaquetador y servidor de desarrollo ultra rápido.
- **Motor de Estilos**: [Tailwind CSS](https://tailwindcss.com/) (v4) con plugin `@tailwindcss/vite` para estilos utilitarios modernos y paleta de diseño editorial.
- **Iconografía y Animaciones**: [Lucide React](https://lucide.dev/) y [Motion](https://motion.dev/) para micro-interacciones fluidas y transiciones.
- **Base de Datos & Autenticación**: [Google Firebase Firestore](https://firebase.google.com/products/firestore) (Base de datos NoSQL documental en tiempo real) y [Firebase Authentication](https://firebase.google.com/products/auth).

---

## 2. Arquitectura del Software (Patrón MVC)

El proyecto sigue una estructura limpia y desacoplada basada en el patrón Modelo-Vista-Controlador (MVC):

```
├── src/
│   ├── models/                  # [MODELOS]
│   │   ├── types.ts             # Definición de interfaces TypeScript (Product, CartItem, PQRSTicket, User, etc.)
│   │   ├── seedData.ts          # Catálogo inicial de productos y datos de prueba
│   │   └── firebase.ts          # Inicialización y configuración del cliente Firebase Firestore & Auth
│   ├── controllers/             # [CONTROLADORES]
│   │   ├── StoreContext.tsx     # Lógica de negocio del catálogo, filtros avanzados, sincronización con Firestore
│   │   ├── CartContext.tsx      # Gestión del carrito de compras, cupones de descuento, persistencia local y totales
│   │   ├── AuthContext.tsx      # Manejo de sesiones, login/registro de usuarios y verificación de rol Administrador
│   │   └── PQRSContext.tsx      # Gestión de radicaciones de PQRS, chat de atención en vivo y respuesta de tickets
│   ├── views/                   # [VISTAS]
│   │   ├── NavbarView.tsx       # Barra de navegación principal con buscador, selector de género y accesos rápidos
│   │   ├── HeroBannerView.tsx   # Banner editorial interactivo dividido en Damas y Caballeros
│   │   ├── FilterSidebarView.tsx# Barra lateral de filtros (categorías, tallas, colores, estilos y rango de precios)
│   │   ├── ProductGridView.tsx  # Cuadrícula responsiva de productos con ordenamiento y estados vacíos
│   │   ├── ProductCardView.tsx  # Ficha individual de producto con selector rápido de tallas, colores y favoritos
│   │   ├── ProductModalView.tsx # Modal con vista detallada de prenda, guía de tallas y selección
│   │   ├── CartDrawer.tsx       # Panel deslizable del carrito de compras y cálculo de totales
│   │   ├── CheckoutModal.tsx    # Pasarela de pago simulada (Tarjetas, PSE, Nequi, Contraentrega) y confirmación
│   │   ├── AdminDashboard.tsx   # Panel administrativo exclusivo para gestión de inventario (CRUD) y respuesta a PQRS
│   │   ├── AuthModalView.tsx    # Modal de inicio de sesión y registro de usuarios
│   │   └── PQRSChatWidgetView.tsx# Concierge y asistente flotante de atención PQRS con radicación de solicitudes
│   ├── App.tsx                  # Componente raíz y orquestador de vistas y contextos
│   ├── main.tsx                 # Punto de entrada de la aplicación en el DOM
│   └── index.css                # Importación y directivas globales de Tailwind CSS
├── firebase-applet-config.json  # Credenciales de conexión a Firebase
├── firestore.rules              # Reglas de seguridad de Firestore
├── package.json                 # Dependencias y scripts de ejecución
└── vite.config.ts               # Configuración del servidor Vite
```

---

## 3. Base de Datos & Configuración de Firebase

La aplicación utiliza **Cloud Firestore** para persistir en tiempo real:
- **`products`**: Catálogo de prendas, precios, stock, imágenes, tallas, colores y estilos.
- **`pqrs_tickets`**: Solicitudes, quejas, reclamos, sugerencias y peticiones radicadas por clientes.
- **`pqrs_chats`**: Historial de mensajes entre clientes y el concierge/administrador.
- **`orders`**: Pedidos y compras generadas con su detalle y estado.

### Reglas de Seguridad (`firestore.rules`)
Las reglas permiten lectura general del catálogo para clientes y restringen las acciones de creación, modificación o eliminación de inventario exclusivamente a usuarios con rol o email de administrador (`matematicaslzda@gmail.com`).

---

## 4. Requisitos Previos

- **Node.js**: Versión 18 o superior instalada.
- **Gestor de Paquetes**: `npm` (v9+) o `bun`.

---

## 5. Configuración y Puesta en Marcha

### Paso 1: Clonar o descargar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd aura-elegance
```

### Paso 2: Instalar las dependencias
Ejecuta el siguiente comando para instalar todos los paquetes requeridos:
```bash
npm install
```

### Paso 3: Configurar las variables de entorno
Crea un archivo `.env` en la raíz del proyecto tomando como guía `.env.example`:
```env
# Puerto configurado por defecto
PORT=3000
```
*(Las credenciales de Firebase ya se encuentran vinculadas en `firebase-applet-config.json` para el entorno de la tienda).*

### Paso 4: Iniciar el servidor de desarrollo
Para iniciar la aplicación en modo interactivo:
```bash
npm run dev
```
La aplicación estará disponible inmediatamente en `http://localhost:3000` (o en la URL provista por el entorno de desarrollo).

---

## 6. Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en el puerto 3000 vinculado a `0.0.0.0`.
- `npm run build`: Compila la aplicación optimizada para producción en el directorio `dist/`.
- `npm run lint`: Ejecuta el verificador de tipos de TypeScript (`tsc --noEmit`) para asegurar la ausencia de errores.
- `npm run preview`: Previsualiza localmente el build de producción generado.

---

## 7. Roles y Cuentas de Acceso

1. **Cliente / Visitante**:
   - Navegación libre por el catálogo de Damas y Caballeros.
   - Filtrado por precio, color, talla, categoría y estilo.
   - Guardado en lista de deseos (favoritos) y bolsa de compras.
   - Proceso de Checkout con múltiples métodos de pago (PSE, Nequi, Tarjetas, Contraentrega).
   - Consulta y radicación de tickets de PQRS a través del Concierge flotante.

2. **Administrador (`matematicaslzda@gmail.com`)**:
   - Acceso completo al botón **Panel Admin** en el menú de navegación.
   - **Gestión de Inventario**: Crear nuevas prendas, editar precios, stock, categorías e imágenes, o eliminar productos.
   - **Módulo de PQRS**: Visualizar todas las solicitudes radicadas por los clientes, cambiar su estado (*abierto*, *en_proceso*, *respondido*, *cerrado*) y responder mensajes de soporte directamente.

---

## 8. Licencia y Créditos

Desarrollado para **Aura & Elegance** — Colección de Alta Sastrería y Moda Contemporánea 2026.
