import * as d3 from 'd3';

const handleMouseOver = (d, i, nodes) => {
  d3.select(nodes[i]).style('fill', 'blue');
};

const handleMouseOut = (d, i, nodes) => {
  d3.select(nodes[i]).style('fill', 'purple');
};

const handleSeatSelect = (d, i, nodes) => {
  d3.select(nodes[i]).style('fill', 'green');
  d3.select(nodes[i]).on('mouseover', null);
  d3.select(nodes[i]).on('mouseout', null);
};

export const drawCircle = () => {
  const svg = d3
    .selectAll('.seat')
    .append('svg')
    .attr('width', 40)
    .attr('height', 40);

  svg
    .append('circle')
    .attr('cx', 20)
    .attr('cy', 20)
    .attr('r', 20)
    .style('fill', 'purple')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleSeatSelect);
};
