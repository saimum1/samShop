
import { Suspense } from "react";
import ProductDetailPage from "./ProductDetailPage";

const page = () => {
  //  return <ProductDetailPage />
  return( <Suspense fallback={<div>Loading...</div>}>
      <ProductDetailPage />
    </Suspense>)
}

export default page
