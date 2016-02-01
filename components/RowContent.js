var React = require('react');

module.exports = React.createClass({
    render: function() {
        var editButton = this.props.editable ? (
            React.createElement(
                'span',
                {onClick: this.props.editable},
                'Edit'
            )
        ) : null;

        var deleteButton = this.props.deletable ? (
            React.createElement(
                'span',
                {onClick: this.props.deletable},
                'Delete'
            )
        ) : null;

        return React.createElement(
            'div',
            {
                className: 'row-content',
                onClick: this.props.handleRowContentClick
            },
            React.createElement(
                'div',
                {className: 'row-info'},
                React.createElement('span', {className: 'row-title'}, this.props.title)
            ),
            React.createElement(
                'div',
                {className: 'row-extras'},
                editButton,
                deleteButton
            )
        );
    }
});

