import React from 'react';
import './exploremenu.css';
import { menu_list } from '../../assets/frontend_assets/assets';

function ExploreMenu({ category, setCategory }) {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p>
        Explore a wide range of delicious meals prepared with the finest ingredients,
        from sizzling starters and mouthwatering main courses to refreshing drinks and
        indulgent desserts. Whether you’re in the mood for something classic or looking
        to try something new, our menu has been designed to satisfy every craving and
        deliver a truly unforgettable dining experience right to your doorstep.
      </p>

      <div className="menu-list">
        {menu_list.map((item, index) => (
          <div
            key={index}
            className={`menu-item ${category === item.menu_name ? 'active' : ''}`}
            onClick={() =>
              setCategory((prev) =>
                prev === item.menu_name ? 'All' : item.menu_name
              )
            }
          >
            <img src={item.menu_image} alt={item.menu_name} />
            <h3>{item.menu_name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreMenu;
