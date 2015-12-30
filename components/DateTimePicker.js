var React    = require('react'),
    Datetime = require('react-datetime'),
    moment   = require('moment');

module.exports = React.createClass({
    displayName: 'DateTimePicker',
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    onChange: function(moment) {
        if (typeof this.props.valueLink !== 'undefined' && this.props.valueLink !== null) {
            this.props.valueLink.requestChange(moment.unix());
        }
    },
    render: function() {
        var dateValue = 0;
        if (typeof this.props.valueLink.value === 'undefined' || this.props.valueLink.value === null) {
            dateValue = moment(Date.now());
        } else {
            dateValue = moment(this.props.valueLink.value * 1000);
        }

        return React.createElement(
            'div',
            {className: 'date-picker'},
            React.createElement(
                Datetime,
                {value: dateValue, onChange: this.onChange}
            )
        );
    }
})
