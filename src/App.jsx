import { useState } from "react";
import html2pdf from 'html2pdf.js';

const countrySettings = {
  "Spain": { currency: "€", minSalary: 1134 },
  "United States": { currency: "$", minSalary: 1320 },
  "Mexico": { currency: "MX$", minSalary: 374.89 },
  "United Kingdom": { currency: "£", minSalary: 1750 },
  "Germany": { currency: "€", minSalary: 1621 },
  "France": { currency: "€", minSalary: 1600 },
  "Italy": { currency: "€", minSalary: 1450 },
  "Canada": { currency: "C$", minSalary: 2380 },
  "Brazil": { currency: "R$", minSalary: 270 },
  "Argentina": { currency: "$AR", minSalary: 156000 },
  "Chile": { currency: "$CLP", minSalary: 460000 },
  "Colombia": { currency: "$COP", minSalary: 1300000 },
  "Japan": { currency: "¥", minSalary: 155000 },
  "China": { currency: "¥", minSalary: 2500 },
  "India": { currency: "₹", minSalary: 10500 },
  "Australia": { currency: "$AUD", minSalary: 3400 }
};

function App() {
  const [country, setCountry] = useState("Spain");
  const currency = countrySettings[country].currency;
  const minSalary = countrySettings[country].minSalary;

  const [dataPrimary, setDataPrimary] = useState({
    machineCost: 80000,
    installCost: 5000,
    speed: 30,
    hours: 8,
    days: 22,
    oee: 85,
    unitsPerBox: 10,
    pricePerBox: 1.5,
    materialCost: 0.02,
    laborCost: minSalary,
    energyCost: 500,
    maintenanceCost: 300,
  });

  const [dataSecondary, setDataSecondary] = useState({
    machineCost: 50000,
    installCost: 3000,
    hours: 8,
    days: 22,
    unitsPerBox: 12,
    pricePerBox: 1.8,
    groupings: 5,
    oee: 80,
    laborCost: minSalary,
    energyCost: 450,
    maintenanceCost: 250,
    salePricePerBox: 2.2,
  });

  const handlePrimaryChange = (key, value) => {
    setDataPrimary(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleSecondaryChange = (key, value) => {
    setDataSecondary(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setCountry(selected);
    const salary = countrySettings[selected].minSalary;
    setDataPrimary(prev => ({ ...prev, laborCost: salary }));
    setDataSecondary(prev => ({ ...prev, laborCost: salary }));
  };

  const handleDownload = () => {
    const element = document.getElementById('resultado');
    const opt = {
      margin: 0.5,
      filename: 'resultado-roi.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const primaryFields = [
    { label: "Machine Cost", key: "machineCost" },
    { label: "Installation Cost", key: "installCost" },
    { label: "Stickpack Cost", key: "materialCost" },
    { label: "Speed (stick/min)", key: "speed" },
    { label: "Hours per Day", key: "hours" },
    { label: "Days per Month", key: "days" },
    { label: "OEE (%)", key: "oee" },
    { label: "Units per Box", key: "unitsPerBox" },
    { label: "Box Price", key: "pricePerBox" },
    { label: "Monthly Labor Cost", key: "laborCost" },
    { label: "Monthly Energy Cost", key: "energyCost" },
    { label: "Monthly Maintenance", key: "maintenanceCost" },
  ];

  const secondaryFields = [
    { label: "Machine Cost", key: "machineCost" },
    { label: "Installation Cost", key: "installCost" },
    { label: "Hours per Day", key: "hours" },
    { label: "Days per Month", key: "days" },
    { label: "Units per Box", key: "unitsPerBox" },
    { label: "Box Price", key: "pricePerBox" },
    { label: "Groupings", key: "groupings" },
    { label: "OEE (%)", key: "oee" },
    { label: "Monthly Labor Cost", key: "laborCost" },
    { label: "Monthly Energy Cost", key: "energyCost" },
    { label: "Monthly Maintenance", key: "maintenanceCost" },
    { label: "Sale Price per Box", key: "salePricePerBox" },
  ];

  const monthlyStickpacks = dataPrimary.speed * 60 * dataPrimary.hours * dataPrimary.days * (dataPrimary.oee / 100);
  const monthlyBoxes = monthlyStickpacks / dataPrimary.unitsPerBox;
  const revenue = monthlyBoxes * dataPrimary.pricePerBox;
  const operatingCosts = (monthlyStickpacks * dataPrimary.materialCost) + dataPrimary.laborCost + dataPrimary.energyCost + dataPrimary.maintenanceCost;
  const netProfit = revenue - operatingCosts;
  const totalInvestment = dataPrimary.machineCost + dataPrimary.installCost;
  const annualROI = (netProfit * 12 / totalInvestment) * 100;
  const roiYears = totalInvestment / (netProfit * 12);

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-[#333] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-[#222]">
            ROI Calculator - <span className="text-orange-500">INVpack</span>
          </h1>
          <select
            value={country}
            onChange={handleCountryChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {Object.keys(countrySettings).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-orange-300 pt-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Primary</h2>
          <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
            {primaryFields.map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                    value={dataPrimary[key]}
                    onChange={(e) => handlePrimaryChange(key, e.target.value)}
                  />
                  {label.includes("Cost") || label.includes("Price") ? (
                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{currency}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-orange-300 pt-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Secondary</h2>
          <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
            {secondaryFields.map(({ label, key }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">{label}</label>
                <div className="relative">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
                    value={dataSecondary[key]}
                    onChange={(e) => handleSecondaryChange(key, e.target.value)}
                  />
                  {label.includes("Cost") || label.includes("Price") ? (
                    <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{currency}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="resultado" className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-4">Results</h2>
          <ul className="space-y-2 text-gray-800">
            <li><strong>Monthly production (stickpacks):</strong> {monthlyStickpacks.toFixed(0)}</li>
            <li><strong>Monthly production (boxes):</strong> {monthlyBoxes.toFixed(0)}</li>
            <li><strong>Monthly revenue ({currency}):</strong> {revenue.toFixed(2)}</li>
            <li><strong>Monthly operating costs ({currency}):</strong> {operatingCosts.toFixed(2)}</li>
            <li><strong>Monthly profit ({currency}):</strong> {netProfit.toFixed(2)}</li>
            <li><strong>Annual ROI (%):</strong> {annualROI.toFixed(2)}</li>
            <li><strong>Estimated ROI (years):</strong> {roiYears.toFixed(2)}</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={handleDownload}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;