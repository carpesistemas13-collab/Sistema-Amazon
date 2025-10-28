const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class Brand {
  static async findAll() {
    const { data, error } = await supabase
      .from('brands')
      .select('*');
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(brand) {
    const { data, error } = await supabase
      .from('brands')
      .insert([brand])
      .single();
    if (error) throw error;
    return data;
  }

  static async update(id, brand) {
    const { data, error } = await supabase
      .from('brands')
      .update(brand)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { data, error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = Brand;