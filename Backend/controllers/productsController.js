import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
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
    const result = sentiment.analyze(text); // { score, comparative }
    return {
      text,
      score: result.score,
      type:
        result.score > 0
          ? "positive"
          : result.score < 0
          ? "negative"
          : "neutral",
      intensity: Math.abs(result.score), // for adjective selection
    };
  });
  const counts = sentiments.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});
  const total = sentiments.length;
  const percent = (type) => ((counts[type] || 0) / total) * 100;
  const adjective = (type, intensity) => {
    if (type === "positive") {
      if (intensity > 3) return "thrilled";
      if (intensity > 1.5) return "happy";
      return "satisfied";
    } else if (type === "negative") {
      if (intensity > 3) return "frustrated";
      if (intensity > 1.5) return "disappointed";
      return "unsatisfied";
    } else {
      return "neutral";
    }
  };
  const makePhrase = (type) => {
    const p = percent(type).toFixed(0);
    const adjList = sentiments
      .filter((r) => r.type === type)
      .map((r) => adjective(type, r.intensity));

    // Pick the most common adjective for this sentiment
    const freq = {};
    adjList.forEach((a) => (freq[a] = (freq[a] || 0) + 1));
    const commonAdj = Object.keys(freq).reduce((a, b) =>
      freq[a] > freq[b] ? a : b
    );

    const templates = [
      `${p}% of customers are ${commonAdj}.`,
      `Based on reviews, ${p}% seem ${commonAdj}.`,
      `Customer feedback indicates ${p}% are ${commonAdj}.`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // --- Step 5: Combine phrases into a cohesive paragraph ---
  const summaryParts = [];
  if (percent("positive") > 5) summaryParts.push(makePhrase("positive"));
  if (percent("negative") > 5) summaryParts.push(makePhrase("negative"));
  if (percent("neutral") > 5) summaryParts.push(makePhrase("neutral"));
  if (summaryParts.length === 0)
    summaryParts.push("Customer opinions are varied.");

  // Shuffle sentences randomly for natural feel
  const shuffledSummary = summaryParts
    .sort(() => Math.random() - 0.5)
    .join(" ");

  product.reviewSentiment = shuffledSummary;

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

export const getTopProducts = async (req, res) => {
  // 1️⃣ Generate current month and past 5 months
  const months = [];
  const now = new Date();
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
  }

  // 2️⃣ Aggregate actual sales
  const topProductsByMonth = await Order.aggregate([
    { $unwind: "$items" },

    {
      $group: {
        _id: {
          month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          productId: "$items.product._id",
        },
        totalSold: { $sum: "$items.quantity" },
      },
    },

    {
      $lookup: {
        from: "products",
        localField: "_id.productId",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    { $unwind: "$productDetails" },

    {
      $project: {
        month: "$_id.month",
        productId: "$_id.productId",
        name: "$productDetails.title",
        sales: "$totalSold",
      },
    },

    { $sort: { month: 1, sales: -1 } },

    {
      $group: {
        _id: "$month",
        topProducts: {
          $push: { productId: "$productId", name: "$name", sales: "$sales" },
        },
      },
    },
    {
      $project: {
        month: "$_id",
        topProducts: { $slice: ["$topProducts", 3] },
        _id: 0,
      },
    },
  ]);

  const fullData = months.map((month) => {
    const found = topProductsByMonth.find((d) => d.month === month);
    return found || { month, topProducts: [] };
  });

  res.json(fullData);
};

export {
  getRecommendations,
  handleNewProduct,
  getAllProducts,
  getProduct,
  getAllProductReviews,
  addProductReview,
};
