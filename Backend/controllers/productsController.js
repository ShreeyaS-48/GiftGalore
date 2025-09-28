import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import streamifier from "streamifier";
import Recommendation from "../models/recommendation.model.js";
import cloudinary from "../util/cloudinary.js";
import Sentiment from "sentiment";
const sentiment = new Sentiment();

const handleNewProduct = async (req, res) => {
  const {
    type,
    title,
    price,
    details,
    reviews,
    ratings,
    imgURL,
    img2,
    img3,
    img4,
  } = req.body;
  if (!type || !title || !price || !details || !imgURL)
    return res.status(400).json({ message: "Enter all required fields" });

  const duplicate = await Product.findOne({ title }).exec();

  if (duplicate) return res.sendStatus(409); // conflict

  try {
    const result = await Product.create({
      type,
      title,
      price,
      details,
      reviews,
      ratings,
      imgURL,
      img2,
      img3,
      img4,
      reviews: [],
      ratings: 0,
    });
    res.status(201).json({ success: `${title} added!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) return res.status(204).json({ message: "No products found" }); // no content
  res.json(products);
};

const getProduct = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const product = await Product.findOne({ _id: req.params.id }).exec();
  if (!product) {
    return res
      .status(204)
      .json({ message: `No product matches ${req.params.id}` });
  }
  res.json(product);
};

const getAllProductReviews = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const product = await Product.findOne({ _id: req.params.id }).exec();
  if (!product) {
    return res
      .status(204)
      .json({ message: `No product matches ${req.params.id}` });
  }
  if (!product.reviews || product.reviews.length === 0) {
    return res.json({
      reviewSentiment: "No reviews yet",
      reviews: [],
    });
  }
  const sentiments = product.reviews.map((review) => {
    const text = review.comment || "";
    const result = sentiment.analyze(text);
    const score = result.score; // >0 positive, <0 negative, 0 neutral
    if (score > 0) return "positive";
    else if (score < 0) return "negative";
    else return "neutral";
  });
  const counts = sentiments.reduce((acc, s) => {
    acc[s] = acc[s] ? acc[s] + 1 : 1;
    return acc;
  }, {});
  const majoritySentiment = Object.keys(counts).reduce(
    (a, b) => (counts[a] > counts[b] ? a : b),
    null
  );
  const summary =
    majoritySentiment == "positive"
      ? "Most customers are happy with this product."
      : majoritySentiment == "negative"
      ? "Most customers are dissatisfied with this product."
      : "Customer opinions are mixed or neutral.";
  product.reviewSentiment = summary;
  await product.save();
  const firstFiveReviews = product.reviews.slice(0, 5);
  const response = {
    reviewSentiment: product.reviewSentiment || "not analyzed",
    reviews: firstFiveReviews,
  };

  res.json(response);
};

const addProductReview = async (req, res) => {
  const userName = req.user; // from middleware that verifies token

  const user = await User.findOne({ name: userName });
  if (!user) return res.status(404).json({ message: "User not found" });
  const userId = user._id;

  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }
  const product = await Product.findOne({ _id: req.params.id }).exec();
  if (!product) {
    return res
      .status(204)
      .json({ message: `No product matches ${req.params.id}` });
  }

  const { rating, comment } = req.body;
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
        size: file.size,
      });
    }
  }

  const review = {
    user: user._id,
    rating: Number(rating),
    comment,
    attachments,
  };

  product.reviews.push(review);

  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;
  await product.save();
  res.status(201).json({ message: "Review added" });
};

const getRecommendations = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  try {
    const recommendations = await Recommendation.find({ lhs: req.params.id })
      .sort({ confidence: -1 })
      .exec();

    res.status(200).json(recommendations || []);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getAllProductsSkipLimit = async (req, res) => {
  let { page, limit } = req.query;
  page = parseInt(page) || 1; // default page = 1
  limit = parseInt(limit) || 5;
  const skip = (page - 1) * limit;
  const products = await Product.find().skip(skip).limit(limit);
  const total = await Product.countDocuments();
  res.json({
    page,
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
    products,
  });
};
export {
  getRecommendations,
  handleNewProduct,
  getAllProducts,
  getProduct,
  getAllProductReviews,
  addProductReview,
};
