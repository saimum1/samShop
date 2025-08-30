"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './cart.module.css';
import { useDispatch,useSelector } from "react-redux";
import { addToCart, decreaseQuantity, increaseQuantity, removeFromCart } from "@/toolkit/cartSlice"; 
import { RootState } from '@/toolkit/cartStore';


const Cart: React.FC = () => {

  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  console.log("items",items)
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    // Handle checkout
    console.log('Checkout clicked');
  };

  return (
    <div className={styles.container}>
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

            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Check Out
            </button>

            <div className={styles.paymentMethods}>
              <h4 className={styles.paymentTitle}>We Accept</h4>
              <div className={styles.paymentIcons}>
                <div className={styles.paymentIcon}>PayPal</div>
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