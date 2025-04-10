import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const ReviewSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "The quality of toys is exceptional! My kids love playing with them, and I appreciate the safety standards."
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      comment: "Fast delivery and great customer service. The toys are durable and perfect for my little ones."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4,
      comment: "The educational toys are fantastic! They help my children learn while having fun. Highly recommended!"
    },
    {
      id: 4,
      name: "David Wilson",
      rating: 5,
      comment: "Great variety of toys for different age groups. The packaging is eco-friendly too!"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 font-comfortaa">What Our Customers Say</h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10 hidden sm:block"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          {/* Reviews Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full flex-shrink-0 px-2 sm:px-4"
                >
                  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
                    <div className="mb-4 md:mb-6">
                      <h3 className="font-semibold text-base md:text-lg font-comfortaa">{review.name}</h3>
                      <div className="flex items-center mt-1">
                        {[...Array(review.rating)].map((_, index) => (
                          <Star
                            key={index}
                            className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 font-comfortaa">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-4 md:mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection; 