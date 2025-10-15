import React, { useContext } from "react";
import "./exploremenu.css";
import { StoreContext } from "../context/storecontext";

function ExploreMenu({ category, setCategory }) {
  const { categories, loading } = useContext(StoreContext);

  const handleClick = (itemName) => {
    setCategory((prev) => (prev === itemName ? "All" : itemName));
  };

  if (loading) {
    return (
      <div className="explore-menu" id="explore-menu">
        <h1>Explore Our Menu</h1>
        <div className="loading">
          <p>Loading menu categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p>
        Explore a wide range of delicious meals prepared with the finest ingredients,
        from sizzling starters and mouthwatering main courses to refreshing drinks and
        indulgent desserts. Whether you're in the mood for something classic or looking
        to try something new, our menu has been designed to satisfy every craving and
        deliver a truly unforgettable dining experience right to your doorstep.
      </p>

      <div className="menu-list">
        {/* All categories option */}
        <div
          className={`menu-item ${category === "All" ? "active" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => handleClick("All")}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && handleClick("All")
          }
        >
          <img src="/assets/frontend_assets/menu_1.png" alt="All Items" />
          <h3>All Items</h3>
        </div>

        {/* Dynamic categories from Supabase */}
        {categories.map((item, index) => (
          <div
            key={item.id}
            className={`menu-item ${
              category === item.name ? "active" : ""
            }`}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(item.name)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && handleClick(item.name)
            }
          >
            <img 
              src={item.image_url || "/assets/frontend_assets/menu_1.png"} 
              alt={item.name} 
            />
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreMenu;
