"use client";
import { RootState } from '@/toolkit/cartStore';
import { faCaretDown, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { useUser } from '@auth0/nextjs-auth0';

const Navbar = () => {
  const { user, error, isLoading } = useUser();
  console.log("user",user)
  const router = useRouter();
  const items=useSelector((state: RootState) => state.cart.items);
  const subtotal = items?.reduce((sum, item) => sum + item.quantity, 0);
  const [showLogout, setShowLogout] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickedItem, setClickedItem] = useState('Highlights');
  const [resumeLink, setResumeLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [hasShadow, setHasShadow] = useState(false);
  const [mounted, setmounted] = useState(false);
   useEffect(() => {
    setmounted(true);
  }, []);

  const styles = { background: '#f7f0ed',
    text: '#0b3449ff',
    cardBackground: '#ffffff',
    cardBackgroundShadow: ' 0 2px 4px  rgba(0, 0, 0, 0.1)',
    cardBackgroundHoverShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    navbarBackground: 'transparent',
    navbarShadow: 'rgba(0, 0, 0, 0.06)',
    hoverBackground: '#ffcece',
    textSecondary: '#7A8389',
    imageShadow:'0 4px 10px rgba(0, 0, 0, 0.28)',
    buttonShadow:'0 5px 7px rgba(0, 0, 0, 0.1)', 
    buttonBacnground:'#fff',

  //   light: {
  //   background: '#f7f0ed',
  //   text: '#6C757D',
  //   cardBackground: '#ffffff',
  //   cardBackgroundShadow: ' 0 2px 4px  rgba(0, 0, 0, 0.1)',
  //   cardBackgroundHoverShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  //   navbarBackground: 'transparent',
  //   navbarShadow: 'rgba(0, 0, 0, 0.06)',
  //   hoverBackground: '#ffcece',
  //   textSecondary: '#7A8389',
  //   imageShadow:'0 4px 10px rgba(0, 0, 0, 0.28)',
  //   buttonShadow:'0 5px 7px rgba(0, 0, 0, 0.1)', 
  //   buttonBacnground:'#fff',

  // },
  // dark: {
  //   background: '#1a202c',
  //   text: '#caced1',
  //   cardBackground: '#2d3748',
  //   cardBackgroundShadow:'0px 3px 15px rgba(31, 38, 135, 0.37)',
  //   cardBackgroundHoverShadow: '0 2px 10px #b7bcc0ff',
  //   navbarBackground: 'rgba(26, 32, 44, 0.8)',
  //   navbarShadow: 'rgba(255, 255, 255, 0.06)',
  //   hoverBackground: '#4a5568',
  //   textSecondary: '#a0aec0',
  //   imageShadow:'0 4px 8px #a0aec066',
  //   buttonBacnground:'#fff',
  //   buttonShadow:'0 2px 4px #BB86FC',

  // }
}


  const redirectToPage = (item: string, route: string) => {
    setClickedItem(item);
    router.push(route)
  };

  const itemList = [
    { item: 'Highlights', route: '/' },
    { item: 'Shops', route: '/components/productlistpage' }
  ];



  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHasShadow(scrollTop > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);





  return (
    <div
      className={`navbar ${hasShadow ? 'shadow' : ''}`}
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        zIndex: 999,
        transition: 'all 0.4s ease',
        backdropFilter: hasShadow ? 'blur(3px)' : 'none',
        
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '80%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      
        <div
          style={{
            flex: 1.5,
            display: 'flex',
            gap: '3%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            color: styles.textSecondary,
            fontWeight: '700',
          }}
        >
          {itemList.map((i) => (
            <span
              key={i.item}
              style={{
                color:styles.text,
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '20px',
                transition: 'all 0.4s ease',
                backgroundColor: clickedItem === i.item ? styles.hoverBackground : 'transparent',
                textShadow: '1px 1px 2px rgba(224, 217, 217, 0.3)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) =>(e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => redirectToPage(i.item, i.route)}
            >
             
                {i.item}
              
            </span>
          ))}


                 
        </div>


  <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {user ? 
             <div style={{backgroundColor:'transparent' ,cursor:'pointer',gap:`10px`,position:'relative'
                            ,height:"2.6rem",width:'100%' ,
                            padding:'8px 16px',display:"flex",justifyContent:'flex-end',alignItems:'center'}}
                          // onClick={handleToggleLogout} // Toggle on click
      onMouseEnter={() => setShowLogout(true)} // Show on hover
      onMouseLeave={() => setShowLogout(false)} // Hide on hover leave
                            >
                              <div style={{display:'flex',justifyContent:'flex-end' ,alignItems:'center' ,height:'100%',
                                color:'black' ,fontFamily:"inter",fontWeight:"400" ,lineHeight:"15px",}}>
                                       <span>{user?.name}</span> 
                                 
                            </div>


                                <div style={{width:'28px' ,height:'28px',borderRadius:'50%',border:`1px solid black`,overflow:'hidden',display:'flex',justifyContent:'center',alignItems:'center',textAlign:'center',boxShadow:'0px 0px 10px  whitesmoke',}}>
                                <img src={user?.picture }  style={{width:'100%' ,height:'100%'}}/>
                                </div> 

                                {showLogout && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: '100%', 
                                      right: '0px',
                                      backgroundColor: '#fff',
                                      borderRadius: '8px',
                                      padding: '8px 16px',
                                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                      color: '#d32f2f', 
                                      fontFamily: 'inter',
                                      fontWeight: '500',
                                      animation: 'fadeIn 0.3s ease-in-out', 
                                      zIndex: 10,
                                    }}
                                  >
                                    <Link href="/auth/logout" style={{ textDecoration: 'none', color: 'inherit' }}>
                                      Logout
                                    </Link>
                                  </div>
                                )}
                    </div>
                    :
                    <span style={{marginRight:'20px'}}><Link href="/auth/login">Login</Link></span>
            }


          <Link href={'/components/cart'} style={{display:'flex',flexDirection:'column',position:'relative',cursor:'pointer'}}>
            {mounted && subtotal !== 0 &&  <span style={{position:'absolute',top:'-14px',right:'-12px', backgroundColor:'red',width:'20px',height:'20px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'12px'}}>{subtotal}</span>}
              <span >
                  <FontAwesomeIcon icon={faCartShopping} size='lg'/>
              </span>
          </Link> 
        
        </div>

      </div>
      <style>
        {`
          .navbar {
            height: 5rem;
            transition: all 0.4s ease;
          }
          .shadow {
            height: 3.5rem;
            box-shadow: 0 2px 4px ${styles.navbarShadow};
         
          }
          .boximage {
            transition: all 0.5s ease;
          }
          .boximage:hover {
            transform: scale(1.3);
            box-shadow: 1px 1px 15px ${styles.navbarShadow};
            transition: all 0.3s ease;
          }
          a {
            text-decoration: none;
            color: inherit;
          }
          button:hover {
            background-color: ${styles.hoverBackground};
          }
          svg {
            stroke: ${styles.text};
          }



          @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        `}
      </style>
    </div>
  );
};

export default Navbar