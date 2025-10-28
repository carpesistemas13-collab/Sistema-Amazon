const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class Lens {
  static async findAll(filters = {}) {
    let query = supabase.from('lenses').select('*');

    if (filters.brand) {
      query = query.eq('brand_id', filters.brand);
    }
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.minStock) {
      query = query.gte('stock', filters.minStock);
    }
    if (filters.maxStock) {
      query = query.lte('stock', filters.maxStock);
    }
    if (filters.numeroLote) {
      query = query.eq('numeroLote', filters.numeroLote);
    }
    if (filters.estado) {
      query = query.eq('estado', filters.estado);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('lenses')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(lens) {
    const { data, error } = await supabase
      .from('lenses')
      .insert([lens])
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, lens) {
    const { data, error } = await supabase
      .from('lenses')
      .update(lens)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from('lenses')
      .delete()
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async updateStock(id, quantity) {
    const { data: currentLens, error: findError } = await supabase
      .from('lenses')
      .select('stock')
      .eq('id', id)
      .single();

    if (findError) throw findError;

    const newStock = currentLens.stock + quantity;

    const { data, error } = await supabase
      .from('lenses')
      .update({ stock: newStock })
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Lens;