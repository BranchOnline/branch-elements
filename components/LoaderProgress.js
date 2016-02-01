var React = require('react');

module.exports = React.createClass({
    displayName: 'LoaderProgress',

    getDefaultProps: function() {
        return {
            percent: 0.001,
            size: 120,
            lineWidth: 8,
            showProgressLabel: false,
            bgColor: '#efefef',
            fillColor: '#555'
        };
    },

    getInitialState: function() {
        return {
            percent: (this.props.percent > 0) ? this.props.percent : 0.001,
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
        this.drawDonut(nextProps.percent);
    },

    componentDidMount: function() {
        this.drawDonut(this.state.percent);
    },

    drawDonut: function(percent) {
        var el = this.refs.donut;

        var options = {
            percent:  percent,
            size: this.props.size,
            lineWidth: this.props.lineWidth,
            rotate: 0
        }

        var canvas = this.refs.canvas;
        if (this.props.showProgressLabel) {
            var span = this.refs.label;
            span.textContent = Math.round(options.percent) + '%';
        }

        if (typeof(G_vmlCanvasManager) !== 'undefined') {
            G_vmlCanvasManager.initElement(canvas);
        }

        var ctx = canvas.getContext('2d');
        canvas.width = canvas.height = options.size;

        ctx.translate(options.size / 2, options.size / 2); // change center
        ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

        //imd = ctx.getImageData(0, 0, 240, 240);
        var radius = (options.size - options.lineWidth) / 2;

        var drawCircle = function(color, lineWidth, percent) {
            percent = Math.min(Math.max(0, percent || 1), 1);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
            ctx.strokeStyle = color;
            ctx.lineCap = 'round'; // butt, round or square
            ctx.lineWidth = lineWidth
            ctx.stroke();
        };

        drawCircle(this.props.bgColor, options.lineWidth, 100 / 100);
        drawCircle(this.props.fillColor, options.lineWidth, options.percent / 100);
    },

    render: function() {
        var progress = this.props.showProgressLabel ? (
            React.createElement('span', {ref: 'label'})
        ) : null;

        return React.createElement(
            'span',
            {className: 'chart', id: 'graph'},
            React.createElement('canvas', {ref: 'canvas'}),
            React.createElement('span', {}, 'Uploading your files')
        );
    }
});
