import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createProduct,
  uploadFoodImage,
} from '../../api/productApi';

const categories = [
  'Bakery',
  'Cooked Meals',
  'Snacks',
  'Dairy',
  'Fruits and Vegetables',
  'Packaged Food',
  'Other',
];

export default function AddListing() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Cooked Meals',
    originalPrice: '',
    discountedPrice: '',
    availableQuantity: '',
    pickupAddress: '',
    availabilityDeadline: '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!image) {
      setPreview('');
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB.');
      return;
    }

    setError('');
    setImage(selectedFile);
  };

  const removeImage = () => {
    setImage(null);
    setPreview('');

    const input = document.getElementById('food-image');

    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(form.discountedPrice) >= Number(form.originalPrice)) {
      setError('Discounted price must be less than original price.');
      return;
    }

    if (!Number.isInteger(Number(form.availableQuantity)) ||
        Number(form.availableQuantity) < 1) {
      setError('Please enter a valid quantity.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';
      let imagePublicId = '';

      // Upload image first, if selected
      if (image) {
        const uploadResponse = await uploadFoodImage(image);

        imageUrl = uploadResponse.data.imageUrl;
        imagePublicId = uploadResponse.data.publicId;
      }

      // Create product with image URL
      await createProduct({
        ...form,
        originalPrice: Number(form.originalPrice),
        discountedPrice: Number(form.discountedPrice),
        availableQuantity: Number(form.availableQuantity),
        imageUrl,
        imagePublicId,
      });

      navigate('/seller/listings');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to create listing. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] px-4 py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-green-800 font-semibold mb-2">
            WasteNot Marketplace
          </p>

          <h1 className="text-3xl font-serif font-bold text-[#29372c]">
            Add a food listing
          </h1>

          <p className="text-gray-500 mt-2">
            Give your surplus food a second chance.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e6dc] shadow-sm p-6 md:p-8">

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* FOOD IMAGE */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Food Photograph
              </label>

              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt="Food preview"
                    className="w-full h-64 object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-semibold shadow"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="food-image"
                  className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-[#cbd5c0] rounded-xl bg-[#fafbf7] cursor-pointer hover:bg-[#f0f4e9] transition"
                >
                  <span className="text-4xl mb-3">📷</span>

                  <span className="font-semibold text-[#365b39]">
                    Upload food image
                  </span>

                  <span className="text-sm text-gray-500 mt-2">
                    JPG, PNG or WebP · Maximum 5 MB
                  </span>
                </label>
              )}

              <input
                id="food-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="text-xs text-gray-400 mt-2">
                A clear photograph helps buyers recognise your food.
              </p>
            </div>

            {/* ITEM NAME */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Item Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Crispy Egg Roll"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="input resize-none"
                placeholder="Describe your food..."
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Original Price (₹)
                </label>

                <input
                  name="originalPrice"
                  type="number"
                  min="1"
                  value={form.originalPrice}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Discounted Price (₹)
                </label>

                <input
                  name="discountedPrice"
                  type="number"
                  min="1"
                  value={form.discountedPrice}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="60"
                />
              </div>

            </div>

            {/* QUANTITY */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Available Quantity
              </label>

              <input
                name="availableQuantity"
                type="number"
                min="1"
                value={form.availableQuantity}
                onChange={handleChange}
                required
                className="input"
                placeholder="10"
              />
            </div>

            {/* PICKUP ADDRESS */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Pickup Address
              </label>

              <input
                name="pickupAddress"
                value={form.pickupAddress}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g. Green Bakery, Mysore"
              />
            </div>

            {/* DEADLINE */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Availability Deadline
              </label>

              <input
                name="availabilityDeadline"
                type="datetime-local"
                value={form.availabilityDeadline}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">

              <button
                type="button"
                onClick={() => navigate('/seller/listings')}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#3e603d] hover:bg-[#304e30] text-white font-semibold py-3 rounded-lg disabled:opacity-60 transition"
              >
                {loading
                  ? image
                    ? 'Uploading image and publishing...'
                    : 'Publishing...'
                  : 'Publish Food Listing'}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}