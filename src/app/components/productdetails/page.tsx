
"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import ProductDetailPage from './ProductDetailPage';
import axios from 'axios';
import config from '@/config';
import { productOne } from './interfaceproductone';


const mapApiDataToProductOne = (apiData: any): productOne => ({
            id: apiData.id,
            name: apiData.name,
            price: apiData.price,
            description: apiData.description,
            image1: apiData.imageink1, // Note the typo in the API data (imageink1 vs image1)
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
            inStock: apiData.status === "available" ? "true" : "false", // Derive inStock from status
          });

const Page = () => {
  const searchParams = useSearchParams(); 
  const id = searchParams.get('id'); 
  const [data, setData] = useState<productOne | null>(null)

  console.log("dataid", id);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const url = `${config.apiUrl}/api/product/getone/${id}`;
      console.log('Fetching from by id', url);
      const response = await axios.get(url);
      console.log("datafetched",response?.data?.products[0])
      if(response)
        {
          const mappedData = mapApiDataToProductOne(response.data.products[0]);
          console.log("dasdasdasd",mappedData)
          setData(mappedData);
          
        } 
    };

    loadProduct();
  }, [id]);

  return <ProductDetailPage productdata={data}/>; 
};

export default Page;