import React from "react";
import Slider from "react-slick";
import "./hero.css";
import { hero_images } from "../../assets/frontend_assets/assets";

function Hero() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // 🔥 enable arrows
    prevArrow: <button type="button" className="slick-prev">‹</button>,
    nextArrow: <button type="button" className="slick-next">›</button>,
    pauseOnHover: true,
  };

  return (
    <div className="hero">
      <Slider {...settings}>
        {hero_images.map((img, i) => (
          <div key={i} className="hero-slide">
            <img src={img} alt={`slide-${i}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;
