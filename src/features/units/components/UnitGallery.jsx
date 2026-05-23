import React, { useRef, useState } from "react";
import { FiUpload, FiTrash2, FiCloudSnow, FiMaximize } from "react-icons/fi";
import "../../../css/unitGallery.css";

const UnitGallery = () => {
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      label: "Living room",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=80",
      label: "Bedroom",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80",
      label: "Bathroom",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, i) => ({
      id: Date.now() + i,
      url: URL.createObjectURL(file),
      label: file.name.split(".")[0],
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (activeIndex >= filtered.length)
        setActiveIndex(Math.max(0, filtered.length - 1));
      return filtered;
    });
  };

  const featured = images[activeIndex];

  return (
    <div className="card sectionCard">
      <div className="sectionHeader">
        <h3>Unit photos</h3>
        <button className="addBtn" onClick={() => fileInputRef.current.click()}>
          <FiUpload /> Upload photos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleUpload}
        />
      </div>

      {images.length === 0 ? (
        <div
          className="galleryEmpty"
          onClick={() => fileInputRef.current.click()}
        >
          <FiCloudSnow />
          <p>No photos yet. Click to upload.</p>
        </div>
      ) : (
        <div className="galleryGrid">
          {/* FEATURED */}
          <div className="galleryFeatured">
            <img
              src={featured.url}
              alt={featured.label}
              className="galleryFeaturedImg"
            />
            <span className="imgLabel">{featured.label}</span>
            <span className="imgCount">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              className="imgDelete"
              onClick={(e) => handleDelete(featured.id, e)}
            >
              <FiTrash2 />
            </button>
          </div>

          {/* THUMBNAILS */}
          <div className="galleryThumbs">
            {images.slice(0, 3).map((img, i) => (
              <div
                key={img.id}
                className={`galleryThumb ${i === activeIndex ? "galleryThumbActive" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="galleryThumbImg"
                />
                <span className="imgLabelSm">{img.label}</span>
                <button
                  className="imgDelete imgDeleteSm"
                  onClick={(e) => handleDelete(img.id, e)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}

            {/* UPLOAD SLOT */}
            <div
              className="galleryUploadSlot"
              onClick={() => fileInputRef.current.click()}
            >
              <FiMaximize />
              <span>Add photos</span>
              {images.length > 3 && (
                <span className="moreCount">+{images.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitGallery;
