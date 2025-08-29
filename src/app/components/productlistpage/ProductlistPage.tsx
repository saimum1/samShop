
"use client";
import React, { useState, useEffect ,FC} from 'react';
import styles from './ProductListPage.module.css';
import Link from 'next/link';
import axios from 'axios';
import config from '@/config';
import { Product ,ApiProduct} from './interfaceProductlist';
import RecentlyViewedProduct from '../recentViewed/RecentlyViewedProduct';

const ProductListPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [PER_PAGE, setPER_PAGE] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyViewedProduct, setrecentlyViewedProduct] = useState<Product | null>(null);

  useEffect(() => {
    console.log('API URL:', config.apiUrl);
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `${config.apiUrl}/api/product/clientproducts?page=${currentPage}&perPage=${PER_PAGE}`;
        console.log('Fetching from:', url);
        const response = await axios.get(url);
        const { products: apiProducts, totalPages } = response.data;
        const mappedProducts: Product[] = apiProducts.map((item: ApiProduct) => ({
          id: item.id,
          title: item.name,
          price: item.price,
          originalPrice: item.price, 
          recentlyViewed: item.id === '68b07186b22a1e4f3014ac9f' && currentPage === 1, 
          image: item.imageink1,
        }));

        setrecentlyViewedProduct(mappedProducts.find((p) => p.recentlyViewed) || null);
        setProducts(mappedProducts);
        setTotalPages(totalPages || 1);
        console.log('API Products loaded:', mappedProducts);
      } catch (err: unknown) {
  let errorMessage: string;

  if (axios.isAxiosError(err)) {
    errorMessage = err.response
      ? `API Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`
      : `Network Error: ${err.message}`;
  } else if (err instanceof Error) {
    errorMessage = `Error: ${err.message}`;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  setError(errorMessage);
  console.error('Fetch error:', err);
}
 finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  

  return (
    <div className={styles.container}>
      {recentlyViewedProduct && 
      <RecentlyViewedProduct product={recentlyViewedProduct} />}
      <div className={styles.content}>
        <div className={styles.grid}>
          {products
            ?.filter((p) => !p.recentlyViewed)
            ?.map((product) => (
              <Link href={`/components/productdetails?id=${product.id}`} key={product.id}>
                <div className={styles.productCard}>
            
                  {product.originalPrice && (
                    <div className={styles.discountBadge}>OFF 11%</div>
                  )}

                
                  <div className={styles.productImageContainer}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className={styles.productImage}
                    />
                 
                    <div className={styles.hoverActions}>
                      <button className={styles.actionButton}>
                        <span className={styles.compareIcon}>⇄</span>
                      </button>
                      <button className={styles.actionButton}>
                        <span className={styles.heartIcon}>♡</span>
                      </button>
                    </div>
                  </div>

          
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <div className={styles.priceContainer}>
                      <span className={styles.productPrice}>
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className={styles.originalPrice}>
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

         
                    <button className={styles.addToCart}>Add To Cart</button>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.button} ${styles.prevButton}`}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className={styles.pageButton}
                >
                  1
                </button>
                {currentPage > 3 && <span className={styles.ellipsis}>...</span>}
              </>
            )}

            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={styles.pageButton}
              >
                {currentPage - 1}
              </button>
            )}

            <span className={styles.currentPage}>{currentPage}</span>

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={styles.pageButton}
              >
                {currentPage + 1}
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className={styles.ellipsis}>...</span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={styles.pageButton}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.button} ${styles.nextButton}`}
          >
            Next
          </button>
        </div>

        <div className={styles.pageInfo}>
          Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;