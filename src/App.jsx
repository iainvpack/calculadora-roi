import { useState } from "react";

function App() {
  const [data, setData] = useState({
    machineCost: 80000,
    installCost: 5000,
    speed: 30,
    hours: 8,
    days: 22,
    oee: 85,
    unitsPerBox: 10,
    pricePerBox: 1.5,
    materialCost: 0.02,
    laborCost: 2500,
    energyCost: 500,
    maintenanceCost: 300,
  });

  const handleChange = (key, value) => {
    setData(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const fields = [
    { label: "Costo máquina (€)", key: "machineCost" },
    { label: "Costo instalación (€)", key: "installCost" },
    { label: "Velocidad (stickpacks/min)", key: "speed" },
    { label: "Horas por día", key: "hours" },
    { label: "Días por mes", key: "days" },
    { label: "Eficiencia OEE (%)", key: "oee" },
    { label: "Unidades por estuche", key: "unitsPerBox" },
    { label: "Precio por estuche (€)", key: "pricePerBox" },
    { label: "Costo por stickpack (€)", key: "materialCost" },
    { label: "Mano de obra mensual (€)", key: "laborCost" },
    { label: "Costo energía mensual (€)", key: "energyCost" },
    { label: "Mantenimiento mensual (€)", key: "maintenanceCost" },
  ];

  // Cálculos
  const monthlyStickpacks = data.speed * 60 * data.hours * data.days * (data.oee / 100);
  const monthlyBoxes = monthlyStickpacks / data.unitsPerBox;
  const revenue = monthlyBoxes * data.pricePerBox;
  const operatingCosts = (monthlyStickpacks * data.materialCost) + data.laborCost + data.energyCost + data.maintenanceCost;
  const netProfit = revenue - operatingCosts;
  const totalInvestment = data.machineCost + data.installCost;
  const annualROI = (netProfit * 12 / totalInvestment) * 100;

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#333] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-center text-[#222]">Calculadora ROI - <span className="text-orange-500">INVpack</span></h1>

        <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
          {fields.map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-600">{label}</label>
              <input
                type="number"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={data[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Resultados</h2>
          <ul className="space-y-2 text-gray-800">
            <li><strong>Producción mensual (stickpacks):</strong> {monthlyStickpacks.toFixed(0)}</li>
            <li><strong>Producción mensual (estuches):</strong> {monthlyBoxes.toFixed(0)}</li>
            <li><strong>Ingresos mensuales (€):</strong> {revenue.toFixed(2)}</li>
            <li><strong>Costos operativos mensuales (€):</strong> {operatingCosts.toFixed(2)}</li>
            <li><strong>Beneficio mensual (€):</strong> {netProfit.toFixed(2)}</li>
            <li><strong>ROI anual (%):</strong> {annualROI.toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;