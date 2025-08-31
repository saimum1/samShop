export interface order {
  id: string;
  created_at: string;
  leademail: string;
  leadname: string;
  orderid: string;
  status: string;
  updated_at: string;
  items:orderiteminterface[]
 
}


export interface orderiteminterface {
    image: string;
    leademail: string;
    leadname: string;
    price: number;
    quantity: number;
    productid: string;
    name:string

    operator:{
        name:string
        status:string
        logo:string
        code:string
    }
    product:{
        id: string;
        name: string;
        code: string;
        description: string;
        category_id: string;
        price: number;
        quantity: number;
        lot_no: string;
        status: string;
        logo: string;
        imageink1?: string;
        imageink2?: string;
        imageink3?: string;
        imageink4?: string;
        operator_id: string | null;
    
  }
 
}