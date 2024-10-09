// Data for the charts
const populationData = [
    { country: "China", population: 1444216107 },
    { country: "India", population: 1393409038 },
    { country: "United States", population: 331002651 },
    { country: "Indonesia", population: 273523615 },
    { country: "Pakistan", population: 225199937 },
    { country: "Brazil", population: 213993437 },
    { country: "Nigeria", population: 211400708 },
];

const co2Data = [
    { year: 2000, co2: 25.2 },
    { year: 2001, co2: 25.7 },
    { year: 2002, co2: 26.2 },
    { year: 2003, co2: 26.8 },
    { year: 2004, co2: 27.5 },
    { year: 2005, co2: 28.1 },
    { year: 2006, co2: 28.7 },
    { year: 2007, co2: 29.1 },
    { year: 2008, co2: 29.5 },
    { year: 2009, co2: 29.3 },
    { year: 2010, co2: 30.1 },
    { year: 2011, co2: 30.6 },
];

const gdpLifeExpectancyData = [
    { gdp: 5000, lifeExpectancy: 60 },
    { gdp: 10000, lifeExpectancy: 70 },
    { gdp: 15000, lifeExpectancy: 75 },
    { gdp: 20000, lifeExpectancy: 78 },
    { gdp: 25000, lifeExpectancy: 80 },
    { gdp: 30000, lifeExpectancy: 82 },
];

const techMarketShareData = [
    { company: "Apple", share: 45 },
    { company: "Microsoft", share: 30 },
    { company: "Google", share: 15 },
    { company: "Others", share: 10 },
];

// Tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Function to create a bar chart
function createBarChart() {
    const svg = d3.select("#bar-chart-container").append("svg");
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.style("width").replace("px", "") - margin.left - margin.right;
    const height = +svg.style("height").replace("px", "") - margin.top - margin.bottom;
    
    const x = d3.scaleBand()
        .domain(populationData.map(d => d.country))
        .range([0, width])
        .padding(0.1);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(populationData, d => d.population)])
        .nice()
        .range([height, 0]);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
        .selectAll("rect")
        .data(populationData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.country))
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .attr("fill", "steelblue")
        .transition() // Transition to animate the bars
        .duration(1000)
        .attr("y", d => y(d.population))
        .attr("height", d => height - y(d.population))
        .delay((d, i) => i * 100);
    
    // Bar mouseover events
    g.selectAll(".bar")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "orange");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Population: ${d.population}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("fill", "steelblue");
            tooltip.transition().duration(500).style("opacity", 0);
        });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));
}

// Function to create a line chart
function createLineChart() {
    const svg = d3.select("#line-chart-container").append("svg");
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.style("width").replace("px", "") - margin.left - margin.right;
    const height = +svg.style("height").replace("px", "") - margin.top - margin.bottom;
    
    const x = d3.scaleLinear()
        .domain(d3.extent(co2Data, d => d.year))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(co2Data, d => d.co2)])
        .nice()
        .range([height, 0]);
    
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.co2));
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    g.append("path")
        .datum(co2Data)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", line)
        .transition()
        .duration(2000);

    // Add dots for each point on the line
    g.selectAll(".dot")
        .data(co2Data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.year))
        .attr("cy", d => y(d.co2))
        .attr("r", 5)
        .attr("fill", "green")
        .style("opacity", 0)
        .transition()
        .duration(2000)
        .style("opacity", 1);

    // Dot mouseover events
    g.selectAll(".dot")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 8).attr("fill", "orange");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Year: ${d.year}<br>CO2 Emissions: ${d.co2} Gt`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5).attr("fill", "green");
            tooltip.transition().duration(500).style("opacity", 0);
        });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));
}

// Function to create a scatter plot
function createScatterPlot() {
    const svg = d3.select("#scatter-plot-container").append("svg");
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = +svg.style("width").replace("px", "") - margin.left - margin.right;
    const height = +svg.style("height").replace("px", "") - margin.top - margin.bottom;
    
    const x = d3.scaleLinear()
        .domain([0, d3.max(gdpLifeExpectancyData, d => d.gdp)])
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(gdpLifeExpectancyData, d => d.lifeExpectancy)])
        .range([height, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    g.selectAll("circle")
        .data(gdpLifeExpectancyData)
        .enter().append("circle")
        .attr("cx", d => x(d.gdp))
        .attr("cy", d => y(d.lifeExpectancy))
        .attr("r", 5)
        .attr("fill", "purple")
        .style("opacity", 0)
        .transition() // Transition for dots to appear
        .duration(2000)
        .style("opacity", 1);

    // Circle mouseover events
    g.selectAll("circle")
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 8).attr("fill", "orange");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`GDP: ${d.gdp}<br>Life Expectancy: ${d.lifeExpectancy}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5).attr("fill", "purple");
            tooltip.transition().duration(500).style("opacity", 0);
        });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));
}

// Function to create a pie chart
function createPieChart() {
    const svg = d3.select("#pie-chart-container").append("svg");
    const width = +svg.style("width").replace("px", "");
    const height = +svg.style("height").replace("px", "");
    const radius = Math.min(width, height) / 2;
    
    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.share);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = g.selectAll(".arc")
        .data(pie(techMarketShareData))
        .enter().append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.company))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("fill", "orange");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${d.data.company}: ${d.data.share}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("fill", color(d.data.company));
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .transition() // Transition for pie slices
        .duration(1000)
        .attrTween("d", function(d) {
            const interpolate = d3.interpolate(d.startAngle, d.endAngle);
            return t => arc({ ...d, endAngle: interpolate(t) });
        });

    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", ".35em")
        .text(d => d.data.company);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height / 2})`)
        .call(d3.axisBottom());
}

// Initialize all charts
createBarChart();
createLineChart();
createScatterPlot();
createPieChart();
