"use client";
import { useEffect, useState ,useMemo} from 'react';
import styles from './productdetails.module.css';
import { productOne } from './interfaceproductone';
import { useSearchParams } from 'next/navigation';
import { ApiProduct } from '../productlistpage/interfaceProductlist';
import axios from 'axios';
import config from '@/config';
import { useDispatch ,useSelector } from "react-redux";
import { addToCart } from "@/toolkit/cartSlice";
import { RootState } from '@/toolkit/cartStore';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const mapApiDataToProductOne = (apiData: ApiProduct): productOne => ({
  id: apiData.id,
  name: apiData.name,
  price: apiData.price,
  description: apiData.description,
  image1: apiData.imageink1,
  image2: apiData.imageink2,
  image3: apiData.imageink3,
  image4: apiData.imageink4,
  operator: {
    id: apiData.operator.id,
    code: apiData.operator.code,
    logo: apiData.operator.logo,
    name: apiData.operator.name,
    status: apiData.operator.status,
  },
  lotNo: apiData.lotNo,
  quantity: apiData.quantity,
  categoryId: apiData.categoryId,
  inStock: apiData.status, 
});

type ImageKey = 'image1' | 'image2' | 'image3' | 'image4';

const ProductDetailPage=()=> {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [product, setproduct] = useState<productOne | null>(null);
  const { items } = useSelector((state: RootState) => state.cart);
  console.log("itemsfrom",items)

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
  if (!product) return;
  toast.success(`Added ${quantity} ${product.name}(s) to cart`);
  dispatch(
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image1 ?? '',  
      quantity: quantity,   
      category: product.operator.name  
    })
  );

   
  
};

  const handleAddToWishlist = () => {
    alert("Added to wishlist");
  };

  const handleAddToCompare = () => {
    alert("Added to compare");
  };

  const totalPrice = useMemo(() => {
  return (product?.price ?? 0) * quantity;
  }, [product?.price, quantity]);


  useEffect(() => {
    if (!id) return;
    const loadProduct = async () => {
      try {
        const url = `${config.apiUrl}/api/product/getone/${id}`;
        const response = await axios.get(url);
        if (response?.data?.products?.[0]) {
            console.log("a323232",response?.data?.products?.[0])
            setproduct(mapApiDataToProductOne(response.data.products[0]));
            setSelectedImage(response.data.products[0].imageink1);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    loadProduct();
  }, [id]);


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


export default ProductDetailPage