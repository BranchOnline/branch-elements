var React = require('react');
var RowContent = require('./RowContent');

module.exports = React.createClass({
    getInitialState: function() {
        return {
        };
    },
    handleEdit: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.editClicked(this.props.row);
    },
    handleDelete: function(event) {
        this.props.deleteClicked(this.props.row);
    },
    handleClick: function(e) {
        this.props.rowClicked(this.props.row);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    render: function() {
        var subview_display = 'none';
        var subview = null;

        if (typeof this.props.row.subview !== 'undefined' && this.props.row.subview !== null) {
            subview_display = 'block';
        }

        return React.createElement(
            'div',
            {className: 'row-container', 'data-key': this.props.id},
            React.createElement(
                RowContent,
                {
                    id: this.props.row.id,
                    title: this.props.row.title,
                    handleRowContentClick: this.handleClick,
                    editable: this.props.editClicked ? this.handleEdit : null,
                    deletable: this.props.deleteClicked ? this.handleDelete : null
                }
            ),
            React.createElement(
                'div',
                {className: 'sub-container', style: {display: subview_display}},
                this.props.row.subview
            )
        );
    }
});
