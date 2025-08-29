"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import config from '@/config';
import ProductDetailPage from './ProductDetailPage';
import { productOne } from './interfaceproductone';

const mapApiDataToProductOne = (apiData: any): productOne => ({
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

export default function ClientPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState<productOne | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const url = `${config.apiUrl}/api/product/getone/${id}`;
        const response = await axios.get(url);
        if (response?.data?.products?.[0]) {
          setData(mapApiDataToProductOne(response.data.products[0]));
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };

    loadProduct();
  }, [id]);

  const product = useMemo(() => data, [data]);

  return <ProductDetailPage productdata={product} />;
}
