"use client"
import React, { useState } from 'react'
import styles from '../productlistpage/ProductListPage.module.css';
import { Product } from '../productlistpage/interfaceProductlist';
type Props = {
    product: Product
}

const RecentlyViewedProduct = (props: Props) => {
  
  
    const [showRecentlyViewed, setShowRecentlyViewed] = useState<boolean>(true);
    const [recentlyViewedProduct, setrecentlyViewedProduct] = useState<Product | null>(props?.product);


    const handleCloseRecentlyViewed = () => {
        setShowRecentlyViewed(false);
    };

  return (
    <>
    {showRecentlyViewed && recentlyViewedProduct && (
            <div className={styles.recentlyViewed}>
            <button className={styles.closeButton} onClick={handleCloseRecentlyViewed}>
                ×
            </button>
            <div className={styles.recentlyViewedImage}>
                <img src={recentlyViewedProduct?.image} alt={recentlyViewedProduct?.title} />
            </div>
            <div className={styles.recentlyViewedText}>
                <div className={styles.productName}>{recentlyViewedProduct.title}</div>
                <div className={styles.purchaseInfo}>Someone purchased from Tokyo</div>
            </div>
            </div>
        )}
    </>
  )
}

export default RecentlyViewedProduct