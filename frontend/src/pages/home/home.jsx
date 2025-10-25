import React from 'react';
import './home.css';
import ExploreMenu from '../../components/exploremenu/exploremenu';
import Hero from '../../components/hero/hero';
import FoodDisplay from '../../components/fooddisplay/fooddisplay';
import GradientDivider from '../../components/divider/divider';
import Footer from '../../components/footer/footer';

export default function Home() {
  console.log('🏠 Home component is rendering...')
  const [category, setCategory] = React.useState('All');
  
  return (
    <div className="home-page">
      <section className="hero-section animate-fade-in">
        <Hero />
      </section>
      
      <section className="menu-section animate-slide-up">
        <ExploreMenu category={category} setCategory={setCategory} />
      </section>
      
      <section className="food-section animate-slide-up">
        <FoodDisplay category={category} />
      </section>
      
      <GradientDivider />
      <Footer />
    </div>
  );
}
