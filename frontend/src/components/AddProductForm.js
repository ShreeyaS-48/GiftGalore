import DataContext from '../context/DataContext';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useContext, useState } from 'react';

const AddProductForm = () => {
  const axiosPrivate = useAxiosPrivate();
  const { fetchProducts } = useContext(DataContext);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    price: '',
    details: '',
    imgURL: '',
    img2: '',
    img3: '',
    img4: '',
  });

  const productTypes = ['Cakes', 'Bouquets', 'Plants', 'Chocolates', 'Combos'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert numeric fields
      const productData = {
        ...formData,
        price: Number(formData.price),
        reviews:  0,
        ratings:  0,
      };
      await axiosPrivate.post('/products', productData);

      alert('Product added successfully');
      fetchProducts();
      setFormData({
        type: '',
        title: '',
        price: '',
        details: '',
        imgURL: '',
        img2: '',
        img3: '',
        img4: '',
      });

    } catch (err) {
      console.error(err);
      alert('Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className="form">
      <h2>Add New Product</h2>
      <label>
        Type:
        <select name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Select a type</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </label>

      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <label>
        Price:
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />
      </label>

      <label>
        Details:
        <textarea name="details" value={formData.details} onChange={handleChange} required />
      </label>

      <label>
        Main Image URL:
        <input type="text" name="imgURL" value={formData.imgURL} onChange={handleChange} required />
      </label>

      <label>
        Image 2 URL:
        <input type="text" name="img2" value={formData.img2} onChange={handleChange} />
      </label>

      <label>
        Image 3 URL:
        <input type="text" name="img3" value={formData.img3} onChange={handleChange} />
      </label>

      <label>
        Image 4 URL:
        <input type="text" name="img4" value={formData.img4} onChange={handleChange} />
      </label>

      <button type="submit" style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>Add Product</button>
    </form>
  );
};

export default AddProductForm;
