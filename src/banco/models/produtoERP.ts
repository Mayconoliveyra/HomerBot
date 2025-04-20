type Availability = 'AVAILABLE' | 'UNAVAILABLE';

export interface IProdutoERP {
  id: number;
  type: 'CATEGORY' | 'PRODUCT' | 'VARIATION_HEADER' | 'VARIATION_ITEM';

  empresa_id: number;

  erp_c_code: string | null; // Category code
  erp_c_name: string | null; // Category name
  erp_c_availability: Availability | null;

  erp_p_name: string | null; // Product name
  erp_p_description: string | null; // Product description
  erp_p_category_id: string | null; // Product Category ID
  erp_p_code: string | null; // Product code
  erp_p_price: number | null;
  erp_p_availability: Availability | null; // Availability status
  erp_p_stock_current: number | null; // Current stock
  erp_p_stock_active: boolean | null; // Whether stock is active
  erp_p_variations_grid: boolean | null; // Indicates if variations grid is enabled
  erp_p_images: string | null; // Variation Name

  erp_v_name: string | null; // Variation Name
  erp_v_required: boolean | null; // Whether the variation is required
  erp_v_items_min: number | null; // Minimum items allowed for variation
  erp_v_items_max: number | null; // Maximum items allowed for variation
  erp_v_availability: Availability | null; // Variation availability
  erp_v_ordem: number | null;
  erp_v_name_hash: string | null; // v_name codificado

  erp_vi_code: string | null; // Variation item code
  erp_vi_name: string | null; // Variation item name
  erp_vi_description: string | null; // Variation item description
  erp_vi_value: number | null; // Variation item value
  erp_vi_availability: Availability | null; // Variation item availability
  erp_vi_stock_current: number | null; // Variation item stock current
  erp_vi_stock_active: boolean | null; // Whether the variation item stock is active
}
