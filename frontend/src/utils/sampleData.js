// Sample data to populate your Supabase database
// Run these SQL commands in your Supabase SQL editor

export const sampleCategoriesSQL = `
-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Pizza', 'Delicious pizzas with various toppings', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300'),
('Burger', 'Juicy burgers with fresh ingredients', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300'),
('Pasta', 'Authentic Italian pasta dishes', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=300'),
('Salad', 'Fresh and healthy salad options', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300'),
('Dessert', 'Sweet treats and desserts', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300'),
('Beverage', 'Refreshing drinks and beverages', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300');
`;

export const sampleFoodItemsSQL = `
-- Insert sample food items
INSERT INTO food_items (name, description, price, image_url, category_id) VALUES
('Margherita Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil', 299, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400', (SELECT id FROM categories WHERE name = 'Pizza')),
('Pepperoni Pizza', 'Pizza topped with spicy pepperoni and cheese', 349, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', (SELECT id FROM categories WHERE name = 'Pizza')),
('Classic Burger', 'Beef patty with lettuce, tomato, and special sauce', 199, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', (SELECT id FROM categories WHERE name = 'Burger')),
('Chicken Burger', 'Grilled chicken breast with fresh vegetables', 229, 'https://images.unsplash.com/photo-1606755962773-d324e0c9b5cf?w=400', (SELECT id FROM categories WHERE name = 'Burger')),
('Spaghetti Carbonara', 'Creamy pasta with bacon and parmesan cheese', 279, 'https://images.unsplash.com/photo-1621996346565-e3dbc353d946?w=400', (SELECT id FROM categories WHERE name = 'Pasta')),
('Penne Arrabbiata', 'Spicy tomato pasta with garlic and chili', 259, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400', (SELECT id FROM categories WHERE name = 'Pasta')),
('Caesar Salad', 'Fresh romaine lettuce with caesar dressing and croutons', 189, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', (SELECT id FROM categories WHERE name = 'Salad')),
('Greek Salad', 'Mixed greens with feta cheese, olives, and olive oil', 219, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', (SELECT id FROM categories WHERE name = 'Salad')),
('Chocolate Cake', 'Rich chocolate cake with chocolate frosting', 149, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', (SELECT id FROM categories WHERE name = 'Dessert')),
('Tiramisu', 'Classic Italian dessert with coffee and mascarpone', 179, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', (SELECT id FROM categories WHERE name = 'Dessert')),
('Fresh Orange Juice', 'Freshly squeezed orange juice', 79, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', (SELECT id FROM categories WHERE name = 'Beverage')),
('Iced Coffee', 'Refreshing iced coffee with milk', 99, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', (SELECT id FROM categories WHERE name = 'Beverage'));
`;

// Instructions for setting up sample data
export const setupInstructions = `
To populate your Supabase database with sample data:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the sampleCategoriesSQL query first
4. Then run the sampleFoodItemsSQL query
5. Your database will now have sample categories and food items

You can also add more categories and food items through the Supabase dashboard or by creating an admin interface.
`;
