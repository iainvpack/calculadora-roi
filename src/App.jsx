import { useState } from "react";
import html2pdf from 'html2pdf.js';
import emailjs from '@emailjs/browser';

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

  const [primaryData, setPrimaryData] = useState({
    machineCost: 80000,
    installCost: 10000,
    speed: 500,
    hours: 16,
    days: 22,
    oee: 85,
    materialCost: 0.02,
    laborCost: minSalary,
    energyCost: 500,
    maintenanceCost: 300,
  });

  const [secondaryData, setSecondaryData] = useState({
    machineCost: 50000,
    installCost: 5000,
    hours: 16,
    days: 22,
    unitsPerBox: 12,
    pricePerBox: 1.5,
    oee: 85,
    laborCost: minSalary,
    energyCost: 500,
    maintenanceCost: 300,
  });

  const [salePrice, setSalePrice] = useState(2.5);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', company: '', phone: '', comments: '' });

  const handlePrimaryChange = (key, value) => {
    setPrimaryData(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleSecondaryChange = (key, value) => {
    setSecondaryData(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setCountry(selected);
    setPrimaryData(prev => ({ ...prev, laborCost: countrySettings[selected].minSalary }));
    setSecondaryData(prev => ({ ...prev, laborCost: countrySettings[selected].minSalary }));
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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_r8inm4f', 'template_j8k5jka', formData, '3ZqnJZwzzNr2yA-Le')
      .then(() => alert('Quotation request sent to web@invpack.com.'))
      .catch(() => alert('There was an error sending the quotation.'));

    setShowForm(false);
  };

  const primaryFields = [
    { label: "Primary packaging machine cost", key: "machineCost" },
    { label: "Commissioning & Trainning cost", key: "installCost" },
    { label: "Packaging material cost (linear meter)", key: "materialCost" },
    { label: "Sachet / Stick lenght (mm)", key: "lenght" },
    { label: "Primary machine production (units/min)", key: "speed" },
    { label: "Hours per day", key: "hours" },
    { label: "Days per month", key: "days" },
    { label: "OEE Primary (%)", key: "oee" },
    { label: "Monthly Labour Cost (Operator)", key: "laborCost" },
    { label: "Monthly Energy Cost", key: "energyCost" },
    { label: "Monthly Maintenance Cost", key: "maintenanceCost" },
  ];

  const secondaryFields = [
    { label: "Secondary packaging machine cost", key: "machineCost" },
    { label: "Commissioning & Trainning cost", key: "installCost" },
    { label: "Hours per day", key: "hours" },
    { label: "Days per month", key: "days" },
    { label: "Units per box", key: "unitsPerBox" },
    { label: "Secondary Packaging Material Unit Price", key: "pricePerBox" },
    { label: "OEE Secondary (%)", key: "oee" },
    { label: "Monthly Labor Cost (operator)", key: "laborCost" },
    { label: "Monthly Energy Cost", key: "energyCost" },
    { label: "Monthly Maintenance Cost", key: "maintenanceCost" },
  ];

  const monthlyStickpacks = primaryData.speed * 60 * primaryData.hours * primaryData.days * (primaryData.oee / 100);
  const monthlyBoxes = monthlyStickpacks / secondaryData.unitsPerBox;
  const revenue = monthlyBoxes * secondaryData.pricePerBox;
  const operatingCosts = (monthlyStickpacks * primaryData.materialCost) + primaryData.laborCost + primaryData.energyCost + primaryData.maintenanceCost;
  const netProfit = revenue - operatingCosts;
  const totalInvestment = primaryData.machineCost + primaryData.installCost + secondaryData.machineCost + secondaryData.installCost;
  const annualROI = (netProfit * 12 / totalInvestment) * 100;
  const roiYears = totalInvestment / (netProfit * 12);

  const renderFields = (fields, data, handleChange) => (
    <div className="bg-white shadow-lg rounded-2xl p-6 grid md:grid-cols-2 gap-6">
      {fields.map(({ label, key }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">{label}</label>
          <div className="relative">
            <input
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
              value={data[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
            />
            {(label.includes("Cost") || label.includes("Price")) && (
              <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{currency}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-orange-600">Primary</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
            >
              Ask for quotation
            </button>
          </div>
          {renderFields(primaryFields, primaryData, handlePrimaryChange)}
        </div>

        <div className="border-t border-orange-300 pt-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Secondary</h2>
          {renderFields(secondaryFields, secondaryData, handleSecondaryChange)}
        </div>

        <div className="border-t border-orange-300 pt-6">
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <label className="text-lg font-bold text-orange-600 mb-1">Sale Price per Box</label>
            <div className="relative">
              <input
                type="number"
                className="border border-gray-300 rounded-md px-4 py-3 pr-12 text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 w-full text-orange-700"
                value={salePrice}
                onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm">{currency}</span>
            </div>
            <div className="mt-4 text-gray-800">
              <strong>Estimated ROI (years):</strong> {roiYears.toFixed(2)}
            </div>
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

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
              <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">&times;</button>
              <h3 className="text-xl font-bold mb-4">Request a Quotation</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input type="text" placeholder="Name" required className="w-full border px-3 py-2 rounded" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="text" placeholder="Surname" required className="w-full border px-3 py-2 rounded" onChange={(e) => setFormData({ ...formData, surname: e.target.value })} />
                <input type="email" placeholder="Email" required className="w-full border px-3 py-2 rounded" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="text" placeholder="Company" required className="w-full border px-3 py-2 rounded" onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                <input type="tel" placeholder="Phone" required className="w-full border px-3 py-2 rounded" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                <textarea placeholder="Comments" className="w-full border px-3 py-2 rounded" rows={4} onChange={(e) => setFormData({ ...formData, comments: e.target.value })}></textarea>
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
