import React from 'react';
import { PointModel } from '../Common';

export class DefaultLinkWidget extends React.Component {
  static defaultProps = {
    color: 'black',
    width: 3,
    link:null,
    engine: null,
    smooth: true,
    diagramEngine: null
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  generatePoint(pointIndex) {
    const { link } = this.props;
    const uiCircleProps = {
      className: `point pointui${(link.points[pointIndex].isSelected() ? ' selected' : '')}`,
      cx: link.points[pointIndex].x,
      cy: link.points[pointIndex].y,
      r: 5,
    };
    const circleProps = {
      className: 'point',
      'data-linkid': link.id,
      'data-id': link.points[pointIndex].id,
      cx: link.points[pointIndex].x,
      cy: link.points[pointIndex].y,
      r: 15,
      opacity: 0,
      onMouseLeave: () => this.setState({ selected: false }),
      onMouseEnter: () => this.setState({ selected: true }),
    };

    return (
      <g key={`point-${link.points[pointIndex].id}`}>
        <circle {...uiCircleProps}/>
        <circle {...circleProps}/>
      </g>
    );
  }

  generateLink(extraProps) {
    const { link, width, color } = this.props;
    const { selected } = this.state;
    const bottom = (
      <path
        className={(selected || link.isSelected()) ? 'selected' : ''}
        strokeWidth={width}
        stroke={color}
        {...extraProps}
      />
    );

    const top = (
      <path
        strokeLinecap={'round'}
        data-linkid={link.getID()}
        stroke={color}
        strokeOpacity={selected ? 0.1 : 0}
        strokeWidth={20}
        onMouseLeave={event => {
          event.preventDefault();
          this.props.link.setSelected(false);
          this.setState({ selected: false });
        }}
        onMouseEnter={event => {
          event.preventDefault();
          this.props.link.setSelected(true);
          this.setState({ selected: true });
        }}
        onContextMenu={event => {
          event.preventDefault();
          this.props.link.remove();
        }}
        {...extraProps}
      />
    );

    return (
      <g key={`link-${extraProps.id}`}>
        {bottom}
        {top}
      </g>
    );
  }

  drawLine() {
    const { link, diagramEngine, pointAdded } = this.props;
    const { points } = link;
    const paths = [];

    // If the points are too close, just draw a straight line
    const margin = (Math.abs(points[0].x - points[1].x) < 50) ? 5 : 50;

    let pointLeft = points[0];
    let pointRight = points[1];

    // Some defensive programming to make sure the smoothing is
    // Always in the right direction
    if (pointLeft.x > pointRight.x) {
      pointLeft = points[1];
      pointRight = points[0];
    }

    paths.push(this.generateLink({
      id: 0,
      d: ` M${pointLeft.x} ${pointLeft.y} C${pointLeft.x + margin} ${pointLeft.y} ${pointRight.x - margin} ${pointRight.y} ${pointRight.x} ${pointRight.y}` // eslint-disable-line
    }));

    if (link.targetPort === null) {
      paths.push(this.generatePoint(1));
    }

    return paths;
  }

  render() {
    const { points } = this.props.link;
    let paths = [];

    // Draw the line
    paths = this.drawLine();

    return (
      <g>
        {paths}
      </g>
    );
  }
}
