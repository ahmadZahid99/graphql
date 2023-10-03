import { Helmet } from "react-helmet-async";
// sections
import { ProductListView } from "../../sections/product/view";

// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Product List </title>
      </Helmet>

      <ProductListView />
    </>
  );
}
