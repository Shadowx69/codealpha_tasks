import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1 className="about-title">Welcome to WonderLand!</h1>
        <p className="about-subtitle">Where Imagination Comes to Life</p>
      </section>
      <section className="about-content">
        <div className="about-description">
          <h2>Our Magical Story</h2>
          <p>
            Once upon a time in 2025, WonderLand ToyStore opened its doors to a world of fun. We started with a simple dream: to create a place where every child's imagination could run wild. From the tiniest trinkets to the grandest playsets, our shelves are stocked with magic waiting to be discovered.
          </p>
          <h2>Our Mission</h2>
          <p>
            We are on a mission to fill every playroom with laughter and creativity. We believe that play is the most serious work children do, and we're here to provide the best tools for the job—safe, exciting, and full of wonder!
          </p>
          <h2>A World of Fun</h2>
          <p>
            Whether you are a brave knight, a space explorer, or a tea party host, we have something for you. Our collection is hand-picked to spark joy and encourage learning through play.
          </p>
        </div>
        <div className="about-values">
          <h2>Why Parents Love Us</h2>
          <ul>
            <li>✨ Curated selection of safe & durable toys</li>
            <li>🚀 Inspiring creativity & development</li>
            <li>🌈 Inclusive toys for every dreamer</li>
            <li>💖 Passionate about bringing smiles</li>
          </ul>
        </div>
      </section>
      <footer className="about-footer">
        <p>&copy; 2025 WonderLand ToyStore. Spreading Joy Everywhere!</p>
      </footer>
    </div>
  );
};

export default About;
