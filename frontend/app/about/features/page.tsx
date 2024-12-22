import React from "react";

const Features = () => {
  return (
    <div className="max-w-6xl mx-auto pt-4 pb-14">
      <div id="features" className="text-center mr-6 ml-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-500 font-medium transition-colors duration-300 m-6">
          Features
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-xl w-2/3 font-bold text-center text-gray-800 mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam
            condimentum vel.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-md mb-3">
                <span className="text-gray-600 text-lg">Logo {index + 1}</span>
              </div>
              <p className="text-gray-600">
                Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical
                Latin literature from 45 BC.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
