"use client";
import { RootState } from '@/toolkit/cartStore';
import { faCaretDown, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useContext, use } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { useUser } from '@auth0/nextjs-auth0';
import { RotateProp } from '@fortawesome/fontawesome-svg-core';

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




    const[clickedsec,setclickedsec]=useState(false)
    
    const login={
            'lang':'Log in',
            'image':'',
            'code':1
        }
    const logout={
            'lang': 'Log out',
            'image':'',
            'code':2
    }    

    const data = [
      { ...(user ? logout : login) },
      {
        'lang': 'Order List',
        'image': '',
        'code': 3
      }
    ];


    const showlangoptions=()=>{
            setClicked(!clicked)
            setclickedsec(!clickedsec)
    }

    const handleoptions=(item:number)=>{
        console.log("options",item)
        if(item===1){
            router.push('/auth/login')
        }
        if(item===2){
            router.push('/auth/logout')
        }
        if(item===3){
            router.push('/components/orderstatus')
        }
    }


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



                <div style={{height:"auto",width:'16.5rem', borderTopRightRadius:"8px",
                    borderTopLeftRadius: "8px",borderBottomLeftRadius:clicked?'':'8px',borderBottomRightRadius:clicked?'':'8px',
                    marginRight:"3rem",display:"flex",justifyContent:'center',alignItems:'center',flexDirection:'column',}}>
                    

                    <div style={{cursor:'pointer',border:'1px solid #6d85a353'
                            ,height:"2.6rem",width:'100%' , borderTopRightRadius:"8px",
                            borderTopLeftRadius: "8px",borderBottomLeftRadius:clicked?'':'8px',borderBottomRightRadius:clicked?'':'8px',
                            padding:'8px 16px',display:"flex",justifyContent:'center',alignItems:'center'}}
                            
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#55555522")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor ='')}
                            onClick={()=>showlangoptions()}
                            >
                            <div style={{display:'flex', justifyContent:'center', alignItems:'center', flex:'1', width:'100%', height:'100%'}}>
                              {user?.picture && (
                                <div style={{width:'28px', height:'28px', borderRadius:'50%', border:`1px solid #6d85a3`, overflow:'hidden', display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', boxShadow:'0px 0px 5px #6d85a3'}}>
                                  <img src={user.picture} style={{width:'100%', height:'100%'}} alt="User profile" />
                                </div>
                              )}
                            </div>
                            <div style={{display:'flex',gap:"8%",justifyContent:'flex-start' ,alignItems:'center' ,flex:'8',width:'100%' ,height:'100%',
                            color:styles.text ,fontFamily:"inter",fontWeight:"400" ,lineHeight:"15px",fontSize:"100%",paddingLeft:'16px'}}>
                                       <span>{user? user?.name : 'user'}</span>
                                </div>
                            <div style={{cursor:'pointer',display:'flex',justifyContent:'center' ,alignItems:'center' ,flex:'1',width:'100%' ,height:'100%',transition:'all 300ms'}} >
                               <FontAwesomeIcon 
                                    icon={faCaretDown} 
                                    style={{color:'green' ,height:'25px' ,width:"25px",transition:'all 400ms'}} 
                                    rotation={clicked ? 180 as RotateProp : 0 as RotateProp}
                                  />
                              </div>
                    
                    </div>


                        <div 
                            style={{
                            cursor: "pointer",
                            backgroundColor: 'whitesmoke',
                            width: "16.5rem",
                            borderBottomRightRadius: "8px",
                            borderBottomLeftRadius:"8px",
                            height: clicked?'5rem':"0px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            position: "absolute",
                            top: "3.7rem",
                            right: "13.55rem",
                            zIndex: 99,
                            transition: "all 500ms",
                            
                            }}
                        >
                            {clickedsec && data.map((item,index,array) => (
                            <div
                                key={item.code}
                                style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                height: "2.6rem",
                                border:'1px solid #6d85a353',
                                borderBottomLeftRadius:index === (array.length -1)? '8px':'',
                                borderBottomRightRadius:index === (array.length -1)? '8px':'',
                                borderBottom:index === (array.length -1)?'':'2px solid #6d85a353',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#55555522")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                                
                            >
                                  
                                <div onClick={() =>handleoptions(item.code)} style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: "1", width: "100%", height: "100%", color:styles.text, fontFamily: "inter", fontWeight: "500", lineHeight: "15px", fontSize: "16px" }}>
                                    {item.lang} 
                                </div>
                            </div>
                            ))}
                        </div>
                </div>



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