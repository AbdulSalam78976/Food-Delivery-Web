import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./hero.css";
import  heroImagesService  from "./heroImages.js";

function Hero() {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        console.log('🔄 Starting to fetch hero images...');
        const { data, error } = await heroImagesService.getHeroImages();
        console.log('📊 Hero images data:', data);
        console.log('❌ Hero images error:', error);
        
        if (data && !error && data.length > 0) {
          console.log('✅ Setting hero images:', data);
          setHeroImages(data);
        } else if (data && data.length === 0) {
          console.warn('⚠️ Database returned empty array - no images in table');
          setHeroImages([]);
        } else {
          console.warn('❌ No hero images found in database. Data:', data, 'Error:', error);
          setHeroImages([]);
        }
      } catch (error) {
        console.error('💥 Error fetching hero images:', error);
        setHeroImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <button type="button" className="slick-prev">‹</button>,
    nextArrow: <button type="button" className="slick-next">›</button>,
    pauseOnHover: true,
  };

  if (loading) {
    return (
      <div className="hero">
        <div className="hero-loading">
          <p>Loading hero images...</p>
        </div>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="hero">
        <div className="hero-no-images">
          <h2>No Hero Images Available</h2>
          <p>Please upload some hero images to display here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero">
      <Slider {...settings}>
        {heroImages.map((img) => (
          <div key={img.id} className="hero-slide">
            <img 
              src={img.image} 
              alt={`hero-slide-${img.id}`}
              loading="lazy"
              onError={(e) => {
                // Hide broken images
                e.target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Hero;
