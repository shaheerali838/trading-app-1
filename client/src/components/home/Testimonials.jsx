import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import PropTypes from "prop-types";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import AnimatedHeading from "../../components/animation/AnimateHeading";
import avatarIImg from "../../assets/1.jpg";
import avatarIIImg from "../../assets/2.jpg";
import avatarIIIImg from "../../assets/3.jpg";
import avatarIVImg from "../../assets/4.jpg";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import "./Testimonials.css";

const Testimonials = (props) => {
  const testimonials = [
    {
      id: 1,
      name: "Wood",
      avatar: avatarIImg,
      testimonial:
        "I am extremely satisfied with the services provided by this company. Their team is professional, efficient, and always goes above and beyond to meet my needs. I highly recommend them to anyone in need of reliable and high-quality services.",
    },
    {
      id: 2,
      name: "Chris",
      avatar: avatarIIImg,
      testimonial:
        "I have been using the services of this company for several years now, and I have always been impressed with their quality and reliability. Their team is knowledgeable and always provides excellent customer service. I would not hesitate to recommend them to anyone in need of professional services.",
    },
    {
      id: 3,
      name: "Smith",
      avatar: avatarIIIImg,
      testimonial:
        "I have had a positive experience with this company. Their team is friendly and helpful, and they always go the extra mile to ensure that my needs are met. I would definitely recommend them to anyone in need of reliable and high-quality services.",
    },
    {
      id: 4,
      name: "James",
      avatar: avatarIVImg,
      testimonial:
        "I have had a positive experience with this company. Their team is friendly and helpful, and they always go the extra mile to ensure that my needs are met. I would definitely recommend them to anyone in need of reliable and professional services.",
    },
  ];
  return (
    <section
      className={`${props.mode}  testimonials min-h-screen flex flex-col items-center justify-center  text-center`}
    >
      <AnimatedHeading>
        <h2
          className={`${
            props.mode === "dark-class" ? "dark-class" : "light-class"
          }  text-4xl font-bold mb-8 `}
        >
          Testimonials
        </h2>
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
        className="mySwiper "
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
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="swiper-slide ">
            <div
              style={{
                paddingRight: 20,
                paddingLeft: 20,
              }}
              className={`${
                props.mode === "dark-class"
                  ? "bg-gradient-reverse"
                  : " bg-gray-400 rounded-xl p-5"
              } `}
            >
              <div className="testimonials-profile-circle">
                <img
                  src={testimonial.avatar}
                  alt="testimonial-avatar"
                  className="testimonial-avatar"
                />
              </div>
              <p
                className={`${
                  props.mode === "dark-class"
                    ? "bg-transparent text-white"
                    : "bg-transparent"
                } text-gray-800`}
              >
                {testimonial.name}
              </p>
              <p
                className={`${
                  props.mode === "dark-class"
                    ? "bg-transparent"
                    : "text-gray-600 bg-transparent"
                } testimonial-text`}
              >
                {testimonial.testimonial}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

Testimonials.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default Testimonials;
