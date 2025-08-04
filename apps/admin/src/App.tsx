import { Routes, Route, Link } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import AddProductPage from "./pages/AddProductPage";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Button
        component={Link}
        to="/add-product"
        variant="contained"
        sx={{ mt: 2 }}
      >
        Go to Add Product
      </Button>

      <Routes>
        <Route path="/add-product" element={<AddProductPage />} />
      </Routes>
    </Container>
  );
}

export default App;
