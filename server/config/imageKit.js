import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,   // from your dashboard
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // keep safe
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT // e.g. https://ik.imagekit.io/your_id
});

export default imagekit;
