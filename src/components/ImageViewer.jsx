import React, { useState } from "react";
import "./ImageViewer.css";

import pic1 from "../assets/pic1.jpg";
import pic2 from "../assets/pic2.jpg";
import pic3 from "../assets/pic3.jpg";
import pic4 from "../assets/pic4.jpg";
import pic5 from "../assets/pic5.jpg";

const images = [
    pic1,
    pic2,
    pic3,
    pic4,
    pic5
];

const ImageViewer = () => {
    const [selectedImage, setSelectedImage] = useState(images[0]);


    const imageName = selectedImage.split("/").pop().split(".")[0];

    return (
        <div className="image-viewer">
            <h2>
                <a href="#">Click on an image!</a>
            </h2>

            <div className="thumbnails">
                {images.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        className={`thumbnail ${selectedImage === src ? "active" : ""}`}
                        onClick={() => setSelectedImage(src)}
                    />
                ))}
            </div>

            {/* ——— Creative Card ——— */}
            <div className="selected-info">
                <p>🌟 Ta‑da! You’ve picked <strong>{imageName}</strong>!</p>
                <p>Isn’t it purr‑fect? 😻</p>
            </div>

            <h2>Selected Image</h2>
            <div className="selected-container">
                <img
                    src={selectedImage}
                    alt="Selected"
                    className="selected-image"
                />
            </div>
        </div>
    );
};

export default ImageViewer;
