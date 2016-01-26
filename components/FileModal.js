var React             = require('react'),
    Modal             = require('react-modal'),
    DropzoneComponent = require('react-dropzone-component');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            searchQuery: null,
            files: null,
            newestFiles: null,
            modalIsOpen: this.props.modalIsOpen,
            categories: []
        }
    },
    closeModal: function() {
        this.setState({modalIsOpen: false});
        this.props.onModalClose();
    },
    componentDidMount: function() {
        var self = this;
        $.get('/file/file/get-modal-data', function(result) {
            self.setState({
                newestFiles: result.newest_files,
                categories: result.categories
            });
        });
    },
    fileChosen: function(file_id) {
        this.props.fileChosen(file_id);
    },
    search: function(e) {
        var self = this;
        var searchQuery = e.target.value;

        self.setState({
            searchQuery: searchQuery
        });

        if (searchQuery.length > 1) {
            $.get('/file/file/search', {q: e.target.value}, function(result) {
                self.setState({
                    files: result
                });
            });
        } else {
            self.setState({
                files: null
            });
        }

    },
    render: function() {
        var self      = this;
        var filesHtml = null;

        if (this.state.files !== null || this.state.newestFiles !== null) {
            var files     = this.state.files || this.state.newestFiles;
            filesHtml = files.map(function(item) {
                return React.createElement(
                    'div',
                    {key: item.id, onClick: self.fileChosen.bind(self, item.id), className: 'image-container'},
                    React.createElement(
                        'img',
                        {src: '/file/content/render/' + item.id}
                    ),
                    React.createElement(
                        'span',
                        {},
                        item.display_name
                    )
                )
            });
        }

        var componentConfig = {
            iconFiletypes: ['.jpg', '.png', '.gif'],
            showFiletypeIcon: true,
            postUrl: '/file/default/upload'
        };

        var eventHandlers = {
            init: null,
            drop: null,
            dragstart: null,
            dragend: null,
            dragenter: null,
            dragover: null,
            dragleave: null,
            addedfile: null,
            removedfile: null,
            thumbnail: null,
            error: null,
            processing: null,
            uploadprogress: null,
            sending: null,
            success: function(e, a) {
                self.fileChosen(a);
            },
            complete: null,
            canceled: null,
            maxfilesreached: null,
            maxfilesexceeded: null,
            processingmultiple: null,
            sendingmultiple: null,
            successmultiple: null,
            completemultiple: null,
            canceledmultiple: null,
            totaluploadprogress: null,
            reset: null,
            queuecompleted: null
        }

        return React.createElement(
            Modal,
            {className: 'modal--file-upload', isOpen: this.state.modalIsOpen, onRequestClose: this.closeModal},
            React.createElement(
                'div',
                {className: 'modal-header'},
                React.createElement(
                    'h1',
                    {},
                    'Images'
                ),
                React.createElement(
                    'div',
                    {className: 'modal-header__search'},
                    React.createElement(
                        'input',
                        {type: 'text', placeholder: 'Search files..', value: this.state.searchQuery, onChange: this.search}
                    )
                ),
                React.createElement(
                    'a',
                    {className: 'modal-header__close', onClick: this.closeModal},
                    'close',
                    React.createElement(
                        'span',
                        {className: 'icon'}
                    )
                )
            ),
            React.createElement(
                'div',
                {className: 'modal-content modal-content--file-upload'},
                React.createElement(
                    DropzoneComponent,
                    {className: 'image-container image-container--btn', config: componentConfig, eventHandlers: eventHandlers}
                ),
                filesHtml
            )
        );
    }
});
