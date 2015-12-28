var React    = require('react'),
    ReactDOM = require('react-dom'),
    NotificationSystem = require('react-notification-system');

module.exports = React.createClass({ getInitialState: function() {
        return {
            errors: null
        };
    },
    propTypes: {
        cancelButton: React.PropTypes.bool,
        onPost: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            cancelButton: true
        };
    },
    getError: function(item) {
        if (this.state.errors === null || typeof this.state.errors === 'undefined') {
            return null;
        }

        if (!item in this.state.errors) {
            return null;
        }

        return this.state.errors[item];
    },
    onSubmit: function(e) {
        e.preventDefault();
        var self = this;

        var postData = this.props.getPostData();

        $.post(e.target.action, postData, function(response) {
            if (response.status === 'success') {
                self.setState({errors: null});
                self.props.onError(false);
                if (typeof self.props.onPost === 'function') {
                    self.props.onPost(response);
                }

                self.refs.toasts.addNotification({
                    message: 'Your data is successfully saved!',
                    level: 'success'
                });
            } else {
                self.setState({errors: response.errors});
                self.props.onError(true);

                self.refs.toasts.addNotification({
                    message: 'An error occured!',
                    level: 'error'
                });
            }
        });
        return false;
    },
    closeForm: function() {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    onError: function(containsErrors) {
        this.setState({ containsErrors: containsErrors });
    },
    render: function() {
        var self     = this;
        var children = self.props.children;

        if ((children.length === 1 || children.constructor !== Array)
        && typeof children.props.tabs !== 'undefined' && children.props.tabs !== null
           ) {
            Object.keys(children.props.tabs).forEach(function(tab, index) {
                var tabChildren = children.props.tabs[tab].props.children;

                if (tabChildren.constructor === Array) {
                    tabChildren.forEach(function(item, itemIndex) {
                        if (self.state.errors !== null) {
                            var error = self.getError(item.key);
                            children.props.tabs[tab].props.children[itemIndex] = React.cloneElement(item, {error: error});
                        }
                    });
                }
            });
        } else {
            children.forEach(function(item, index) {
                if (self.state.errors !== null) {
                    var error = self.getError(item.key);
                    if (typeof error !== 'undefined') {
                        children[index] = React.cloneElement(item, {error: error});
                    }
                }
            });
        }

        var cancelButton = null
        if (this.props.cancelButton) {
            cancelButton = React.createElement(
                'a',
                {className: 'btn secondary', onClick: this.closeForm, key: 'cancel'},
                'Cancel'
            );
        }

        return React.createElement(
            'form',
            {action: this.props.action, onSubmit: this.onSubmit},
            React.createElement('NotificationSystem', {ref: 'toasts'}),
            children,
            React.createElement(
                'div',
                {className: 'button-holder'},
                cancelButton,
                React.createElement('input', {className: 'btn primary', key: 'submit'})
            )
        );
    }
});
