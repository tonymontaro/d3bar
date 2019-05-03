class BarGraph {
  constructor() {
    this.len = 26;
    this.min = -10;
    this.max = 90;
    this.height = 300;
    this.margin = { top: 20, right: 0, bottom: 30, left: 40 };
    this.barWidth = 30;
    this.barSpacing = 5;
  }

  getBarHeight(num) {
    return Math.abs(this.y(0) - this.y(num));
  }

  getRandomNumbers(seed, len, min, max) {
    const nums = [];
    for (var i = 0; i < len; i += 1) {
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280;
      nums.push(Math.round(min + rnd * (max - min)));
    }
    nums.sort((x, y) => x - y);
    return nums;
  }

  clearPreviousGraph() {
    d3.select("#root")
      .selectAll("*")
      .remove();
  }

  initialize(seed) {
    this.seed = seed;
    this.data = this.getRandomNumbers(seed, this.len, this.min, this.max);
    this.alphabets = d3.range(this.len).map(i => String.fromCharCode(i + 97));
    this.y = d3
      .scaleLinear()
      .domain([-10, 90])
      .range([this.height, 0]);
    this.x = d3
      .scaleBand()
      .domain(this.alphabets)
      .range([
        0,
        (this.barWidth + this.barSpacing) * this.len - this.barSpacing
      ]);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
  }

  setBarGroup() {
    const svg = d3
      .select("#root")
      .append("svg")
      .attr("height", this.height + 100)
      .attr("width", "100%");
    this.barGroup = svg
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }

  drawBars() {
    this.barGroup
      .selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("height", (d, i) => this.getBarHeight(d))
      .attr("width", this.barWidth)
      .attr("fill", "steelblue")
      .transition()
      .duration(750)
      .attr("x", (d, i) => this.x(this.alphabets[i]))
      .transition()
      .duration(750)
      .attr("y", d =>
        d > 0 ? this.height - this.getBarHeight(d) : this.height
      );
  }

  drawXAxis() {
    this.barGroup
      .append("g")
      .attr("transform", "translate(0, 300)")
      .call(this.xAxis);
  }

  drawYAxis() {
    this.barGroup
      .append("g")
      .attr("class", "y-axis")
      .attr(
        "transform",
        `translate(0, ${Math.abs(this.y(0) - this.y(this.min))})`
      )
      .call(this.yAxis);
  }

  draw(seed) {
    this.clearPreviousGraph();
    this.initialize(seed);
    this.setBarGroup();
    this.drawBars();
    this.drawXAxis();
    this.drawYAxis();
  }
}

let seed = 5;
const bar = new BarGraph();
bar.draw(seed);

const seedButton = document.getElementById("seedButton");
seedButton.addEventListener("click", event => {
  event.preventDefault();
  seed = Number(document.getElementById("seed").value);
  bar.draw(seed);
});
