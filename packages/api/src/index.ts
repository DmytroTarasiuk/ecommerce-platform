import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { prisma } from "./prisma";

const app = express();
app.use(cors());

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Save uploads here
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Serve static files from uploads folder
app.use("/uploads", express.static("uploads"));

// Since multer handles multipart, no need for express.json() on this route
// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "API is healthy!" });
});

// GET all products
app.get("/api/products", async (_req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// POST a new product with image upload
app.post(
  "/api/products",
  upload.single("image"), // 'image' is the field name from the form-data
  async (req, res) => {
    const { name, description, price } = req.body;
    const file = req.file;

    // Basic validation
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      isNaN(parseFloat(price)) ||
      !file
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input data or missing image" });
    }

    // Build public URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      file.filename
    }`;

    try {
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          imageUrl,
        },
      });
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
