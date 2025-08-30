export interface Product {
  id: string; 
  title: string;
  price: number;
  originalPrice: number; 
  recentlyViewed: boolean; 
  image: string; 
  category: string; 
}
export interface ApiProduct {
  id: string;
  name: string;
  categoryId: string;
  code: string;
  description: string;
  imageink1: string;
  imageink2: string;
  imageink3: string;
  imageink4: string;
  logo: string;
  lotNo: string;
  operator: {
    id: string;
    name: string;
    code: string;
    logo: string;
    status: string;
  };
  price: number;
  quantity: number;
  status: string;
}



