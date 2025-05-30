"use client";
import {  useEffect, useState } from "react";
import { ISport } from "../models/Sport";


export default function Sport() {
    const [sports, setSports] = useState<ISport[]>([]);
    const [ setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchSports = async () => {
        try {
          const response = await fetch("/api/sports");
          if (!response.ok) throw new Error("Failed to fetch sports");
          const data = await response.json();
          setSports(data);
        } catch (error) {
         console.error("Error fetching sports:", error);
        } finally {
          console.log("Sports fetched successfully");
        }
      };
  
      fetchSports();
    }, []);
  

  return (
    <>
      <div className="p-4 bg-white dark:bg-base-100 shadow-lg rounded-md my-12 mx-5 sm:mx-24 max-w-full">
        <h1 className="font-semibold mb-2 text-black dark:text-white text-[1.2rem] w-full">All Sports</h1>
        <div className="carousel rounded-box flex overflow-x-auto snap-x snap-mandatory px-5 space-x-4">
          {sports.map((sport) => (
            <div className="carousel-item flex-shrink-0 w-64" key={sport._id}>
              <div key={sport._id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
               <h2 className="text-lg font-bold text-black dark:text-white">{sport.sportName}</h2>
               <p className="text-gray-600 dark:text-gray-400">{sport.description}</p>
             </div>
            </div>
          ))}
        </div>
      </div>
    
    </>
  );
}