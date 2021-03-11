let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let values
let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 1200;
let height = 700;
let padding = 60;

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    let timesArray = values.map(item => new Date(item.Time))
    console.log(timesArray)

    yScale = d3.scaleLinear()
               .domain([d3.min(values, item => new Date(item.Seconds*1000)), d3.max(values, item => new Date(item.Seconds * 1000))])
               .range([padding, height - padding])

    xScale = d3.scaleLinear()
               .domain([d3.min(values, item => item.Year)-1, d3.max(values, item => item.Year)+1])
               .range([padding, width - padding])


}

let drawCircles = () => {

    svg.selectAll('circle')
       .data(values)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('data-xvalue', item => item.Year)
       .attr('data-yvalue', item => new Date(item.Seconds * 1000))
       .attr("cx", d => xScale(d.Year))
       .attr("cy", d => yScale(new Date(d.Seconds*1000)))
       .attr("r", d => 5)
       .attr('fill', item => item.URL !== "" ? 'orange' : 'lightgreen')
       .on('mouseover', item => {tooltip.transition()
                                        .style('visibility', 'visible')
                                   if (item.URL !== '') {
                                       tooltip.text(item.Year + ' - ' + item.Name + ' - ' + item.Time + ' - ' + item.Doping)
                                   } else {
                                       tooltip.text(item.Year + ' - ' + item.Name + ' - ' + item.Time + ' - ' + 'No Allegations')
                                   }
                                   tooltip.attr('data-year', item => item.Year)
                                })
       .on('mouseout', item => {tooltip.transition()
                                        .style('visibility', 'hidden')

       })
       .append('title')
       .attr('id', 'tooltip')
       .attr('data-year', item => item.Year)
       .text(item => item.Name + ': ' + item.Nationality + ' '
                    + 'Year: ' + item.Year + ', ' + 'Time: ' + item.Time + ' '
                    + item.Doping)
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
       .call(xAxis)
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
       .call(yAxis)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
}

req.open('GET', url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    drawCanvas()
    generateScales()
    drawCircles()
    generateAxes()
}
req.send()
