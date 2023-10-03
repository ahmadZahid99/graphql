const { Products } = require("../../models/products");
const { AddToCart } = require("../../models/addToCart");
const sharp = require("sharp");

const updateProductMiddleware = (id, newQuantity, session) => {
  return Products.findByIdAndUpdate(id, newQuantity)
    .session(session)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const addToCartMiddleware = async (cartDetail, session) => {
  try {
    const result = await AddToCart.create([cartDetail], { session: session });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const addPicByToneId = async (profile_pic, t) => {
  if (Array.isArray(profile_pic)) {
    profile_pic = profile_pic[0]; // if more than one pics were sent by product
  }
  //
  profile_pic = {
    file_name: profile_pic.name,
    file_data: profile_pic.data,
    file_size: profile_pic.size,
    file_mimetype: profile_pic.mimetype,
  };

  try {
    const processed = await processOnPic(profile_pic);

    return processed;
  } catch (err) {
    throw new Error(err);
  }
};

const processOnPic = async (pic) => {
  try {
    const image = sharp(pic.file_data);
    const image_metadata = await image.metadata();
    if (image_metadata.width > 640) {
      image.resize(640);
      let processed_buffer = await image.toBuffer({ resolveWithObject: true });
      if (processed_buffer) {
        pic.file_data = processed_buffer.data;
        pic.file_size = processed_buffer.info.size;
      } else {
        throw new Error("image processing failed");
      }
    }
    return pic;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllProductsMiddleware = () => {
  return Products.find({})
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const getProductMiddleware = (id) => {
  return Products.findById(id)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};
const getProductById = (id) => {
  return Products.findById(id)
    .select("title description quantity")
    .then((result) => {
      return result;
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const refactorProductList = (products) => {
  let productList = [];
  products.map((product) => {
    let imageList = [];
    const productData = new Object();
    productData.id = product._id;
    productData.title = product.title;
    productData.description = product.description;
    product?.colors.map((color) =>
      color.tones.map((tone) =>
        tone.shades
          ? imageList.push(
              `data:${
                tone.shades.file_mimetype
              };base64,${tone.shades.file_data.toString("base64")}`
            )
          : null
      )
    );
    productData.productImage = imageList;

    productList.push(productData);
  });

  return productList;
};
const refactorProduct = (product) => {
  let imageList = [];

  const productData = new Object();
  productData.id = product._id;
  productData.title = product.title;
  productData.description = product.description;
  productData.available = product.quantity;
  productData.color = product?.colors.map((color) => {
    const colorData = {
      name: color.name,
      id: color._id,
    };
    colorData.tone = color.tones.map((tone) => {
      const image = `data:${
        tone.shades.file_mimetype
      };base64,${tone.shades.file_data.toString("base64")}`;
      imageList.push(image);
      return {
        id: tone._id,
        name: tone.name,
        image,
      };
    });
    return colorData;
  });
  productData.imageList = imageList;

  return productData;
};

async function productCreation(productDetail) {
  try {
    const result = new Products(productDetail);
    const product = await result.save();
    return product;
  } catch (error) {
    throw new Error(error);
  }
}

//
module.exports = {
  productCreation,
  addPicByToneId,
  getAllProductsMiddleware,
  getProductMiddleware,
  refactorProductList,
  refactorProduct,
  getProductById,
  updateProductMiddleware,
  addToCartMiddleware,
};
