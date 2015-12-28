var React    = require('react'),
    ReactDOM = require('react-dom'),
    _        = require('lodash'),
    $        = require('jquery');

require('jquery-ui/sortable');

module.exports = React.createClass({
    propTypes: {
        saveUrl: React.PropTypes.string,
        sortUpdated: React.PropTypes.func
    },
    componentDidMount: function() {
        $(ReactDOM.findDOMNode(this)).sortable({
            items: 'li',
            update: this.handleSortableUpdate,
        });
    },
    handleSortableUpdate: function() {
        var $node = $(ReactDOM.findDOMNode(this));
        var ids = [];
        $.each($node.find('> li'), function(index, value) {
            ids.push(value.dataset.id);
        });
        var children = this.props.children;
        var newItems = [];
        var keys     = [];

        ids.forEach(function(id, index) {
            var item = _.findWhere(children, {key: id}).props.row;
            item.sequence = index;
            newItems.push(item);
            keys.push(item.id);
        });

        $node.sortable('cancel');
        this.props.sortUpdated(newItems);

        $.post(this.props.saveUrl, { keys: keys, _csrf: yii.getCsrfToken() });
    },
    render: function() {
        var children = this.props.children.map(function(item, index) {
            return React.createElement(
                'li',
                {key: index, 'data-id': item.key},
                item
            );
        });

        return React.createElement(
            'ul',
            {},
            children
        );
    }
});
