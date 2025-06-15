// import { IsNull } from 'typeorm';
// import { AppDataSource } from '../config/datasource';
// import { Image } from '../entity/Image';
// import { uploadImageToCloudinary } from '../services/UpLoadService';

// const runUpload = async () => {
//   await AppDataSource.initialize(); // Kết nối DB

//   const imageRepo = AppDataSource.getRepository(Image);

//   const imageList = await imageRepo.find({
//     where: { cloudinary_url: IsNull() }, // chỉ upload ảnh chưa có URL
//     relations: ['productItem'],      // cần nếu dùng image.productItem.id
//   });

//   for (let i = 0; i < imageList.length; i++) {
//     const img = imageList[i];

//     if (!img.productItem) {
//       console.warn(`Image ${img.id} does not have a productItem. Skipping upload.`);
//       continue;
//     }

//     const publicId = `product_${img.productItem!.id}_img_${img.id}`; // thêm dấu ! để TS không báo lỗi
//     const uploaded = await uploadImageToCloudinary(img.image_url, 'products', publicId);

//     // if (uploaded) {
//       img.cloudinary_url = uploaded.url;
//       img.cloudinary_public_id = uploaded.publicId;
//       await imageRepo.save(img);
//       console.log(` Uploaded image ${img.id} → ${uploaded.url}`);
//     } else {
//       console.warn(` Failed to upload image ${img.id}`);
//     }
//   }

//   console.log('Upload finished');
//   process.exit(0);
// };

// runUpload().catch((err) => {
//   console.error(' Script error:', err);
//   process.exit(1);
// });