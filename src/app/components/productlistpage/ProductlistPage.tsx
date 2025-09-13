
// "use client";
// import React, { useState, useEffect ,FC, useCallback} from 'react';
// import { debounce } from 'lodash';
// import styles from './ProductListPage.module.css';
// import Link from 'next/link';
// import axios from 'axios';
// import config from '@/config';
// import { Product ,ApiProduct} from './interfaceProductlist';
// import RecentlyViewedProduct from '../recentViewed/RecentlyViewedProduct';
// import { productOne } from '../productdetails/interfaceproductone';
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '@/toolkit/cartSlice';

// const ProductListPage: FC = () => {
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [PER_PAGE, setPER_PAGE] = useState(8);
//   const [totalPages, setTotalPages] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [recentlyViewedProduct, setrecentlyViewedProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     console.log('API URL:', config.apiUrl);
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const url = `${config.apiUrl}/api/product/clientproducts?page=${currentPage}&perPage=${PER_PAGE}`;
//         console.log('Fetching from:', url);
//         const response = await axios.get(url);
//         console.log("dadad",response.data)
//         const { products: apiProducts, totalPages } = response.data;
//         const mappedProducts: Product[] = apiProducts.map((item: ApiProduct) => ({
//           id: item.id,
//           title: item.name,
//           price: item.price,
//           originalPrice: item.price, 
//           recentlyViewed: item.id === '68b07186b22a1e4f3014ac9f' && currentPage === 1, 
//           image: item.imageink1,
//           category: item.operator.name,
//         }));

//         setrecentlyViewedProduct(mappedProducts.find((p) => p.recentlyViewed) || null);
//         setProducts(mappedProducts);
//         setTotalPages(totalPages || 1);
//         console.log('API Products loaded:', mappedProducts);
//       } catch (err: unknown) {
//   let errorMessage: string;

//   if (axios.isAxiosError(err)) {
//     errorMessage = err.response
//       ? `API Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`
//       : `Network Error: ${err.message}`;
//   } else if (err instanceof Error) {
//     errorMessage = `Error: ${err.message}`;
//   } else {
//     errorMessage = 'An unknown error occurred';
//   }

//   setError(errorMessage);
//   console.error('Fetch error:', err);
// }
//  finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [currentPage]);


//   const handlePageChangeraw=useCallback((newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   }, [totalPages]);


//   const handlePageChange = debounce(handlePageChangeraw, 500);

//     const handleAddToCart = useCallback((producta:Product) => {
//       console.log("new product",producta)
//     if (!producta) return;
//     toast.success(`Added ${producta.title} to cart`);
//     dispatch(
//       addToCart({
//         id: producta.id,
//         name: producta.title,
//         price: producta.price,
//         image: producta.image ?? '',  
//         quantity: 1,   
//         category: producta.category
//       })
//     );
//     }, [dispatch]);
  
     


//   if (loading) return <div className={styles.loading}>Loading...</div>;
//   if (error) return <div className={styles.error}>{error}</div>;

  

//   return (
//     <div className={styles.container}>
//        <ToastContainer
//         position="top-right" 
//         autoClose={3000} 
//         hideProgressBar={false} 
//         newestOnTop={false} 
//         closeOnClick 
//         rtl={false} 
//         pauseOnFocusLoss 
//         draggable 
//         pauseOnHover 
//       />
//       {recentlyViewedProduct && 
//       <RecentlyViewedProduct product={recentlyViewedProduct} />}
//       <div className={styles.content}>
//         <div className={styles.grid}>
//           {products
//             ?.filter((p) => !p.recentlyViewed)
//             ?.map((product) => (
              
//                 <div className={styles.productCard} key={product.id}>
            
//                   {product.originalPrice && (
//                     <div className={styles.discountBadge}>OFF 11%</div>
//                   )}

//                 <Link href={`/components/productdetails?id=${product.id}`} key={product.id}>
//                   <div className={styles.productImageContainer}>
//                     <img
//                       src={product.image}
//                       alt={product.title}
//                       className={styles.productImage}
//                     />
                 
//                     <div className={styles.hoverActions}>
//                       <button className={styles.actionButton}>
//                         <span className={styles.compareIcon}>⇄</span>
//                       </button>
//                       <button className={styles.actionButton}>
//                         <span className={styles.heartIcon}>♡</span>
//                       </button>
//                     </div>
//                   </div>

//                 </Link>
//                   <div className={styles.productInfo}>
//                     <h3 className={styles.productTitle}>{product.title}</h3>
//                     <div className={styles.priceContainer}>
//                       <span className={styles.productPrice}>
//                         ${product.price.toFixed(2)}
//                       </span>
//                       {product.originalPrice && (
//                         <span className={styles.originalPrice}>
//                           ${product.originalPrice.toFixed(2)}
//                         </span>
//                       )}
//                     </div>

         
//                     <button className={styles.addToCart} onClick={() => handleAddToCart(product)}>Add To Cart</button>
//                   </div>
//                 </div>
            
//             ))}
//         </div>

//         <div className={styles.pagination}>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className={`${styles.button} ${styles.prevButton}`}
//           >
//             Previous
//           </button>

//           <div className={styles.pageNumbers}>
//             {currentPage > 2 && (
//               <>
//                 <button
//                   onClick={() => handlePageChange(1)}
//                   className={styles.pageButton}
//                 >
//                   1
//                 </button>
//                 {currentPage > 3 && <span className={styles.ellipsis}>...</span>}
//               </>
//             )}

//             {currentPage > 1 && (
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 className={styles.pageButton}
//               >
//                 {currentPage - 1}
//               </button>
//             )}

//             <span className={styles.currentPage}>{currentPage}</span>

//             {currentPage < totalPages && (
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 className={styles.pageButton}
//               >
//                 {currentPage + 1}
//               </button>
//             )}

//             {currentPage < totalPages - 1 && (
//               <>
//                 {currentPage < totalPages - 2 && (
//                   <span className={styles.ellipsis}>...</span>
//                 )}
//                 <button
//                   onClick={() => handlePageChange(totalPages)}
//                   className={styles.pageButton}
//                 >
//                   {totalPages}
//                 </button>
//               </>
//             )}
//           </div>

//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className={`${styles.button} ${styles.nextButton}`}
//           >
//             Next
//           </button>
//         </div>

//         <div className={styles.pageInfo}>
//           Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductListPage;













"use client";
import React, { useState, useEffect ,FC, useCallback} from 'react';
import { debounce } from 'lodash';
import styles from './ProductListPage.module.css';
import Link from 'next/link';
import axios from 'axios';
import config from '@/config';
import { Product ,ApiProduct} from './interfaceProductlist';
import RecentlyViewedProduct from '../recentViewed/RecentlyViewedProduct';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/toolkit/cartSlice';

interface ProductListPageProps {
  initialProducts: Product[];
  totalPageNum: number;
}

const ProductListPage: FC<ProductListPageProps> = ({initialProducts,totalPageNum}) => {
  console.log("newInitProducts",initialProducts)
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [PER_PAGE, setPER_PAGE] = useState(8);
  const [totalPages, setTotalPages] = useState(totalPageNum);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentlyViewedProduct, setrecentlyViewedProduct] = useState<Product | null>(null);


  const fetchProducts = useCallback(
      async (page: number) => {
      try {
        setLoading(true);
        const url = `${config.apiUrl}/api/product/clientproducts?page=${page}&perPage=${PER_PAGE}`;
        const response = await axios.get(url);
        const { products: apiProducts, totalPages } = response.data;

        const mappedProducts: Product[] = apiProducts.map((item: ApiProduct) => ({
          id: item.id,
          title: item.name,
          price: item.price,
          originalPrice: item.price,
          recentlyViewed: item.id === "68b07186b22a1e4f3014ac9f" && page === 1,
          image: item.imageink1,
          category: item.operator.name,
        }));

        setrecentlyViewedProduct(mappedProducts.find((p) => p.recentlyViewed) || null);
        setProducts(mappedProducts);
        setTotalPages(totalPages || 1);
      } catch (err: unknown) {
        let errorMessage: string;
        if (axios.isAxiosError(err)) {
          errorMessage = err.response
            ? `API Error: ${err.response.status} - ${err.response.data?.message || "Unknown error"}`
            : `Network Error: ${err.message}`;
        } else if (err instanceof Error) {
          errorMessage = `Error: ${err.message}`;
        } else {
          errorMessage = "An unknown error occurred";
        }
        setError(errorMessage);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    },
    [PER_PAGE]
  );

  const handlePageChangeraw=useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchProducts(newPage);
    }
  }, [totalPages,fetchProducts]);


  const handlePageChange = debounce(handlePageChangeraw, 500);

    const handleAddToCart = useCallback((producta:Product) => {
      console.log("new product",producta)
    if (!producta) return;
    toast.success(`Added ${producta.title} to cart`);
    dispatch(
      addToCart({
        id: producta.id,
        name: producta.title,
        price: producta.price,
        image: producta.image ?? '',  
        quantity: 1,   
        category: producta.category
      })
    );
    }, [dispatch]);
  
     


  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  

  return (
    <div className={styles.container}>
       <ToastContainer
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      {recentlyViewedProduct && 
      <RecentlyViewedProduct product={recentlyViewedProduct} />}
      <div className={styles.content}>
        <div className={styles.grid}>
          {products
            ?.filter((p) => !p.recentlyViewed)
            ?.map((product) => (
              
                <div className={styles.productCard} key={product.id}>
            
                  {product.originalPrice && (
                    <div className={styles.discountBadge}>OFF 11%</div>
                  )}

                <Link href={`/components/productdetails?id=${product.id}`} key={product.id}>
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

                </Link>
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

         
                    <button className={styles.addToCart} onClick={() => handleAddToCart(product)}>Add To Cart</button>
                  </div>
                </div>
            
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