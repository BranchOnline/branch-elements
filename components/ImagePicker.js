var React              = require('react'),
    FileModal          = require('./FileModal');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            modalIsOpen: false
        }
    },

    deleteImage: function () {
        this.props.valueLink.requestChange(null);
    },

    fileChosen: function(file_id) {
        this.props.valueLink.requestChange(file_id);
        this.setState({ modalIsOpen: false });

        if (typeof this.props.changeListener === 'function') {
            this.props.changeListener(this.props.id, file_id);
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    openModal: function() {
        this.setState({modalIsOpen: true});
    },
    closeModal: function() {
        this.setState({modalIsOpen: false});
    },
    render: function() {
        var self = this;

        var imagePreview = this.props.valueLink.value ? (
            React.createElement(
                'img',
                {src: '/file/content/render/' + this.props.valueLink.value}
            )
        ) : null;

        var editButton = this.props.valueLink.value ? (
            React.createElement(
                'a',
                {className: 'content-editor__change-element', onClick: this.openModal}
            )
        ) : (
            React.createElement(
                'a',
                {className: 'column__choose-content', onClick: this.openModal},
                'Choose image'
            )
        );

        var deleteButton = this.props.valueLink.value ? (
            React.createElement(
                'a',
                {className: 'content-editor__delete-element', onClick: this.deleteImage}
            )
        ) : null;


        var modal = this.state.modalIsOpen ? (
            React.createElement(
                FileModal,
                {modalIsOpen: self.state.modalIsOpen, onModalClose: self.closeModal, fileChosen: self.fileChosen}
            )
        ) : null;

        return React.createElement(
            'div',
            {className: 'column__file-holder'},
            editButton,
            deleteButton,
            imagePreview,
            React.createElement(
                'input',
                {type: 'hidden', value: this.props.valueLink.value, name: this.props.name}
            ),
            modal
        );
    }
});
