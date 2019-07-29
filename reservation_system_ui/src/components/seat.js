import React, { Component } from 'react';
import * as d3 from 'd3';

class Seat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultColor: '#61dafb',
      filledColor: 'green',
      beingSelectedColor: 'purple'
    };
  }

  componentDidMount = async () => {
    this.drawCircle();
  };

  componentDidUpdate = (prevProps, prevState) => {
    this.updateDrawing();
  };

  updateDrawing = () => {
    const { id, seats } = this.props;
    const { filledColor, defaultColor } = this.state;
    const seat = seats.find(s => s.seat_id === id);
    const selector = '#circle-' + id;
    const svg = d3.select(selector);
    if (seat.booked) {
      svg.style('fill', filledColor);
    } else {
      svg.style('fill', defaultColor);
    }
  };

  handleMouseOver = (d, i, nodes) => {
    const { id, selected } = this.props;
    const { beingSelectedColor } = this.state;
    if (selected) {
      return;
    }
    d3.select(nodes[i]).style('fill', beingSelectedColor);
    this.props.handleSeatBeingSelected(id);
  };

  handleMouseOut = (d, i, nodes) => {
    const { id, selected } = this.props;
    const { defaultColor } = this.state;
    if (selected) {
      return;
    }
    d3.select(nodes[i]).style('fill', defaultColor);
    this.props.handleSeatNotSelected(id);
  };

  handleMouseOutFromSelectedSeat = (d, i, nodes) => {
    d3.select(nodes[i]).on('mouseover', this.handleMouseOver);
    d3.select(nodes[i]).on('mouseout', this.handleMouseOut);
  };

  handleSeatClick = (d, i, nodes) => {
    const { selected, id } = this.props;
    const { defaultColor, filledColor } = this.state;
    if (selected) {
      this.props.handleSeatDeSelected(this.props.id);
      d3.select(nodes[i]).style('fill', defaultColor);
      d3.select(nodes[i]).on('mouseout', this.handleMouseOutFromSelectedSeat);
    } else {
      this.props.handleSeatSelected(id);
      d3.select(nodes[i]).style('fill', filledColor);
      d3.select(nodes[i]).on('mouseover', null);
      d3.select(nodes[i]).on('mouseout', this.handleMouseOutFromSelectedSeat);
    }
  };

  drawCircle = () => {
    const { id } = this.props;
    let { defaultColor } = this.state;
    const selector = '#' + id;
    const svg = d3
      .select(selector)
      .append('svg')
      .attr('width', 40)
      .attr('height', 40);

    svg
      .append('circle')
      .attr('cx', 20)
      .attr('cy', 20)
      .attr('r', 20)
      .attr('id', 'circle-' + id)
      .style('fill', defaultColor)
      .on('mouseover', this.handleMouseOver)
      .on('mouseout', this.handleMouseOut)
      .on('click', this.handleSeatClick);
  };

  render = () => {
    const { id } = this.props;
    return <div id={id} className="seat-circle" />;
  };
}

export default Seat;
