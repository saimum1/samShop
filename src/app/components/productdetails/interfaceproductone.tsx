export interface productOne{
    id: string
    name: string
    price: number
    description:string
    image1:string | null
    image2:string | null
    image3:string | null
    image4:string | null
    operator:{
      id:string
      code:string
      logo:string
      name:string
      status:string

    }
    lotNo:string
    quantity: number
    categoryId: string
    inStock: string
}
