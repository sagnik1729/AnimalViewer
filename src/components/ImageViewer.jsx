// import React, { useState } from "react";
// import "./ImageViewer.css";

// import pic1 from "../assets/pic1.jpg";
// import pic2 from "../assets/pic2.jpg";
// import pic3 from "../assets/pic3.jpg";
// import pic4 from "../assets/pic4.jpg";
// import pic5 from "../assets/pic5.jpg";

// const images = [
//     pic1,
//     pic2,
//     pic3,
//     pic4,
//     pic5
// ];

// const ImageViewer = () => {
//     const [selectedImage, setSelectedImage] = useState(images[0]);


//     const imageName = selectedImage.split("/").pop().split(".")[0];

//     return (
//         <div className="image-viewer">
//             <h2>
//                 <a href="#">Click on an image!</a>
//             </h2>

//             <div className="thumbnails">
//                 {images.map((src, idx) => (
//                     <img
//                         key={idx}
//                         src={src}
//                         alt={`Thumbnail ${idx + 1}`}
//                         className={`thumbnail ${selectedImage === src ? "active" : ""}`}
//                         onClick={() => setSelectedImage(src)}
//                     />
//                 ))}
//             </div>

//             {/* ——— Creative Card ——— */}
//             <div className="selected-info">
//                 <p>🌟 Ta‑da! You’ve picked <strong>{imageName}</strong>!</p>
//                 <p>Isn’t it purr‑fect? 😻</p>
//             </div>

//             <h2>Selected Image</h2>
//             <div className="selected-container">
//                 <img
//                     src={selectedImage}
//                     alt="Selected"
//                     className="selected-image"
//                 />
//             </div>
//         </div>
//     );
// };

// export default ImageViewer;

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ImageViewer.css";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const QUERY = "animal";
const PER_PAGE = 12;

export default function ImageViewer() {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedImage, setSelected] = useState(null);
    const loaderRef = useRef(null);

    // 1) Fetch a page of animal photos
    const fetchPhotos = useCallback(async () => {
        try {
            const res = await fetch(
                `https://api.unsplash.com/search/photos?query=${QUERY}&page=${page}&per_page=${PER_PAGE}`,
                { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
            );
            const { results } = await res.json();




            setPhotos(prev => {
                const all = [...prev, ...results];
                // on very first load, pick the first one
                if (!selectedImage && all.length > 0) {
                    setSelected(all[0].urls.regular);
                }
                return all;
                // 1. Prevent duplicates in your data
                // If the same photo ID shows up twice in your photos array (e.g. because your “infinite scroll” fetched the same result twice), filter them out when you merge pages:
                // setPhotos(prev => {
                //     // merge old + new
                //     const merged = [...prev, ...results];
                //     // use a Map to drop any duplicate IDs
                //     const unique = Array.from(
                //         new Map(merged.map(photo => [photo.id, photo])).values()
                //     );
                //     // on first load, pick the first unique photo
                //     if (!selectedImage && unique.length > 0) {
                //         setSelected(unique[0].urls.regular);
                //     }
                //     return unique;
            });
        } catch (err) {
            console.error("Unsplash fetch error:", err);
        }
    }, [page, selectedImage]);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    // 2) Infinite‐scroll trigger inside the thumbnails container
    useEffect(() => {
        if (!loaderRef.current) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setPage(p => p + 1);
                }
            },
            {
                root: loaderRef.current.parentNode, // the .thumbnails div
                rootMargin: "0px",
                threshold: 1.0,
            }
        );
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, []);

    // 3) Grab alt text for the creative card
    const selectedPhotoObj = photos.find(p => p.urls.regular === selectedImage);
    const altDesc = selectedPhotoObj?.alt_description || "adorable animal";

    return (
        <div className="image-viewer">
            <h2><a href="#">Click on an image!</a></h2>

            <div className="thumbnails">
                {photos.map((photo, idx) => (
                    <img
                        key={`${photo.id}-${idx}`}
                        src={photo.urls.small}
                        alt={photo.alt_description || "Animal"}
                        className={`thumbnail ${selectedImage === photo.urls.regular ? "active" : ""
                            }`}
                        onClick={() => setSelected(photo.urls.regular)}
                        draggable={false}
                    />
                ))}

                {/* tiny sentinel to load more when scrolled into view */}
                <div ref={loaderRef} className="loading-sentinel" />
            </div>

            {selectedImage && (
                <>
                    <div className="selected-info">
                        <p>🌟 Ta‑da! You’ve picked <strong>{altDesc}</strong>!</p>
                        <p>Isn’t it purr‑fect? 😻</p>
                    </div>

                    <h2>Selected Image</h2>
                    <div className="selected-container">
                        <img
                            src={selectedImage}
                            alt={altDesc}
                            className="selected-image"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
