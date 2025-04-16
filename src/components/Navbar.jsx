import React from "react";
import "./NavBar.css";
import { SiAnimalplanet } from "react-icons/si";

const NavBar = () => (
    <nav className="navbar">
        <div className="logo"><SiAnimalplanet /> AnimalViewer</div>
        <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Gallery</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>
);

export default NavBar;
