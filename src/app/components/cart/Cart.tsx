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

const Cart: React.FC = () => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const[paymentStatus,setPaymentStatus]=useState(false)
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  console.log("items",items)
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        if(!user) {
            router.push("/auth/login");
            return;
        }
            const phoneNumber = "8801757963889"; 
            const messageItems = items.map(
            (i) => `${i.name} x${i.quantity} - $${(i.price * i.quantity).toFixed(2)}`
            ).join("\n");
            const message = `Hello Rakibul, I would like to order the following items:\n${messageItems}\nSubtotal: $${subtotal.toFixed(2)}`;
            const whatsappLink = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            const fallbackLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            const newWindow = window.open("about:blank", "_blank");
            if (newWindow) {
            const start = Date.now();
            newWindow.location.href = whatsappLink;
            setTimeout(() => {
                if (Date.now() - start < 2100) {
                newWindow.location.href = fallbackLink;
                }else{
                      setPaymentStatus(true)
                      dispatch(clearCart()); 
                      toast.success("Order sent! Redirecting to home...");
                        setTimeout(() => {
                            // router.push("/");
                        }, 2000);
                }
            }, 2000);
            } else {
            window.location.href = fallbackLink;
            }
  };

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
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Cart</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.cartSection}>
          <div className={styles.tableHeader}>
            <div className={styles.productHeader}>Product Details</div>
            <div className={styles.quantityHeader}>Quantity</div>
            <div className={styles.priceHeader}>Price</div>
            <div className={styles.totalHeader}>Total</div>
          </div>

          <div className={styles.cartItems}>
            {items?.map((item) => (
              <div key={item.id} className={styles.cartItem}>
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
                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                    onClick={() => dispatch(removeFromCart(item.id))}

                >
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

            <button className={styles.checkoutBtn} onClick={paymentStatus === true ? undefined : handleCheckout} style={{backgroundColor:paymentStatus === true ? 'green' : 'red'}}>
              {paymentStatus === true ?'Payment Done' : 'Check Out'}
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
    </div>
  );
};

export default Cart;