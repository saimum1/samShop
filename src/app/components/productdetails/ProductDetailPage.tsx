"use client";
import { useEffect, useState ,useMemo} from 'react';
import styles from './productdetails.module.css';
import { productOne } from './interfaceproductone';
type Props={
  productdata: productOne | null
}
  type ImageKey = 'image1' | 'image2' | 'image3' | 'image4';
export default function ProductDetailPage({productdata}: Props) {

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [product, setproduct] = useState<productOne | null>(null);

  console.log("productdata",productdata)
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleAddToWishlist = () => {
    alert("Added to wishlist");
  };

  const handleAddToCompare = () => {
    alert("Added to compare");
  };

  const totalPrice = useMemo(() => {
  return (productdata?.price ?? 0) * quantity;
}, [productdata?.price, quantity]);


  useEffect(() => {
    setproduct(productdata);
    setSelectedImage(productdata?.image1 || null);
  }, [productdata]);


  return (
    <div className={styles.container}>
      <div className={styles.productContainer}>
        <div className={styles.imagesSection}>
          <div className={styles.mainImage}>
           {selectedImage && (
            <img  
              src={selectedImage} 
              alt={'image'}
              width={600}
              height={600}
              className={styles.productImage}
            />
           )}
          </div>
          {product && (
          <div className={styles.thumbnailContainer}>
            {(['image1','image2','image3','image4'] as ImageKey[]).map((imgname) => (
              <div 
                key={imgname}
                className={`${styles.thumbnail} ${selectedImage === product?.[imgname] ? styles.activeThumbnail : ''}`}
                onClick={() => setSelectedImage(product?.[imgname] ?? null)}
              >
                <img 
                  src={product?.[imgname] ?? ''} 
                  alt={imgname}
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
            )}
        </div>

       {product && (     
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product?.name}</h1>
          {/* <div className={styles.price}>${(product &&  product?.price  * (0 || quantity)).toFixed(2)}</div> */}
          <div className={styles.price}>${totalPrice?.toFixed(2)}</div>

          
          
          {/* <p className={styles.description}>{product?.description}</p> */}
          
          <div className={styles.quantitySection}>
            <span className={styles.quantityLabel}>Quantity:</span>
            <div className={styles.quantityControl}>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className={styles.quantityValue}>{quantity}</span>
              <button 
                className={styles.quantityButton}
                onClick={() => handleQuantityChange('increase')}
              >
                +
              </button>
            </div>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              className={styles.addToCartButton}
              onClick={handleAddToCart}
              disabled={!product?.inStock}
            >
              {product?.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
            
            <div className={styles.secondaryActions}>
              <button className={styles.secondaryButton} onClick={handleAddToWishlist}>
                <span className={styles.icon}>❤️</span> Add to wishlist
              </button>
              <button className={styles.secondaryButton} onClick={handleAddToCompare}>
                <span className={styles.icon}>⚖️</span> Add to compare
              </button>
            </div>
          </div>
          
          <div className={styles.categoriesSection}>
            <span className={styles.categoriesLabel}>Categories:</span>
            <div className={styles.categories}>
              {product?.operator?.name}
            </div>
          </div>
          
          <div className={styles.shareSection}>
            <span className={styles.shareLabel}>Share:</span>
            <div className={styles.shareButtons}>
              <button className={styles.shareButton}>📱</button>
              <button className={styles.shareButton}>📧</button>
              <button className={styles.shareButton}>🔗</button>
            </div>
          </div>
        </div>)} 
      </div>
    </div>
  );
}
