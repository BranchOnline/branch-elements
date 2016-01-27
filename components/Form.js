var React    = require('react'),
    ReactDOM = require('react-dom'),
    NotificationSystem = require('react-notification-system');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            errors: null,
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
        var successFunction = function(response) {
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
        };

        if (typeof this.props.restUrl === 'undefined') {
            $.post(e.target.action, postData, successFunction);
        } else {
            var url  = this.props.restUrl;
            var verb = 'POST';
            if (this.props.recordId) {
                url += '/' + this.props.recordId;
                verb = 'PUT';
            }

            $.ajax({
                type: verb,
                url: url,
                data: postData,
                success: function(response) {
                    self.setState({errors: null});
                    self.props.onError(false);
                    if (typeof self.props.onPost === 'function') {
                        self.props.onPost(response);
                    }

                    self.refs.toasts.addNotification({
                        message: 'Your data is successfully saved!',
                        level: 'success'
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 422) {
                        var errors = {};
                        jqXHR.responseJSON.forEach(function(item, i) {
                            errors[item.field] = [item.message];
                        });

                        self.setState({ errors: errors });
                    }

                    self.refs.toasts.addNotification({
                        message: errorThrown,
                        level: 'error'
                    });
                }
            });
        }
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

    cloneTabs: function() {
        var self = this;
        var tabs = this.props.children.props.tabs;

        for (var k in tabs) {
            tabs[k] = this.cloneFormFields(tabs[k]);
        }

        return React.cloneElement(this.props.children, {tabs: tabs});
    },

    cloneFormFields: function(fields) {
        if (fields.constructor !== Array) {
            return fields;
        }

        var self = this;
        return React.Children.map(fields, function (child) {
            var error;
            if (typeof child === 'undefined' || child === null) {
                return;
            }

            if (self.state.errors !== null) {
                error = self.state.errors[child.props.field];
            }

            return React.cloneElement(child, {
                error: error,
            });
        });
    },

    getClones: function() {
        var children = this.props.children;

        if (typeof children === 'undefined' || children === null) {
            return;
        }

        if (children.constructor !== Array && typeof children.props.tabs !== 'undefined') {
            return this.cloneTabs();
        } else {
            return this.cloneFormFields(this.props.children);
        }
    },

    render: function() {
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
            React.createElement(NotificationSystem, {ref: 'toasts'}),
            this.getClones(),
            React.createElement(
                'div',
                {className: 'button-holder'},
                cancelButton,
                React.createElement('input', {className: 'btn primary', type: 'submit', value: 'Save'})
            )
        );
    }

});
