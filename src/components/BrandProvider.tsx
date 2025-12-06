import { createContext, useContext, type ReactNode } from 'react';
import type { Brand } from '../tokens';

interface BrandContextValue {
  brand: Brand;
}

const BrandContext = createContext<BrandContextValue | undefined>(undefined);

export interface BrandProviderProps {
  brand: Brand;
  children: ReactNode;
}

/**
 * BrandProvider wraps your application with a data-brand attribute
 * to enable brand-specific styling via CSS custom properties.
 */
export function BrandProvider({ brand, children }: BrandProviderProps) {
  return (
    <BrandContext.Provider value={{ brand }}>
      <div data-brand={brand}>{children}</div>
    </BrandContext.Provider>
  );
}

/**
 * Hook to access the current brand context
 */
export function useBrand(): Brand {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context.brand;
}

/**
 * Hook to optionally access the brand context (returns undefined if not in provider)
 */
export function useBrandOptional(): Brand | undefined {
  const context = useContext(BrandContext);
  return context?.brand;
}
