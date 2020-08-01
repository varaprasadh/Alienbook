const DatauriParser = require('datauri/parser');
const path = require('path');
require('dotenv').config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage=(file,options)=>{
    // const {folder,public_id}
    return new Promise((resolve,reject)=>{
        const parser = new DatauriParser();
        const base64String = parser.format(path.extname(file.originalname).toString(),file.buffer).content;
        cloudinary.uploader.upload(base64String,options).then(result => {
            resolve(result);
        }).catch(err=>{
            reject("image upload error");
        });
    });
}


const uploadProfileImage = (file, userid,options) => {
    return uploadImage(file,{public_id:`${userid}/profile`,overwrite:true});
}
const uploadPostImage=(file,userid)=>{
    return uploadImage(file,{folder:`${userid}/photos/`})
}


const deleteImage = (public_id) => {
    //delete the photo
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.destroy(public_id,{invalidate:true})
        .then(resolve).catch(reject)
    })

}

const deleteImages = (public_ids) => {
    //for loop the delete image
    return new Promise((resolve,reject)=>{
       cloudinary.api.delete_resources(public_ids,{invalidate:true})
       .then(result=>{
           console.log(result);
           resolve(result);
       }).catch(err=>{
           console.log(err);
           reject(err);
       });
    }) 
}

//middleware to upload images on the fly with post!
const uploadImages = async (req, res,next) => {
   const files=req.files || [];
   console.log("files",files)

   const userid=req.user.id;
   let imagesMeta=[];
   
   for(const file of files){
       try{
        let meta=await uploadPostImage(file,userid);
        imagesMeta.push(meta);
       }catch(err){

       }
   }
   req.filesMeta=imagesMeta;
   next();
}


module.exports = {
    uploadProfileImage,
    uploadImages,
    deleteImages,
    deleteImage
};


