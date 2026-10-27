import { useState, useRef, useEffect, useCallback } from 'react';
import {
  virtualTryOnService,
  validateImage,
  compressAndReadImage,
  isClothingCategorySupported,
} from '../services/virtualTryOnService';
import { triggerConfetti } from '../utils/confetti';

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onShowToast,
  onOpenSizeGuide,
}) {
  // Step: 'upload' | 'camera' | 'preview' | 'processing' | 'result'
  const [step, setStep] = useState('upload');
  const [userPhoto, setUserPhoto] = useState(null);
  const [photoDimensions, setPhotoDimensions] = useState({ width: 0, height: 0 });
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Default');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [uploadError, setUploadError] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [tryOnResult, setTryOnResult] = useState(null);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'sideBySide'
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 percentage
  const [isDragging, setIsDragging] = useState(false);

  // Web camera states
  const videoRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);

  const fileInputRef = useRef(null);
  const sliderContainerRef = useRef(null);

  // Sync variants when modal opens or product changes
  useEffect(() => {
    if (isOpen && product) {
      setSelectedColor(product.colors?.[0] || 'Default');
      setSelectedSize(product.sizes?.[0] || '');
      setUploadError(null);
    }
  }, [isOpen, product]);

  // Safely stop webcam stream
  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
    }
  }, [isOpen, stopCameraStream]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        stopCameraStream();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stopCameraStream]);

  // Handle Photo Upload with comprehensive validation
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    const validation = validateImage(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    try {
      setUploadError(null);
      // Validate dimensions & compress
      const { dataUrl, width, height } = await compressAndReadImage(file);
      setUserPhoto(dataUrl);
      setPhotoDimensions({ width, height });
      setStep('preview');
    } catch (err) {
      setUploadError(err.message || 'Failed to process image. Please try another photo.');
    }
  };

  // Start Web Camera
  const handleStartCamera = async () => {
    setCameraError(null);
    setStep('camera');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access unavailable:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access or upload a photo from your files.'
          : 'Camera is currently unavailable on this device. Please upload a photo instead.'
      );
    }
  };

  // Capture Frame from Camera
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

      stopCameraStream();
      setUserPhoto(dataUrl);
      setPhotoDimensions({ width: canvas.width, height: canvas.height });
      setStep('preview');
    } catch (err) {
      setUploadError('Failed to capture photo from camera. Please upload an image.');
      setStep('upload');
    }
  };

  // Remove Uploaded Photo (Privacy: clears from memory)
  const handleRemovePhoto = () => {
    setUserPhoto(null);
    setPhotoDimensions({ width: 0, height: 0 });
    setTryOnResult(null);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 5 Processing stages
  const processingStages = [
    'Analyzing photo...',
    'Detecting person...',
    'Understanding clothing...',
    'Applying selected outfit...',
    'Generating preview...',
  ];

  // Execute Try-On Request
  const handleStartTryOn = async () => {
    if (!userPhoto) {
      setUploadError('Please upload a photo first.');
      return;
    }

    setStep('processing');
    setProcessingStep(0);

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < processingStages.length) {
        setProcessingStep(currentIdx);
      }
    }, 550);

    try {
      const result = await virtualTryOnService.requestVirtualTryOn({
        userImage: userPhoto,
        productId: product.id,
        productImage: product.image,
        category: product.subcategory || product.category,
        color: selectedColor,
        size: selectedSize,
        product,
      });

      clearInterval(interval);
      setProcessingStep(processingStages.length - 1);

      setTimeout(() => {
        setTryOnResult(result);
        setStep('result');
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setUploadError(err.message || 'Unable to create your try-on preview right now. Please try again.');
      setStep('preview');
    }
  };

  // Add to Cart from Try-On modal
  const handleAddToCart = () => {
    if (product.sizes?.length > 1 && !selectedSize) {
      onShowToast?.('Please select a size first', 'error');
      return;
    }
    onAddToCart?.(product, 1, selectedColor, selectedSize);
    triggerConfetti(1500);
    onShowToast?.(`Added ${product.name.slice(0, 22)}... to cart! 🛒`, 'success');
  };

  // Interactive Before/After slider dragging
  const handleSliderMove = useCallback((clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleSliderMove(e.clientX);
    },
    [isDragging, handleSliderMove]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches && e.touches.length > 0) {
        handleSliderMove(e.touches[0].clientX);
      }
    },
    [handleSliderMove]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  if (!isOpen || !product) return null;

  const isSupported = isClothingCategorySupported(product);

  return (
    <div
      className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto"
      onClick={() => {
        stopCameraStream();
        onClose();
      }}
    >
      <div
        className="bg-white dark:bg-[#161F30] rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-pink-100 dark:border-[#27354A] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 dark:border-[#27354A] bg-gradient-to-r from-pink-50/80 via-white to-pink-50/40 dark:from-[#1E293B] dark:to-[#161F30] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9F2089] via-[#D81B80] to-[#F43397] flex items-center justify-center text-white text-lg shadow-md shadow-pink-500/25 flex-shrink-0 animate-pulse">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span>✨ AI Virtual Try-On</span>
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-[#9F2089] dark:text-[#F43397] border border-pink-200 dark:border-pink-900/50">
                  Fitting Room
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                See how this product may look on you before buying.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#27354A] text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all shadow-xs hover:scale-105 cursor-pointer"
            title="Close Virtual Try-On"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Unsupported Garment Alert */}
          {!isSupported && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 rounded-2xl p-4 text-xs font-semibold leading-relaxed flex items-start gap-3">
              <span className="text-lg flex-shrink-0">⚠️</span>
              <div>
                <p className="font-bold">Virtual Try-On is currently available for wearable fashion products.</p>
                <p className="text-[11px] mt-1 text-amber-700 dark:text-amber-300">
                  Supported items include: T-Shirts, Shirts, Tops, Dresses, Kurtis, Sarees, Jackets, Jeans, Trousers, Skirts, and Ethnic Wear.
                </p>
              </div>
            </div>
          )}

          {/* Selected Product Card */}
          <div className="bg-gray-50 dark:bg-[#1E293B] border border-gray-200/80 dark:border-[#27354A] rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl overflow-hidden bg-white dark:bg-[#0B0F19] flex-shrink-0 border border-gray-200 dark:border-[#27354A]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#9F2089] dark:text-[#F43397]">
                  Selected Product
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.discount > 0 && (
                    <span className="text-[10px] font-bold text-[#038D63]">
                      {product.discount}% OFF
                    </span>
                  )}
                  <span className="text-[10px] bg-[#038D63] text-white px-1.5 py-0.2 rounded font-bold">
                    {product.rating} ★
                  </span>
                </div>
              </div>
            </div>

            {onOpenSizeGuide && (
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="hidden sm:flex text-xs font-bold text-[#9F2089] dark:text-[#F43397] underline items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <span>📏</span> Size Guide
              </button>
            )}
          </div>

          {/* Product Variant Controls (Color & Size) */}
          <div className="bg-white dark:bg-[#1E293B]/60 border border-gray-100 dark:border-[#27354A] rounded-2xl p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Selected Color: <span className="text-[#9F2089] dark:text-[#F43397] font-black">{selectedColor}</span>
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'border-[#9F2089] bg-pink-50 text-[#9F2089] dark:bg-[#0B0F19] dark:text-[#F43397] font-black ring-1 ring-[#9F2089]'
                          : 'border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Selected Size: <span className="text-[#9F2089] dark:text-[#F43397] font-black">{selectedSize || 'Choose'}</span>
                  </p>
                  {onOpenSizeGuide && (
                    <button
                      type="button"
                      onClick={onOpenSizeGuide}
                      className="text-[11px] font-bold text-[#9F2089] dark:text-[#F43397] underline sm:hidden cursor-pointer"
                    >
                      📏 Size Guide
                    </button>
                  )}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[38px] px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#9F2089] bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white shadow-2xs'
                          : 'border-gray-200 dark:border-[#27354A] text-gray-800 dark:text-gray-200 hover:border-[#9F2089]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 1: UPLOAD & TAKE PHOTO VIEW                          */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 'upload' && (
            <div className="space-y-4">
              {uploadError && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl p-3 text-xs font-semibold flex items-center justify-between animate-fade-in">
                  <span>⚠️ {uploadError}</span>
                  <button onClick={() => setUploadError(null)} className="font-bold underline ml-2 cursor-pointer">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-pink-300 dark:border-[#27354A] hover:border-[#9F2089] dark:hover:border-[#F43397] rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-gradient-to-b from-pink-50/40 to-white dark:from-[#1E293B]/50 dark:to-[#161F30] group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />

                <div className="w-16 h-16 mx-auto rounded-3xl bg-pink-100 dark:bg-[#1E293B] flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xs">
                  📸
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white mt-3">
                  Upload Your Photo
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  Drag and drop your photo here or choose from your device. Supported formats: JPG, JPEG, PNG, WEBP (Max 10MB).
                </p>

                <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>📷</span> Upload Your Photo
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCamera();
                    }}
                    className="px-4 py-2.5 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-200 text-xs font-bold rounded-xl hover:border-[#9F2089] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>📸</span> Take Photo
                  </button>
                </div>
              </div>

              {/* Photo Guidelines Card (All 6 rules) */}
              <div className="bg-gray-50 dark:bg-[#1E293B] rounded-2xl p-4 border border-gray-100 dark:border-[#27354A]">
                <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center gap-1.5">
                  <span>📋</span> Photo Guidelines
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Use a clear full-body or upper-body photo
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Stand in good lighting
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Keep your body clearly visible
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Avoid heavily covered or blurry photos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Prefer a front-facing photo
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#038D63] font-bold">✓</span> Avoid group photos
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                <span className="flex items-center gap-1">
                  <span>🔒</span> Privacy First: Your photo is processed only in-memory to generate your try-on preview.
                </span>
                <span className="text-[10px] font-semibold text-[#038D63]">100% Private</span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* CAMERA VIEW (LIVE WEBCAM VIEW)                            */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 'camera' && (
            <div className="space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-[4/3] max-w-lg mx-auto flex items-center justify-center border border-gray-800 shadow-xl">
                {cameraError ? (
                  <div className="p-6 text-center text-white space-y-3">
                    <p className="text-3xl">📷</p>
                    <p className="text-xs font-bold text-red-400 max-w-sm">{cameraError}</p>
                    <button
                      onClick={() => setStep('upload')}
                      className="px-4 py-2 bg-white text-gray-900 text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Back to Photo Upload
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder Guideline Box */}
                    <div className="absolute inset-8 border-2 border-white/40 border-dashed rounded-2xl pointer-events-none flex items-center justify-center">
                      <span className="text-white/80 text-xs bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                        Position yourself in center
                      </span>
                    </div>
                  </>
                )}
              </div>

              {!cameraError && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      stopCameraStream();
                      setStep('upload');
                    }}
                    className="px-4 py-2.5 border border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E293B] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <span>📸</span> Capture Photo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 2: PHOTO PREVIEW & CONFIRM TRY-ON                    */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 'preview' && userPhoto && (
            <div className="space-y-4">
              {uploadError && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl p-3 text-xs font-semibold flex items-center justify-between">
                  <span>⚠️ {uploadError}</span>
                  <button onClick={() => setUploadError(null)} className="font-bold underline ml-2 cursor-pointer">
                    Dismiss
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* User Photo Preview Card */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-[#27354A] bg-gray-50 dark:bg-[#0B0F19] aspect-[3/4] max-w-sm mx-auto w-full shadow-sm">
                  <img
                    src={userPhoto}
                    alt="Uploaded customer photo"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    Your Photo
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xs font-black shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white/90 text-[10px] py-1 px-2 rounded-lg backdrop-blur-xs text-center font-medium">
                    {photoDimensions.width} × {photoDimensions.height} px · Ready for Try-On
                  </div>
                </div>

                {/* Outfit Info & Action Buttons */}
                <div className="space-y-4">
                  <div className="bg-pink-50/50 dark:bg-[#1E293B]/60 border border-pink-100 dark:border-[#27354A] rounded-2xl p-4 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#9F2089] dark:text-[#F43397]">
                      Ready to Try On
                    </p>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {product.name}
                    </h4>
                    <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                      <p>
                        Garment Color: <strong className="text-gray-900 dark:text-white">{selectedColor}</strong>
                      </p>
                      <p>
                        Selected Size: <strong className="text-gray-900 dark:text-white">{selectedSize || 'Regular'}</strong>
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed pt-1 border-t border-gray-100 dark:border-[#27354A]">
                      Click below to generate your virtual outfit fit preview.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleStartTryOn}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#9F2089] via-[#D81B80] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] text-white font-extrabold rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-pink-500/25 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>✨</span>
                      <span>Try This Outfit</span>
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2.5 px-3 border border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E293B] text-center cursor-pointer transition-colors"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="py-2.5 px-3 text-red-500 hover:text-red-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 3: CREATING YOUR VIRTUAL TRY-ON (PROCESSING ANIMATION)*/}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 'processing' && (
            <div className="py-12 px-4 text-center space-y-6 max-w-md mx-auto">
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-24 h-24 border-4 border-pink-200 dark:border-[#27354A] border-t-[#9F2089] border-r-[#F43397] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  ✨
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  ✨ Creating Your Virtual Try-On...
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Please wait while we generate your preview.
                </p>
                <p className="text-xs font-bold text-[#9F2089] dark:text-[#F43397] mt-3 animate-pulse">
                  {processingStages[processingStep] || 'Generating preview...'}
                </p>
              </div>

              {/* Progress Stage Pills */}
              <div className="flex justify-center gap-1.5">
                {processingStages.map((stg, idx) => (
                  <div
                    key={idx}
                    title={stg}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx <= processingStep
                        ? 'w-7 bg-gradient-to-r from-[#9F2089] to-[#F43397]'
                        : 'w-2 bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-[#1E293B] p-3 rounded-xl border border-gray-100 dark:border-[#27354A] text-[11px] text-gray-500">
                Fitting Garment: <strong>{product.name}</strong> ({selectedColor} · {selectedSize || 'Regular'})
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════ */}
          {/* STEP 4: VIRTUAL TRY-ON RESULT & BEFORE/AFTER COMPARISON    */}
          {/* ══════════════════════════════════════════════════════════ */}
          {step === 'result' && tryOnResult && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-[#27354A] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                      ✨ Your Virtual Try-On
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        tryOnResult.isDemo
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                      }`}
                    >
                      {tryOnResult.isDemo ? 'Demo Mode' : 'AI Rendered'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Drag the slider to compare your original photo and virtual try-on preview.
                  </p>
                </div>

                {/* Slider vs Side-by-Side toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-[#1E293B] p-1 rounded-xl self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setViewMode('slider')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'slider'
                        ? 'bg-white dark:bg-[#0B0F19] text-[#9F2089] dark:text-[#F43397] shadow-2xs font-extrabold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Before ↔ After Slider
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('sideBySide')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'sideBySide'
                        ? 'bg-white dark:bg-[#0B0F19] text-[#9F2089] dark:text-[#F43397] shadow-2xs font-extrabold'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Side-by-Side
                  </button>
                </div>
              </div>

              {/* Development Mode Notice if real AI provider is unconfigured */}
              {tryOnResult.isDemo && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-base flex-shrink-0">ℹ️</span>
                  <div>
                    <p className="font-extrabold text-amber-900 dark:text-amber-100">
                      Virtual Try-On AI provider is not configured yet.
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                      The frontend and backend architecture are fully integrated and ready. Connect a real AI Virtual Try-On API key (<code>VTON_API_KEY</code>) in the backend to generate live ML garment synthesis.
                    </p>
                  </div>
                </div>
              )}

              {/* Comparison Canvas */}
              {viewMode === 'slider' ? (
                /* Interactive Before ↔ After Slider */
                <div
                  ref={sliderContainerRef}
                  onMouseDown={handleMouseDown}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  onTouchMove={handleTouchMove}
                  className="relative max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden select-none border border-gray-200 dark:border-[#27354A] shadow-lg bg-gray-950 cursor-ew-resize touch-none"
                >
                  {/* Before (Original Photo) */}
                  <img
                    src={userPhoto}
                    alt="Original Photo"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <span className="absolute bottom-3 left-3 bg-black/75 text-white text-[10px] font-black px-2.5 py-1 rounded-md backdrop-blur-xs pointer-events-none">
                    Before: Original Photo
                  </span>

                  {/* After (Virtual Try-on Result) with clipPath */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <img
                      src={tryOnResult.resultImage || userPhoto}
                      alt="Virtual Try-On Result"
                      className="absolute inset-0 w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none">
                      <div className="self-end bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md mb-2">
                        ✨ Outfit: {product.name} ({selectedColor})
                      </div>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-[#9F2089]/90 text-white text-[10px] font-black px-2.5 py-1 rounded-md backdrop-blur-xs pointer-events-none">
                      After: {tryOnResult.isDemo ? 'Try-On Preview' : 'AI Rendered'}
                    </span>
                  </div>

                  {/* Interactive Slider Divider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] z-20 pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#9F2089] shadow-xl border-2 border-pink-400 flex items-center justify-center text-xs font-black">
                      ◀▶
                    </div>
                  </div>
                </div>
              ) : (
                /* Side-by-Side Comparison */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-[#27354A] aspect-[3/4] bg-gray-50 dark:bg-[#0B0F19] shadow-xs">
                    <img
                      src={userPhoto}
                      alt="Original Photo"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      Before: Original
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#9F2089]/60 aspect-[3/4] bg-gray-50 dark:bg-[#0B0F19] shadow-sm">
                    <img
                      src={tryOnResult.resultImage || userPhoto}
                      alt="Virtual Try-On Preview"
                      className="w-full h-full object-cover filter contrast-105"
                    />
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#9F2089] to-[#F43397] text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                      ✨ {product.name} ({selectedColor})
                    </div>
                    <span className="absolute bottom-2 right-2 bg-[#9F2089] text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                      After: Try-On
                    </span>
                  </div>
                </div>
              )}

              {/* Variant Tweak Bar on Result Screen */}
              <div className="p-3 bg-gray-50 dark:bg-[#1E293B] rounded-2xl border border-gray-200 dark:border-[#27354A] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Try Variant:</span>
                  <span className="text-gray-500">Color: <strong>{selectedColor}</strong></span>
                  <span className="text-gray-500">Size: <strong>{selectedSize || 'Regular'}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleStartTryOn}
                  className="px-3 py-1.5 bg-pink-100 dark:bg-pink-950/60 text-[#9F2089] dark:text-[#F43397] border border-pink-200 dark:border-pink-800 rounded-xl font-bold hover:bg-pink-200 transition-colors cursor-pointer text-xs"
                >
                  ⚡ Re-render with Variant
                </button>
              </div>

              {/* ── Result Actions Bar (Requirement 10) ── */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {/* 1. Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-3 bg-gradient-to-r from-[#9F2089] to-[#F43397] hover:from-[#7D126C] hover:to-[#D81B80] text-white text-xs font-black rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 cursor-pointer"
                >
                  <span>🛒</span> Add to Cart
                </button>

                {/* 2. Add to Wishlist */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist?.(product.id)}
                  className={`py-3 px-3 border text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isWishlisted
                      ? 'border-pink-300 bg-pink-50 text-[#F43397] dark:bg-pink-950/40'
                      : 'border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-300 hover:border-pink-300'
                  }`}
                >
                  <span>{isWishlisted ? '❤️' : '🤍'}</span> Wishlist
                </button>

                {/* 3. Try Another Photo */}
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="py-3 px-3 bg-gray-100 dark:bg-[#1E293B] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🔄</span> Try Another Photo
                </button>

                {/* 4. Try Another Product */}
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    onClose();
                  }}
                  className="py-3 px-3 border border-gray-200 dark:border-[#27354A] text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>👗</span> Other Products
                </button>

                {/* 5. Back to Product */}
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    onClose();
                  }}
                  className="py-3 px-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1"
                >
                  <span>↩</span> Back to Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
