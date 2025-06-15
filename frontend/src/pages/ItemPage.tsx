import React from 'react';
import ProductItem from '../components/ProductItem';
import '../styles/ProductItem.css';
import RelatedProduct from '../components/RelatedProduct'; // Ensure this is a React component
import '../styles/RelatedProduct.css'; // Import your CSS file for styling

const ItemPage: React.FC = () => {
  return (
    <div>
      <ProductItem />
      <RelatedProduct excludeName="exampleName" />
    </div>
  );
};

export default ItemPage;