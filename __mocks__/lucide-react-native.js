const React = require('react');

const MockIcon = ({ testID, size, color, strokeWidth, ...props }) =>
  React.createElement('span', { 'data-testid': testID, role: 'img', ...props });

const handler = {
  get: function(target, name) {
    if (name === '__esModule') return true;
    if (name === 'default') return MockIcon;
    return MockIcon;
  }
};

module.exports = new Proxy({}, handler);
