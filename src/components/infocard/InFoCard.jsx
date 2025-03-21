import React from 'react';
import image1 from '../../assets/image1.jpg';
import image2 from '../../assets/image2.jpg';
import image3 from '../../assets/image3.jpg';
import image4 from '../../assets/image4.jpg';
import image5 from '../../assets/image5.jpg';
import './infocard.css';

const cards = [
  {
    image: image1,
    title: 'New York Central Park',
    description: 'Located in the heart of Manhattan, The Ritz-Carlton offers luxurious accommodations with stunning views of Central Park.',
  },
  {
    image: image2,
    title: 'Burj Al Arab',
    description: "Known as the world's most luxurious hotel, Burj Al Arab is an iconic symbol of modern Dubai.",
  },
  {
    image: image3,
    title: 'The Savoy',
    description: 'A historic hotel located on the Strand, The Savoy combines traditional elegance with contemporary luxury.',
  },
  {
    image: image4,
    title: 'Aman Tokyo',
    description: 'Aman Tokyo offers a serene retreat in the bustling metropolis of Tokyo.',
  },
  {
    image: image5,
    title: 'Four Seasons Resort Bora Bora',
    description: 'ituated on a private island in the South Pacific, Four Seasons Resort Bora Bora offers overwater bungalows and beachfront villas with stunning lagoon views.',
  },
];

const InFoCard = () => {
  return (
    <>
   <div className="my-14 flex-1">
  <h3 className="text-center font-bold text-4xl ">Popular Hotel</h3>
</div>
    <div className="body">
      <main>
        {cards.map((card, index) => (
          <div className="cards" key={index}>
            <img src={card.image} alt={card.title} className="image" />
            <img src={card.image} alt={card.title} className="backgrounds" />
            <div className="layer">
              <div className="info">
                <h1>{card.title}</h1>
                <p>{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
    
    </>
  );
};

export default InFoCard;
