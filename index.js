require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require('./models/Contact');
const Gallery = require('./models/Gallery');

const app = express();
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:5174'
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rkwaterproofing')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, service, message } = req.body;
    const newContact = new Contact({ name, phone, email, service, message });
    await newContact.save();
    res.status(201).json({ success: true, message: 'Message received successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving message' });
  }
});

app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contacts' });
  }
});

app.delete('/api/admin/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting contact' });
  }
});

// Gallery Endpoints
const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gallery images' });
  }
};

const postGallery = async (req, res) => {
  try {
    const { title, imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ success: false, message: 'Image data is required' });
    }
    const newImage = new Gallery({ title, imageData });
    await newImage.save();
    res.status(201).json({ success: true, message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
};

const deleteGallery = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting image' });
  }
};

app.get('/api/gallery', getGallery);
app.get('/api/v1/gallery', getGallery);
app.post('/api/gallery', postGallery);
app.post('/api/v1/gallery', postGallery);
app.delete('/api/gallery/:id', deleteGallery);
app.delete('/api/v1/gallery/:id', deleteGallery);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
