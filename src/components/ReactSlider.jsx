import React, { Component, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import img1 from "../assets/slide1.jpg"
import img2 from "../assets/slide2.jpg"
import img3 from "../assets/slider3.jpg"
import img4 from "../assets/img4.jpg"
import './sliders.css'
// import { GoChevronLeft } from "react-icons/go";

const ReactSlider = () => {
  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const carouselRef = useRef(null);
  const listRef = useRef(null);
  const thumbnailRef = useRef(null);
  const timeRef = useRef(null);

  const items = [
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-WMC-Sylhet.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    },
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-CP-Sundarbans-NP.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    },
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-CP-Sreemangal.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    },
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-CP-Keokradong.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    } ,
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-US-Coxs-Bazar.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    },
    {
      img:"https://wander-lush.org/wp-content/uploads/2022/03/Most-eautiful-places-in-Bangladesh-CP-St-Martins-Island.jpg",
      author: 'REACT',
      title: 'DESIGN SLIDER',
      topic: 'NATURAL',
      description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut sequi, rem magnam nesciunt minima placeat, itaque eum neque officiis unde, eaque optio ratione aliquid assumenda facere ab et quasi ducimus aut doloribus non numquam. Explicabo, laboriosam nisi reprehenderit tempora at laborum natus unde. Ut, exercitationem eum aperiam illo illum laudantium?',
      button1: 'SEE MORE',
      button2: 'LOGIN'
    }

  ];

  useEffect(() => {
    let nextDom = nextRef.current;
    let prevDom = prevRef.current;
    let carouselDom = carouselRef.current;
    let SliderDom = listRef.current;
    let thumbnailBorderDom = thumbnailRef.current;
    let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
    let timeDom = timeRef.current;

    thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    let timeRunning = 3000;
    let timeAutoNext = 7000;

    nextDom.onclick = function () {
      showSlider('next');
    };

    prevDom.onclick = function () {
      showSlider('prev');
    };

    let runTimeOut;
    let runNextAuto = setTimeout(() => {
      nextDom.click();
    }, timeAutoNext);

    function showSlider(type) {
      let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
      let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

      if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
      } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
      }
      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
      }, timeRunning);

      clearTimeout(runNextAuto);
      runNextAuto = setTimeout(() => {
        nextDom.click();
      }, timeAutoNext);
    }
  }, []);

  return (
    <>
      <div className="carousel" ref={carouselRef}>
        <div className="list" ref={listRef}>
          {items.map((item, index) => (
            <div className="item" key={index}>
              <img src={item.img} alt={`img${index + 1}`} />
              {/* <div className="content">
                <div className="author">{item.author}</div>
                <div className="title">{item.title}</div>
                <div className="topic">{item.topic}</div>
                <div className="des">{item.description}</div>
                <div className="buttons">
                  <button>{item.button1}</button>
                  <button>{item.button2}</button>
                </div>
              </div> */}
            </div>
          ))}
        </div>

        <div className="thumbnail" ref={thumbnailRef}>
          {items.map((item, index) => (
            <div className="item" key={index}>
              <img src={item.img} alt={`thumbnail${index + 1}`} />
              <div className="content">
               
              </div>
            </div>
          ))}
        </div>

        <div className="arrows">
          <button id="prev" ref={prevRef}>&lt;</button>
          <button id="next" ref={nextRef}>&gt;</button>
        </div>

        <div className="time" ref={timeRef}></div>
      </div>
    </>
  );
}

export default ReactSlider