import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, FilterState, Gender } from '../models/types';
import { 
  getProductsFromFirestore, 
  subscribeToProducts, 
  filterAndSortProducts, 
  saveProduct, 
  deleteProduct 
} from '../models/productModel';
import { INITIAL_PRODUCTS } from '../models/seedData';

interface StoreContextType {
  products: Product[];
  filteredProducts: Product[];
  isLoadingProducts: boolean;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleSizeFilter: (size: string) => void;
  toggleColorFilter: (colorName: string) => void;
  toggleStyleFilter: (styleName: string) => void;
  resetFilters: () => void;
  setGender: (gender: Gender) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  activeView: 'store' | 'admin' | 'tracking';
  setActiveView: (view: 'store' | 'admin' | 'tracking') => void;
  formatPrice: (amount: number) => string;
  addProduct: (product: Partial<Product> & { name: string; price: number }) => Promise<Product>;
  removeProduct: (productId: string) => Promise<void>;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  gender: 'todos',
  category: 'Todas',
  sizes: [],
  colors: [],
  styles: [],
  priceRange: [0, 800000],
  sortBy: 'featured',
  onlyInStock: false,
  onlyOffers: false,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'store' | 'admin' | 'tracking'>('store');
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const load = async () => {
      try {
        const initial = await getProductsFromFirestore();
        setProducts(initial);
        unsubscribe = subscribeToProducts((prods) => {
          if (prods && prods.length) {
            setProducts(prods);
          }
        });
      } catch (err) {
        console.warn('Error loading products:', err);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    load();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSizeFilter = (size: string) => {
    setFilters(prev => {
      const exists = prev.sizes.includes(size);
      const newSizes = exists ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const toggleColorFilter = (colorName: string) => {
    setFilters(prev => {
      const exists = prev.colors.includes(colorName);
      const newColors = exists ? prev.colors.filter(c => c !== colorName) : [...prev.colors, colorName];
      return { ...prev, colors: newColors };
    });
  };

  const toggleStyleFilter = (styleName: string) => {
    setFilters(prev => {
      const exists = prev.styles.includes(styleName);
      const newStyles = exists ? prev.styles.filter(s => s !== styleName) : [...prev.styles, styleName];
      return { ...prev, styles: newStyles };
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setGender = (gender: Gender) => {
    setFilters(prev => ({ ...prev, gender }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const formatPrice = (amount: number) => {
    return `$ ${new Intl.NumberFormat('es-CO').format(amount)} COP`;
  };

  const addProduct = async (productData: Partial<Product> & { name: string; price: number }) => {
    const saved = await saveProduct(productData);
    setProducts(prev => {
      const existing = prev.findIndex(p => p.id === saved.id);
      if (existing > -1) {
        const next = [...prev];
        next[existing] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    return saved;
  };

  const removeProduct = async (productId: string) => {
    await deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filters);
  }, [products, filters]);

  return (
    <StoreContext.Provider
      value={{
        products,
        filteredProducts,
        isLoadingProducts,
        filters,
        setFilters,
        updateFilter,
        toggleSizeFilter,
        toggleColorFilter,
        toggleStyleFilter,
        resetFilters,
        setGender,
        selectedProduct,
        setSelectedProduct,
        wishlist,
        toggleWishlist,
        isInWishlist,
        activeView,
        setActiveView,
        formatPrice,
        addProduct,
        removeProduct,
        searchOpen,
        setSearchOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
