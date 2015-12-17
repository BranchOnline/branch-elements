var React    = require('react'),
    ReactDOM = require('react-dom');

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
                self.setState({errors: {}});
                if (typeof self.props.onPost === 'function') {
                    self.props.onPost(postData);
                }
            } else {
                self.setState({errors: response.errors});
            }
        });
        return false;
    },
    closeForm: function() {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode);
    },
    render: function() {
        var self     = this;
        var children = self.props.children;

        children.forEach(function(item, index) {
            if (self.state.errors !== null) {
                children[index] = React.cloneElement(item, {errorHandler: self.getError.bind(self, item.key)});
            }
        });

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
            [
                children,
                cancelButton,
                React.createElement('input', {type: 'submit', className: 'btn primary', key: 'submit'})
            ]
        );
    }
});

