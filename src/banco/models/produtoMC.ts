type Availability = 'AVAILABLE' | 'UNAVAILABLE';

export interface IProdutoMC {
  id: number;
  type: 'CATEGORY' | 'PRODUCT' | 'VARIATION_HEADER' | 'VARIATION_ITEM';

  empresa_id: number;

  c_id: string | null; // Category UUID
  c_code: string | null; // Category code
  c_name: string | null; // Category name
  c_availability: Availability | null;

  p_id: string | null; // Product UUID
  p_name: string | null; // Product name
  p_description: string | null; // Product description
  p_category_id: string | null; // Product Category ID
  p_price: number | null;
  p_code: string | null; // Product code
  p_availability: Availability | null; // Availability status
  p_stock_current: number | null; // Current stock
  p_stock_active: boolean | null; // Whether stock is active
  p_variations_grid: boolean | null; // Indicates if variations grid is enabled

  v_id: string | null; // Variation ID
  v_name: string | null; // Variation Name
  v_required: boolean | null; // Whether the variation is required
  v_items_min: number | null; // Minimum items allowed for variation
  v_items_max: number | null; // Maximum items allowed for variation
  v_availability: Availability | null; // Variation availability
  v_name_hash: string | null; // v_name codificado

  vi_id: string | null; // Variation item ID
  vi_code: string | null; // Variation item code
  vi_name: string | null; // Variation item name
  vi_description: string | null; // Variation item description
  vi_value: number | null; // Variation item value
  vi_availability: Availability | null; // Variation item availability
  vi_stock_current: number | null; // Variation item stock current
  vi_stock_active: boolean | null; // Whether the variation item stock is active
}
