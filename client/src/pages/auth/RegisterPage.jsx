import { Helmet } from "react-helmet-async";
// sections
import Register from "../../sections/auth/Register";

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Register | IDENBRID INC </title>
      </Helmet>

      <Register />
    </>
  );
}
