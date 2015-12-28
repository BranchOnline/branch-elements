var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            tabs: this.props.tabs,
            activeTab: 0
        };
    },
    tabSelected: function(e) {
        this.setState({ activeTab: Number(e.target.dataset.id) });
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    render: function() {
        var self = this;

        var tabNames = [];
        var tabs     = [];

        Object.keys(this.state.tabs).forEach(function(key, i) {
            var className = (i === self.state.activeTab) ? 'active' : '';
            tabNames.push(
                React.createElement(
                    'li',
                    {key: i + 'li', 'data-id': i, className: className, onClick: self.tabSelected},
                    key
                )
            );
            tabs.push(
                React.createElement(
                    'div',
                    {key: i + 'tab', className: 'tab-container__content ' + className},
                    self.state.tabs[key]
                )
            );
        });

        return React.createElement(
            'div',
            {className: 'tab-container'},
            React.createElement(
                'ul',
                {className: 'tab-container__tabs'},
                tabNames
            ),
            tabs
        );
    }
});
