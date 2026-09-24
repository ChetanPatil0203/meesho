import { useState } from 'react';

const RATING_LABELS = {
  1: 'Very Bad 😞',
  2: 'Poor 🙁',
  3: 'Average 😐',
  4: 'Good 😊',
  5: 'Excellent! 🌟',
};

const SAMPLE_REVIEW_PHOTOS = [
  'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=200&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&fit=crop',
];

export default function WriteReviewModal({ isOpen, onClose, product, onSubmit, onShowToast }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);

  if (!isOpen || !product) return null;

  const handleAddSamplePhoto = () => {
    if (photos.length < 2) {
      setPhotos([...photos, SAMPLE_REVIEW_PHOTOS[photos.length]]);
      onShowToast?.('Customer photo attached! 📷');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      onShowToast?.('Please enter your name', 'error');
      return;
    }
    if (!comment.trim()) {
      onShowToast?.('Please write a short review', 'error');
      return;
    }

    const reviewObj = {
      name: name.trim(),
      rating,
      date: 'Just now',
      title: title.trim(),
      text: comment.trim(),
      verified: true,
      helpful: 1,
      photos,
    };

    onSubmit(reviewObj);
    onShowToast?.('Thank you! Your review has been published. ⭐');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-yellow-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✍️</span>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Rate & Review Product</h3>
              <p className="text-[11px] text-gray-500 line-clamp-1">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 font-bold transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center py-3 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="font-bold text-gray-700 text-xs mb-2">How was your overall experience?</p>
            <div className="flex items-center justify-center gap-1.5 text-3xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-125 focus:outline-none"
                >
                  <span className={star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-200'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-yellow-600 mt-1.5">
              {RATING_LABELS[hoverRating || rating]}
            </p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#3B5BDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Review Headline (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Loved the fabric & perfect fit!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#3B5BDB]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Detailed Review *</label>
            <textarea
              rows={3}
              placeholder="Describe what you liked about this product, quality, comfort, sizing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#3B5BDB] resize-none"
            />
          </div>

          {/* Photo attachment */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">Attach Product Photos</label>
            <div className="flex gap-2 items-center flex-wrap">
              {photos.map((p, idx) => (
                <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 shadow-xs">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 text-white rounded-full text-[9px] flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {photos.length < 2 && (
                <button
                  type="button"
                  onClick={handleAddSamplePhoto}
                  className="w-14 h-14 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#3B5BDB] hover:text-[#3B5BDB] transition-colors"
                >
                  <span className="text-base">📷</span>
                  <span className="text-[9px] font-bold mt-0.5">+ Photo</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#3B5BDB] text-white font-bold rounded-xl hover:bg-[#2F4AC4] text-xs transition-colors shadow-xs"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
