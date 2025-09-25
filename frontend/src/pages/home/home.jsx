import React from 'react';
import './home.css';
import ExploreMenu from '../../components/exploremenu/ExploreMenu';
import Hero from '../../components/hero/hero';
import FoodDisplay from '../../components/fooddisplay/fooddisplay';
import GradientDivider from '../../components/divider/divider';
import Footer from '../../components/footer/footer';

export default function Home() {
  const [category, setCategory] = React.useState('All');
  return (
    <div>
     <Hero />
      <ExploreMenu category={category} setCategory={setCategory} />
      
      <FoodDisplay category={category} />
      <GradientDivider />
      <Footer />
    </div>
  );
}
