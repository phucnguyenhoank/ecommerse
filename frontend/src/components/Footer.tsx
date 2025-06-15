import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-links">
        <div>
          <img src="https://stitched-lb.com/wp-content/uploads/2024/07/Stitched-white@4x.png" alt="Stitched-lb" />
        </div>
        <div>
          <h3>SHOP NOW</h3>
          <ul>
            <li><a href="#">Clothing</a></li>
            <li><a href="#">Swimwear</a></li>
            <li><a href="#">Accessories</a></li>
            <li><a href="#">Sale</a></li>
            <li><a href="#">Wishlist</a></li>
          </ul>
        </div>
        <div>
          <h3>USEFUL LINKS</h3>
          <ul>
            <li><a href="#">My account</a></li>
            <li><a href="#">Get in Touch</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms and Conditions</a></li>
            <li><a href="#">Price Match Policy</a></li>
          </ul>
        </div>
        <div>
          <h3>STAY UP-TO-DATE</h3>
          <form>
            <input type="email" placeholder="Your email address" />
            <button type="submit">SIGN UP</button>
          </form>
          <div className="social-links">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} color="white" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} color="white" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>STITCHED © 2024 | DESIGNED & DEVELOPED BY 
          <a href="https://www.tedmob.com" target="_blank" rel="noopener noreferrer" className="instagram-link"> TEDMOB.COM</a>
        </p>
      </div>
    </div>
  );
};
export default Footer;
