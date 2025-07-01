import React from "react";

const Instruments: React.FC = () => {
  const instruments = [
    { id: 1, name: "Guitar" },
    { id: 2, name: "Piano" },
    { id: 3, name: "Drums" },
    { id: 4, name: "Violin" },
    { id: 5, name: "Saxophone" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Musical Instruments</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {instruments.map((instrument) => (
          <li key={instrument.id} className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-lg font-semibold">{instrument.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Instruments;
