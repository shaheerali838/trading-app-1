import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import avatarIImg from "../../assets/1.jpg";
import avatarIIImg from "../../assets/1.jpg";
import avatarIIIImg from "../../assets/1.jpg";
import avatarIVImg from "../../assets/1.jpg";
import avatarVImg from "../../assets/1.jpg";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "./Testimonials.css";

const Testimonials = () => {
  return (
    <section className="testimonials min-h-screen flex flex-col items-center justify-center bg-gradient-reverse text-white text-center">
      <AnimatedHeading>
        <h2 className="text-4xl font-bold mb-8 text-white">Testimonials</h2>
      </AnimatedHeading>
      <Swiper
        loop={true}
        loopFillGroupWithBlank={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="mySwiper"
        effect={"coverflow"}
        coverflowEffect={{
          rotate: 10,
          stretch: 50,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 150,
          },
        }}
      >
        <SwiperSlide className="swiper-slide">
          <div
            style={{
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <div className="testimonials-profile-circle">
              <img
                src={avatarIImg}
                alt="testimonial-avatar"
                className="testimonial-avatar"
              />
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique
              praesentium voluptate natus sunt, molestiae dolorum?
            </p>
            <button className="bg-secondary px-1 py-1 rounded-md text-black">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <div
            style={{
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <div className="testimonials-profile-circle">
              <img
                src={avatarIIImg}
                alt="testimonial-avatar"
                className="testimonial-avatar"
                loading="lazy"
              />
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio, animi libero facere eligendi illo consectetur!
            </p>
            <button className="bg-secondary px-1 py-1 rounded-md text-black">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <div
            style={{
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <div className="testimonials-profile-circle">
              <img
                src={avatarIIIImg}
                alt="testimonial-avatar"
                className="testimonial-avatar"
              />
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt
              id quaerat, quas minus cum provident?
            </p>
            <button className="bg-secondary mt-2 px-1 py-1 rounded-md text-black">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className=" ">
          <div
            style={{
              paddingRight: 20,

              paddingLeft: 20,
            }}
          >
            <div className="testimonials-profile-circle">
              <img
                src={avatarIVImg}
                alt="testimonial-avatar"
                className="testimonial-avatar"
              />
            </div>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cumque
              culpa suscipit, ad iure esse nihil?
            </p>
            <button className="bg-secondary px-1 py-1 rounded-md text-black">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide className="swiper-slide">
          <div
            style={{
              paddingRight: 20,
              paddingLeft: 20,
            }}
          >
            <div className="testimonials-profile-circle">
              <img
                src={avatarVImg}
                alt="testimonial-avatar"
                className="testimonial-avatar"
              />
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
              dicta, quibusdam dolor eligendi quaerat nulla.
            </p>
            <button className="bg-secondary px-1 py-1 rounded-md text-black">
              Learn More
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default Testimonials;
