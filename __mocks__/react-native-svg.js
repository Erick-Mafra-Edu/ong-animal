const React = require('react');

const Svg = ({ children, ...props }) => React.createElement('svg', props, children);
const Path = (props) => React.createElement('path', props);
const Circle = (props) => React.createElement('circle', props);
const Rect = (props) => React.createElement('rect', props);
const G = ({ children, ...props }) => React.createElement('g', props, children);
const Line = (props) => React.createElement('line', props);
const Polygon = (props) => React.createElement('polygon', props);
const Polyline = (props) => React.createElement('polyline', props);

module.exports = {
  default: Svg,
  Svg,
  Path,
  Circle,
  Rect,
  G,
  Line,
  Polygon,
  Polyline,
};
