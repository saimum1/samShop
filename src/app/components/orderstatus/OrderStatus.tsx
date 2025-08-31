"use client";
import React, { useEffect, useState } from 'react';
import styles from '../cart/cart.module.css';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ApiProduct } from '../productlistpage/interfaceProductlist';
import axios from 'axios';
import config from '@/config';
import moment from "moment";
import { order, orderiteminterface } from './interfacesOrderlist';


const getStatusStyle = (status: string) => {
    const baseStyle = {
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: '500',
      minWidth: '100px'
    };

    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          ...baseStyle,
          backgroundColor: '#d4edda',
          color: '#155724',
          animation: 'blink 1.5s infinite'
        };
        
      case 'processing':
        return {
          ...baseStyle,
          backgroundColor: '#cce7ff',
          color: '#004085',
          animation: 'blink 1s infinite'
        };
        
      case 'approved':
        return {
          ...baseStyle,
          backgroundColor: '#d4edda',
          color: '#155724'
        };
        
      case 'cancel':
        return {
          ...baseStyle,
          backgroundColor: '#f8d7da',
          color: '#721c24'
        };
        
      default:
        return baseStyle;
    }
  };

const OrderStatus: React.FC = () => {
  const { user, error, isLoading } = useUser();
  console.log("user order status",user)
  const[orderData,setorderData]=useState<order[]>([])

  const getOrder = async () => {
  try {
    const response = await axios.get(`${config.apiUrl}/api/product/order/bylead/${user?.email}`,);

    if (response?.data) {
      console.log("orde data",response.data)
      setorderData(response.data)
    }
  } catch (err) {
        toast.error("Order creation failed");
      setorderData([])

    
    }
  };

useEffect(() => {
    if(user)getOrder()
  
}, [user]);

  return (
    <div style={{width:'100%',paddingTop:'6rem',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
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
          <h1 className={styles.title}>Order Status</h1>
        </div>
      </div>

     
        <div style={{width:'90%',height:'100vh' ,overflow:'auto'}}>
        {orderData?.length > 0 && (
            orderData?.map((order) => (
                <div style={{ width:'100%', padding: '20px'}}>
                <div style={{width:'100%'}}>
                    <div style={{display: 'flex',
                    justifyContent: 'flex-start',
                    padding: '15px 20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px 8px 0 0',
                    fontWeight: '600',
                    fontSize: '16px',
                    gap:'20px',
                    color: '#6c757d',
                    marginBottom: '0'}}> 
                        <span>order id = {order?.orderid}</span>,
                        <span>order created = {moment(order?.created_at).format("YYYY-MM-DD  HH:mm:ss")}</span>
                </div>
                    <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                    gap: '10px',
                    padding: '15px 20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px 8px 0 0',
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#6c757d',
                    marginBottom: '0'
                    }}>
                    <div>Product Details</div>
                    <div style={{textAlign: 'center'}}>Quantity</div>
                    <div style={{textAlign: 'center'}}>Price</div>
                    <div style={{textAlign: 'center'}}>Total</div>
                    <div style={{textAlign: 'center'}}>Order ID</div>
                    <div style={{textAlign: 'center'}}>Order Status</div>
                    </div>

                    <div style={{ width:'100%',maxHeight:"50vh",minHeight:"15vh",overflow:'scroll'}}>
                    {order?.items?.map((item:orderiteminterface) => (
                        <div 
                            key={`${order.orderid}-${item.productid}`}
                            style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
                            gap: '10px',
                            padding: '20px',
                            backgroundColor:  '#F0F0F0',
                            color:  '#999999' ,
                            borderBottom: '1px solid #e9ecef',
                            alignItems: 'center'
                            }}
                        >
                            <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                            }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #e9ecef'
                            }}>
                                <img
                                src={item.image || ''}
                                alt={item.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                />
                            </div>
                            <div>
                                <div style={{
                                fontWeight: '600',
                                fontSize: '16px',
                                marginBottom: '4px',
                                color:'#999999' 
                                }}>
                                {item.name}
                                </div>
                                <div style={{
                                fontSize: '14px',
                                color:  '#999999' 
                                }}>
                                {item.operator?.name || 'Beverage'}
                                </div>
                            </div>
                            </div>

                        
                            <div style={{
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                            }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 16px',
                                border: '1px solid #e9ecef',
                                borderRadius: '8px',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <span style={{
                                minWidth: '30px',
                                textAlign: 'center',
                                fontWeight: '500'
                                }}>
                                {item.quantity.toString().padStart(2, '0')}
                                </span>
                            </div>
                            </div>
                            <div style={{
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: '600',
                            color:  '#999999'
                            }}>
                            ${item.price.toFixed(2)}
                            </div>
                            <div style={{
                            textAlign: 'center',
                            fontSize: '18px',
                            fontWeight: '700',
                            color:  '#999999' 
                            }}>
                            ${(item.price * item.quantity).toFixed(2)}
                            </div>

                            <div style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#999999' ,
                            fontFamily: 'monospace'
                            }}>
                            {order?.orderid.substring(0, 8)}...
                            </div>

                            <div style={{
                            textAlign: 'center',
                            fontSize: '14px',
                            color:  '#999999' 
                            }}>
                            <div style={getStatusStyle(order?.status)}>
                                    {order?.status === 'processing' ? 'Processing ⚡' : order?.status}
                            </div>
                            </div>


                        </div>
                        ))
                        }
                    </div>
                </div>
            </div>
            ))
        )}
        </div>
      
 <style>
        {`@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.4; } }`}
      </style>
    </div>
  );
};

export default OrderStatus;
