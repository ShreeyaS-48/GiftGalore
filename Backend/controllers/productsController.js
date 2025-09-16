import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import streamifier from "streamifier";
import cloudinary from "../util/cloudinary.js"; 

const handleNewProduct = async (req, res) => {
    const { type, title, price, details, reviews, ratings, imgURL, img2, img3, img4 } = req.body;
    if(!type || !title || !price || !details || !imgURL) return res.status(400).json({'message' : 'Enter all required fields'})
    
    const duplicate =  await Product.findOne({title}).exec() 
    
    if(duplicate) return res.sendStatus(409) // conflict

    try{
        const result =  await Product.create({
             type, title, price, details, reviews, ratings, imgURL, img2, img3, img4, reviews :[], ratings: 0
        })
        console.log(result)
        res.status(201).json({'success': `${title} added!`})
    } catch(err){
        res.status(500).json({'message': err.message})
    }
}

const getAllProducts = async (req, res) =>{
    const products = await Product.find()
    if(!products) return res.status(204).json({'message': 'No products found'}) // no content
    res.json(products)
}

const getProduct = async (req, res)=>{
    if(!req?.params?.id){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const product = await Product.findOne({ _id : req.params.id}).exec()
    if (!product) {
        return res.status(204).json({ "message": `No product matches ${req.params.id}` });
    }
    res.json(product);
}

const getAllProductReviews = async (req, res)=>{
    if(!req?.params?.id){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const product = await Product.findOne({ _id : req.params.id}).exec()
    if (!product) {
        return res.status(204).json({ "message": `No product matches ${req.params.id}` });
    }
    const firstFiveReviews = product.reviews.slice(0, 5);

    console.log(product.firstFiveReviews);
    res.json(product.firstFiveReviews);
}

const addProductReview = async (req, res) => {
    const userName = req.user; // from middleware that verifies token
        
    const user = await User.findOne({name: userName})
    if (!user) return res.status(404).json({ message: "User not found" });
    const userId = user._id;

    if(!req?.params?.id){
        return res.status(400).json({ "message": 'ID parameter is required' });
    }
    const product = await Product.findOne({ _id : req.params.id}).exec()
    if (!product) {
        return res.status(204).json({ "message": `No product matches ${req.params.id}` });
    }

    const { rating, comment } = req.body;
    console.log("Files received:", req.files);
    const attachments = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // use upload_stream to upload buffer
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "reviews" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        attachments.push({
          url: result.secure_url,
          public_id: result.public_id,
          mimetype: file.mimetype,
          size: file.size
        });
      }
    }

    const review = {
      user: user._id,
      rating: Number(rating),
      comment,
      attachments
    };
    
    

    product.reviews.push(review);
    
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });

};

export  {handleNewProduct, getAllProducts, getProduct, getAllProductReviews, addProductReview}