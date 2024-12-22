import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const Team = () => {
  return (
    <div className="max-w-7xl mx-auto pt-4 pb-8">
      <div id="team" className="text-center mr-6 ml-6">
        <h1 className="text-4xl font-bold mb-6 text-gray-500 font-medium transition-colors duration-300 m-6">Team</h1>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl w-2/3 font-bold text-center text-gray-800 mb-4">Meet our Team</h1>
          <h2 className="text-l w-2/3 font-medium text-center text-gray-800 mb-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam
            condimentum vel.
          </h2>
        </div>
        <div className="mb-8 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card key={1} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`/images/team/manuel.jpg`} // Remplacez par le chemin de votre image
                alt={`Team Member`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <CardTitle className="text-xl font-bold text-gray-800">Manuel Proquin</CardTitle>
                <p className="text-gray-600">Consultant</p>
              </CardContent>
            </Card>
            <Card key={1} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`/images/team/philippe.jpg`} // Remplacez par le chemin de votre image
                alt={`Team Member`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <CardTitle className="text-xl font-bold text-gray-800">Philippe Delahaye</CardTitle>
                <p className="text-gray-600">Consultant</p>
              </CardContent>
            </Card>
            <Card key={1} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={`/images/team/jeremy.jpg`} // Remplacez par le chemin de votre image
                alt={`Team Member`}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <CardTitle className="text-xl font-bold text-gray-800">Jérémy Montheau</CardTitle>
                <p className="text-gray-600">Consultant</p>
              </CardContent>
            </Card>
            <Card key={1} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex justify-center">
                <img src={`/images/team/anis.jpg`} alt={`Team Member`} className="w-full h-48 object-cover" />
              </div>

              <CardContent className="p-4">
                <CardTitle className="text-xl font-bold text-gray-800">Anis OUARED</CardTitle>
                <p className="text-gray-600">Developer</p>
              </CardContent>
            </Card>
          </div>
          <p className="font-medium text-center text-gray-800 pt-14">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et dignissim quam
            condimentum vel, lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue arcu, In et
            dignissim quam condimentum vel, lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed congue
            arcu, In et dignissim quam condimentum vel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;
