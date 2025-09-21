
import React from 'react';
import navbar from '../../components/navbar/navbar';
import './home.css';
import Header from '../../components/header/header';
import ExploreMenu from '../../components/exploremenu/exploremenu';

export default function Home() {
  const [category, setCategorie] = React.useState('All');
  return (
    <div>
     
     <Header />
     <ExploreMenu />
    </div>
  );
}