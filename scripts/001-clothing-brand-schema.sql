-- Clothing Export Brand Database Schema
-- Multi-language support for EN, AR, CN, UR, ES

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create order status enum
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'failed');

-- Profiles table (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table with multi-language support
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_en TEXT,
  name_ar TEXT,
  name_cn TEXT,
  name_ur TEXT,
  name_es TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table with multi-language support
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title TEXT NOT NULL,
  title_en TEXT,
  title_ar TEXT,
  title_cn TEXT,
  title_ur TEXT,
  title_es TEXT,

  description TEXT,
  description_en TEXT,
  description_ar TEXT,
  description_cn TEXT,
  description_ur TEXT,
  description_es TEXT,

  price NUMERIC(10,2) NOT NULL,
  compare_price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',

  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  image_url TEXT,
  images TEXT[] DEFAULT '{}',

  sku TEXT,
  stock INTEGER DEFAULT 0,

  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  stripe_price_id TEXT,

  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  items JSONB DEFAULT '[]',
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status order_status DEFAULT 'pending',
  shipping_address JSONB,
  customer_email TEXT,
  customer_name TEXT,
  invoice_url TEXT,
  payment_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- AI Knowledge Base table
CREATE TABLE ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  content TEXT NOT NULL,
  content_en TEXT,
  content_ar TEXT,
  content_cn TEXT,
  content_ur TEXT,
  content_es TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_value TEXT,
  page TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Products policies (public read)
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all products" ON products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Orders can be created by anyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders can be updated by system" ON orders
  FOR UPDATE USING (true);

-- Cart policies
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- AI Knowledge Base policies (public read)
CREATE POLICY "Knowledge base is viewable by everyone" ON ai_knowledge_base
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage knowledge base" ON ai_knowledge_base
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Analytics policies
CREATE POLICY "Analytics can be inserted by anyone" ON analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view analytics" ON analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart_items(user_id);
CREATE INDEX idx_cart_session ON cart_items(session_id);
CREATE INDEX idx_analytics_event ON analytics(event_name);
CREATE INDEX idx_analytics_page ON analytics(page);
