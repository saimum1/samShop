"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './cart.module.css';
import { useDispatch,useSelector } from "react-redux";
import { addToCart, clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from "@/toolkit/cartSlice"; 
import { RootState } from '@/toolkit/cartStore';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ApiProduct } from '../productlistpage/interfaceProductlist';
import axios from 'axios';
import config from '@/config';
import RecordLoading from '../loader/Loader';

interface orderProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  leadname: string;
  leademail: string;
}

const Cart: React.FC = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  console.log("user",user)
  const[paymentStatus,setPaymentStatus]=useState(false)
  const[isloading,setisloading]=useState<boolean>(false)
  const[loadingText,setloadingText]=useState<string>('')

  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  console.log("items",items)
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);



  const createOrder = async (items: orderProduct[]) => {
  try {
    
    const payload = {
      leadname: user?.name,
      leademail: user?.email,
      items: items.map(item => ({
        productid: item.id, 
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
        category: item.category, 
        leadname: user?.name,
        leademail: user?.email
      })),
    };
 
    const response = await axios.post(`${config.apiUrl}/api/product/order`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response?.data) {
      toast.success("Order created successfully");
      setPaymentStatus(true)

      setisloading(true)
      setloadingText('Order processing...')
      setTimeout(() => {
        dispatch(clearCart())
        setisloading(false)
        setloadingText('')
        router.push("/components/orderstatus")
      }, 5000);

      console.log("dataxaxx",response.data)
      return response.data; 
      
    }
  } catch (err) {
         setPaymentStatus(false)
        toast.error("Order creation failed");
    
    }
  };

    const handleCheckout = async() => {
        if(!user) {
            router.push("/auth/login");
            return;
        }
        try {
          await createOrder(items as orderProduct[]);
        } catch (err) {
          toast.error("Order creation failed");
        }
   
  };

  return (
    <div className={styles.container}>
         <RecordLoading isloading={isloading} loadingtext={loadingText}/>
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
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Cart</h1>
        </div>
      </div>

    {items?.length > 0 ? 
      <div className={styles.content} style={{pointerEvents:paymentStatus===true?'none':undefined}}>
        <div className={styles.cartSection} >
          <div className={styles.tableHeader}>
            <div className={styles.productHeader}>Product Details</div>
            <div className={styles.quantityHeader}>Quantity</div>
            <div className={styles.priceHeader}>Price</div>
            <div className={styles.totalHeader}>Total</div>
          </div>

          <div className={styles.cartItems}>
            {items?.map((item) => (
              <div key={item.id} className={styles.cartItem} style={{backgroundColor:paymentStatus===true? '#F0F0F0':undefined,color:paymentStatus===true?'#999999':undefined}} >
                <div className={styles.productDetails}>
                  <div className={styles.productImage} >
                     <div style={{height:'4rem',width:'4rem',backgroundColor:'red',display:'flex',justifyContent:'flex-start',alignItems:'start'}}>
                            <img
                                src={item.image || ''}
                                alt={item.name}
                                width={70}
                                height={70}
                            />
                     </div>
                  </div>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{item.name}</div>
                    <div className={styles.productCode}>{item.category}</div>
                  </div>
                </div>

                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityBtn}
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    disabled
                    value={item.quantity.toString().padStart(2, '0')}
                    className={styles.quantityInput}
                  />
                  <button
                    className={styles.quantityBtn}
                    onClick={() => dispatch(increaseQuantity(item.id))}
                  >
                    +
                  </button>
                </div>

                <div className={styles.price}>${item.price.toFixed(2)}</div>
                <div className={styles.total}>${(item.price * item.quantity).toFixed(2)}</div>
                <button
                  className={styles.removeBtn}
                  onClick={() => dispatch(removeFromCart(item.id))} >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.totalSection}>
            <h3 className={styles.totalTitle}>Total</h3>
            
            <div className={styles.totalRow}>
              <span>Sub-Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.deliverySection}>
              <div className={styles.deliveryHeader}>
                <span>Delivery</span>
                <button className={styles.infoBtn}>ⓘ</button>
              </div>
              <div className={styles.deliveryOption}>
                <span>Standard Delivery (Free)</span>
                <button className={styles.expandBtn}>⌄</button>
              </div>
            </div>

            <button disabled={items?.length >0?false:true} className={styles.checkoutBtn} onClick={paymentStatus === true ? undefined : handleCheckout} style={{backgroundColor:paymentStatus === true ? 'green' : 'red'}}>
              {paymentStatus === true ?'order placed' : 'Check Out'}
            </button>

            <div className={styles.paymentMethods}>
              <h4 className={styles.paymentTitle}>We Accept</h4>
              <div className={styles.paymentIcons}>
                <div className={styles.paymentIcon} style={{backgroundColor:'#279e27',color:'white'}}>WhatsApp Only! 😅</div>
                <div className={styles.paymentIcon}>Stripe</div>
                <div className={styles.paymentIcon}>Apple Pay</div>
                <div className={styles.paymentIcon}>WebMoney</div>
              </div>
            </div>

            <div className={styles.discount}>
              Got A discount code? add in the next step
            </div>
          </div>
        </div>
      </div>
    : <div style={{width:'100%',height:'60vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'3rem'}}>
        <span style={{color:'#c2bfbff9'}}>  No item found</span> 
      </div>}
    </div>
  );
};

export default Cart;