var React = require('react');

module.exports = React.createClass({
    displayName: 'FormGroup',

    getInitialState: function() {
        return {
            error: this.props.error,
        };
    },

    getDefaultProps: function() {
        return { classNames: [] }
    },

    propTypes: {
        children: React.PropTypes.element.isRequired,
        label: React.PropTypes.string,
        htmlFor: React.PropTypes.string,
        id: React.PropTypes.string
    },

    getErrorField: function(key) {
        return React.createElement('div', {}, this.state.error);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },

    render: function() {
        var componentLabel = this.props.label ? (
            React.createElement('label', {className: 'control-label', htmlFor: this.props.key}, this.props.label)
        ) : null;

        var classNames = 'form-group';
        this.props.classNames.map(function(className) {
            classNames += ' ' + className;
        });

        var child = React.cloneElement(this.props.children, {id: this.props.htmlFor});
        var errorField = this.getErrorField(this.props.key);

        return React.createElement(
            'div',
            {className: classNames},
            componentLabel,
            child,
            errorField
        );
    }
});
