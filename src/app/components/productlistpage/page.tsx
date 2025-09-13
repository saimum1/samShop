// import React from 'react'
// import ProductlistPage from './ProductlistPage'

// function page() {
//   return (
//     <ProductlistPage/>
//   )
// }

// export default page



import React from 'react'
import { Product, ApiProduct } from './interfaceProductlist';
import axios from 'axios';
import config from '@/config';
import ProductListPage from './ProductlistPage';

export const revalidate = 60; 
 async function page () {
  const page = 1
  const PER_PAGE = 8;

  try {
    // const url = `${config.apiUrl}/api/product/clientproducts?page=${page}&perPage=${PER_PAGE}`;
    // console.log('Fetching initial data from:', url);
    // const response = await axios.get(url);
    // console.log('Initial API Response:In Server', response.data);
    // const { products: apiProducts, totalPages } = response.data;
    // const mappedProducts: Product[] = apiProducts.map((item: ApiProduct) => ({
    //   id: item.id,
    //   title: item.name,
    //   price: item.price,
    //   originalPrice: item.price,
    //   recentlyViewed: item.id === '68b07186b22a1e4f3014ac9f' && page === 1,
    //   image: item.imageink1,
    //   category: item.operator.name,
    // }));
 const url = `${config.apiUrl}/api/product/clientproducts?page=${page}&perPage=${PER_PAGE}`;
    const response = await fetch(url, { next: { revalidate: 60 } }); // ISR
    const data = await response.json();
    console.log("responsefromserver",data)
    const { products: apiProducts, totalPages } = data;

    const mappedProducts: Product[] = apiProducts.map((item: ApiProduct) => ({
      id: item.id,
      title: item.name,
      price: item.price,
      originalPrice: item.price,
      recentlyViewed: item.id === '68b07186b22a1e4f3014ac9f' && page === 1,
      image: item.imageink1,
      category: item.operator.name,
    }));
    return (
      <ProductListPage
        initialProducts={mappedProducts}
        totalPageNum={totalPages || 1}
      />
    );
  } catch (error) {
    <div>
      no data loaded
    </div>
  }
}export default page