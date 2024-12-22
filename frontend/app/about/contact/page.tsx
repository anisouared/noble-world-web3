import React from "react";

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto pt-12 ">
      <div id="contactus" className="text-center mr-6 ml-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-500 font-medium transition-colors duration-300 m-6">
          Contact US
        </h1>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl w-2/3 font-bold text-center text-gray-800 mb-1">You want to know more ?</h1>
        </div>
        <div id="contactus" className="mb-8 text-center">
          <div className="flex flex-col md:flex-row justify-center items-start">
            <div className="w-full md:w-1/2 p-4 mt-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Location</h2>
              <p className="text-gray-600 mb-6">Paris, France</p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Address</h2>
              <p className="text-gray-600 mb-6">contact@nobleworld.com</p>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">Phone Number</h2>
              <p className="text-gray-600">+33 (611) 22-33-44</p>
            </div>

            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h2>
              <form className="flex flex-col space-y-4">
                <input type="text" placeholder="Your Name" className="p-2 border border-gray-300 rounded" required />
                <input type="email" placeholder="Your Email" className="p-2 border border-gray-300 rounded" required />
                <textarea placeholder="Your Message" className="p-2 border border-gray-300 rounded" rows={4} required />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
