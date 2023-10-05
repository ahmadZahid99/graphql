import PropTypes from "prop-types";
// @mui
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Image from "../../components/image";
import Iconify from "../../components/iconify";
// ----------------------------------------------------------------------

export default function ProductItem({ product }) {
  const { id, title, description, productImage } = product;
  // const renderImages = (
  //   <Stack
  //     spacing={0.5}
  //     direction="row"
  //     sx={{
  //       p: (theme) => theme.spacing(1, 1, 0, 1),
  //     }}
  //   >
  //     {productImage.length && (
  //       <>
  //         <Stack flexGrow={1} sx={{ position: "relative" }}>
  //           <Image
  //             alt={productImage[0]}
  //             src={productImage[0]}
  //             sx={{ borderRadius: 1, height: 164, width: 1 }}
  //           />
  //         </Stack>
  //         {productImage.length >= 1 && (
  //           <Stack spacing={0.5}>
  //             <Image
  //               alt={productImage[1]}
  //               src={productImage[1]}
  //               ratio="1/1"
  //               sx={{ borderRadius: 1, width: 80 }}
  //             />
  //             {productImage.length >= 2 && (
  //               <Image
  //                 alt={productImage[2]}
  //                 src={productImage[2]}
  //                 ratio="1/1"
  //                 sx={{ borderRadius: 1, width: 80 }}
  //               />
  //             )}
  //           </Stack>
  //         )}
  //       </>
  //     )}
  //   </Stack>
  // );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      secondary={
        <Link
          variant="subtitle2"
          underline="hover"
          href={PATH_DASHBOARD.products.details(id)}
          color="inherit"
        >
          {title}
        </Link>
      }
      primaryTypographyProps={{
        typography: "caption",
        color: "text.disabled",
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: "span",
        color: "text.primary",
        typography: "subtitle1",
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: "relative",
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      {[
        {
          label: description,
          icon: (
            <Iconify
              icon="fluent:text-description-rtl-20-regular"
              sx={{ color: "info.main" }}
            />
          ),
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          sx={{ typography: "body2" }}
        >
          <Stack>{item.icon}</Stack>
          <Typography
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2, // Set the number of lines you want to display
              textOverflow: "ellipsis",
            }}
          >
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {/* {renderImages} */}

        {renderTexts}

        {renderInfo}
      </Card>
    </>
  );
}

ProductItem.propTypes = {
  product: PropTypes.object,
};
