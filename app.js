


let carbonChart; 

document.getElementById("carbonForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const milesDriven = parseFloat(document.getElementById("miles").value);
    const electricityUsage = parseFloat(document.getElementById("electricity").value);
    const meatConsumption = parseFloat(document.getElementById("meat").value);
    const flights = parseFloat(document.getElementById("flights").value);
    const busMiles = parseFloat(document.getElementById("bus").value);
    const trainMiles = parseFloat(document.getElementById("train").value);
    const naturalGas = parseFloat(document.getElementById("naturalGas").value);

    if (isNaN(milesDriven) || isNaN(electricityUsage) || isNaN(meatConsumption) ||
        isNaN(flights) || isNaN(busMiles) || isNaN(trainMiles) || isNaN(naturalGas)) {
        alert("Please enter valid numbers for all fields.");
        return;
    }

    const carEmissionFactor = 0.411;
    const electricityEmissionFactor = 0.92;
    const meatEmissionFactor = 7;
    const flightEmissionFactor = 0.254;
    const busEmissionFactor = 0.089;
    const trainEmissionFactor = 0.041;
    const naturalGasEmissionFactor = 5.3;

    const carEmissions = milesDriven * carEmissionFactor;
    const electricityEmissions = electricityUsage * electricityEmissionFactor;
    const meatEmissions = meatConsumption * meatEmissionFactor;
    const flightEmissions = flights * flightEmissionFactor;
    const busEmissions = busMiles * busEmissionFactor;
    const trainEmissions = trainMiles * trainEmissionFactor;
    const naturalGasEmissions = naturalGas * naturalGasEmissionFactor;

    const totalFootprint = carEmissions + electricityEmissions + meatEmissions +
                           flightEmissions + busEmissions + trainEmissions + naturalGasEmissions;

    document.getElementById("FootprintResult").innerText = 
        `Your estimated carbon footprint: ${totalFootprint.toFixed(2)} kg CO2 per week`;
        document.querySelector(".results").style.display = "block";

    const breakdownList = document.getElementById("Breakdown");
    breakdownList.innerHTML = `
        <li>Car: ${carEmissions.toFixed(2)} kg CO2</li>
        <li>Electricity: ${electricityEmissions.toFixed(2)} kg CO2</li>
        <li>Meat Consumption: ${meatEmissions.toFixed(2)} kg CO2</li>
        <li>Flights: ${flightEmissions.toFixed(2)} kg CO2</li>
        <li>Bus: ${busEmissions.toFixed(2)} kg CO2</li>
        <li>Train: ${trainEmissions.toFixed(2)} kg CO2</li>
        <li>Natural Gas: ${naturalGasEmissions.toFixed(2)} kg CO2</li>
    `;

    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];
    history.push({
        date: new Date().toLocaleDateString(),
        footprint: totalFootprint.toFixed(2),
    });
    localStorage.setItem("carbonHistory", JSON.stringify(history));

    displayHistory();
    updateChart();
});

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = history.map(entry => `<li>${entry.date} - ${entry.footprint} kg CO2</li>`).join("");
}

document.getElementById("clearHistory").addEventListener("click", function () {
    localStorage.removeItem("carbonHistory");
    displayHistory();
    updateChart();
});

// Function to update the chart
function updateChart() {
    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];

    const labels = history.map(entry => entry.date);
    const data = history.map(entry => parseFloat(entry.footprint));

    const ctx = document.getElementById("carbonChart").getContext("2d");

    if (carbonChart) {
        carbonChart.destroy(); // Destroy previous chart instance
    }

    carbonChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Carbon Footprint (kg CO2)",
                data: data,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Date"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "kg CO2"
                    }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayHistory();
    updateChart();
});


// Function to download CSV
document.getElementById("downloadCSV").addEventListener("click", function () {
    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];

    if (history.length === 0) {
        alert("No data available to download.");
        return;
    }

    let csvContent = "Date,Carbon Footprint (kg CO2)\n";
    history.forEach(entry => {
        csvContent += `${entry.date},${entry.footprint}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "carbon_footprint.csv";
    link.click();
});

// Function to download PDF
document.getElementById("downloadPDF").addEventListener("click", function () {
    let history = JSON.parse(localStorage.getItem("carbonHistory")) || [];

    if (history.length === 0) {
        alert("No data available to download.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Carbon Footprint Report", 20, 20);

    doc.setFontSize(12);
    history.forEach((entry, index) => {
        doc.text(`${index + 1}. ${entry.date} - ${entry.footprint} kg CO2`, 20, 40 + index * 10);
    });

    // Convert chart to image and add it to PDF
    const canvas = document.getElementById("carbonChart");
    const imgData = canvas.toDataURL("image/png");
    
    doc.addImage(imgData, "PNG", 20, 60, 160, 90);

    doc.save("carbon_footprint_report.pdf");
});


const darkModeToggle = document.getElementById("darkModeToggle");

// Check local storage for dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}

darkModeToggle.addEventListener("change", function () {
    if (this.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
    }
});
