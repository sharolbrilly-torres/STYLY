import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, FilterState } from './types';
import { INITIAL_PRODUCTS } from './seedData';

const PRODUCTS_COLLECTION = 'products';

// Retrieve products with real-time sync or fallback to seed data
export async function getProductsFromFirestore(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
    // If empty, auto-seed products to Firestore
    await seedInitialProducts();
    return INITIAL_PRODUCTS;
  } catch (error) {
    console.warn('Firestore products fetch error or offline, using local data:', error);
    return INITIAL_PRODUCTS;
  }
}

export function subscribeToProducts(callback: (products: Product[]) => void) {
  try {
    return onSnapshot(collection(db, PRODUCTS_COLLECTION), (snapshot) => {
      if (!snapshot.empty) {
        const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        callback(prods);
      } else {
        callback(INITIAL_PRODUCTS);
      }
    }, (err) => {
      console.warn('Subscription error, using fallback:', err);
      callback(INITIAL_PRODUCTS);
    });
  } catch {
    callback(INITIAL_PRODUCTS);
    return () => {};
  }
}

export async function seedInitialProducts() {
  try {
    for (const product of INITIAL_PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
    }
  } catch (err) {
    console.error('Error seeding initial products to Firestore:', err);
  }
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number }): Promise<Product> {
  const newProduct: Product = {
    id: product.id || `prod-${Date.now()}`,
    name: product.name,
    subtitle: product.subtitle || '',
    description: product.description || '',
    details: product.details || ['Confección artesanal de alta calidad'],
    fabric: product.fabric || 'Fibras naturales premium',
    careInstructions: product.careInstructions || 'Limpieza recomendada para prendas finas',
    gender: product.gender || 'dama',
    category: product.category || 'Vestidos',
    style: product.style || 'Casual Chic',
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    sizes: product.sizes && product.sizes.length ? product.sizes : ['S', 'M', 'L'],
    colors: product.colors && product.colors.length ? product.colors : [{ name: 'Verde Oliva', hex: '#3E503B', class: 'bg-[#3E503B]' }],
    images: product.images && product.images.length ? product.images : ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    inStock: product.inStock !== undefined ? product.inStock : true,
    stockCount: product.stockCount !== undefined ? Number(product.stockCount) : 10,
    featured: Boolean(product.featured),
    isNewArrival: Boolean(product.isNewArrival),
    isBestSeller: Boolean(product.isBestSeller),
    rating: product.rating || 5.0,
    reviewsCount: product.reviewsCount || 1,
    createdAt: product.createdAt || new Date().toISOString()
  };

  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, newProduct.id), newProduct);
  } catch (err) {
    console.warn('Could not save product in Firestore, local cache updated:', err);
  }
  return newProduct;
}

export async function updateProductStock(productId: string, newStock: number): Promise<void> {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(ref, { 
      stockCount: newStock, 
      inStock: newStock > 0 
    });
  } catch (err) {
    console.warn('Error updating product stock:', err);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (err) {
    console.warn('Error deleting product from Firestore:', err);
  }
}

// Pure filter logic (MVC Model method)
export function filterAndSortProducts(products: Product[], filters: FilterState): Product[] {
  return products.filter(product => {
    // 1. Search Query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchStyle = product.style.toLowerCase().includes(q);
      const matchFabric = product.fabric?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCategory && !matchStyle && !matchFabric) {
        return false;
      }
    }

    // 2. Gender Filter
    if (filters.gender !== 'todos') {
      if (product.gender !== filters.gender && product.gender !== 'unisex') {
        return false;
      }
    }

    // 3. Category Filter
    if (filters.category && filters.category !== 'Todas') {
      if (product.category !== filters.category) {
        return false;
      }
    }

    // 4. Size Filter (Talla)
    if (filters.sizes.length > 0) {
      const hasSelectedSize = filters.sizes.some(size => product.sizes.includes(size));
      if (!hasSelectedSize) return false;
    }

    // 5. Color Filter
    if (filters.colors.length > 0) {
      const hasSelectedColor = filters.colors.some(colorName => 
        product.colors.some(c => c.name.toLowerCase().includes(colorName.toLowerCase()))
      );
      if (!hasSelectedColor) return false;
    }

    // 6. Custom Style Filter (Estilo Personalizado)
    if (filters.styles.length > 0) {
      if (!filters.styles.includes(product.style)) {
        return false;
      }
    }

    // 7. Price Range Filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // 8. In Stock Only
    if (filters.onlyInStock && (!product.inStock || product.stockCount <= 0)) {
      return false;
    }

    // 9. Offers / Discounts Only
    if (filters.onlyOffers && (!product.originalPrice || product.originalPrice <= product.price)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'featured':
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating - a.rating);
    }
  });
}
