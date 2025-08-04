import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");
      const data = await res.json();

      alert(`Product "${data.name}" added!`);
      setForm({ name: "", description: "", price: "" });
      setImageFile(null);
      // Reset file input manually (optional)
      (document.getElementById("image-input") as HTMLInputElement).value = "";
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom mt={4}>
        Add New Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          name="name"
          label="Product Name"
          fullWidth
          value={form.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          value={form.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          name="price"
          label="Price"
          fullWidth
          type="number"
          value={form.price}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          id="image-input"
          onChange={handleFileChange}
          style={{ marginBottom: 16 }}
        />

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Container>
  );
}
