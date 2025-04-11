import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="font-comfortaa">
      {/* Hero Section */}
      <div className="bg-[#00B4D8] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-Baloo">
            Our Story
          </h1>
          <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto">
            Bringing joy to children and peace of mind to parents since 2025
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1572A1] mb-2 font-Baloo">Our Mission</h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            At ToyNest, we believe that toys are more than just playthings—they're tools for growth, 
            learning, and development. Our mission is to provide children with high-quality, 
            safe, and educational toys that inspire creativity, foster cognitive development, 
            and bring endless joy to their formative years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-[#00B4D8] text-white rounded-full mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Educational Focus</h3>
            <p className="text-gray-600">
              We carefully select toys that promote learning and development through play, helping children build essential skills while having fun.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-[#00B4D8] text-white rounded-full mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Safety First</h3>
            <p className="text-gray-600">
              Every product we carry meets or exceeds safety standards. We prioritize your child's well-being above all else.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-[#00B4D8] text-white rounded-full mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Earth-Friendly</h3>
            <p className="text-gray-600">
              We're committed to offering eco-friendly options, teaching children to care for our planet from an early age.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1572A1] mb-2 font-Baloo">The ToyNest Journey</h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4 text-[#00B4D8]">How We Started</h3>
            <p className="text-gray-600 mb-4">
              ToyNest began in 2025 as a small family store in Vadodara, founded by Ananya Patel, 
              a former kindergarten teacher with a passion for early childhood education. 
              After noticing how the right toys could transform her students' learning experience, 
              Ananya decided to create a space where parents could find toys that were not just fun, 
              but also educational and safe.
            </p>
            <p className="text-gray-600">
              What started as a modest shop with carefully curated toys has now grown into 
              Gujarat's beloved toy destination, serving thousands of families across the region. 
              Despite our growth, we maintain the same personal touch and commitment to quality 
              that guided us from day one.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-[#00B4D8]">Where We Are Today</h3>
            <p className="text-gray-600 mb-4">
              Today, ToyNest offers a vast selection of toys, games, and educational materials for children 
              of all ages, from infants to young teens. Our physical store in Vadodara continues to be a 
              cherished destination for local families, while our online store extends our reach to 
              customers throughout India.
            </p>
            <p className="text-gray-600">
              We remain committed to our core principles: providing exceptional customer service, offering 
              expert guidance to parents, and most importantly, ensuring that every child finds toys that 
              inspire their imagination and fuel their development.
            </p>
          </div>
        </div>
      </div>

     
      {/* Values Section */}
      <div className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1572A1] mb-2 font-Baloo">Our Values</h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8] border-b border-gray-200 pb-2">Child-Centered Approach</h3>
              <p className="text-gray-600">
                We view every decision through the lens of what's best for children. This means prioritizing 
                developmental benefits, safety, and joy in everything we offer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8] border-b border-gray-200 pb-2">Quality Over Quantity</h3>
              <p className="text-gray-600">
                We carefully select each product in our inventory, focusing on durability, educational value, 
                and the joy it brings rather than simply stocking shelves with the latest trends.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8] border-b border-gray-200 pb-2">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to reducing our environmental footprint by offering eco-friendly toy options 
                and implementing sustainable business practices throughout our operations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8] border-b border-gray-200 pb-2">Community Focus</h3>
              <p className="text-gray-600">
                We see ourselves as more than just a store—we're an active part of the community, supporting local 
                schools, organizing events, and creating spaces where families can connect.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1572A1] mb-2 font-Baloo">Visit Our Store</h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Location</h3>
              <p className="text-gray-600"></p>
              <p className="text-gray-600">Vadodara, Gujarat 390001</p>
              <p className="text-gray-600">India</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Store Hours</h3>
              <p className="text-gray-600">Monday - Friday: 10AM - 8PM</p>
              <p className="text-gray-600">Saturday: 9AM - 9PM</p>
              <p className="text-gray-600">Sunday: 11AM - 6PM</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3 text-[#00B4D8]">Contact</h3>
              <p className="text-gray-600">Phone: +91 98765 43210</p>
              <p className="text-gray-600">Email: info@toynest.com</p>
              <p className="text-gray-600">Customer Service: support@toynest.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#00B4D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-Baloo">Visit ToyNest Today</h2>
          <p className="text-white text-lg max-w-2xl mx-auto mb-8">
            Experience our carefully curated collection of toys that educate, inspire, and bring joy to children of all ages.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/products" 
              className="inline-block bg-white hover:bg-gray-100 text-[#1572A1] px-6 py-3 rounded-full font-medium transition-colors"
            >
              Shop Our Collection
            </Link>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;