var React             = require('react'),
    ReactDOMServer    = require('react-dom/server'),
    LoaderProgress    = require('./LoaderProgress'),
    DropzoneComponent = require('react-dropzone-component');

module.exports = React.createClass({
    displayName: 'FileUploader',

    getDefaultProps: function() {
        return {
            displayMessage: 'Drag file here or click to upload',
            uploadUrl: '/file/content/upload',
            fillColor: '#EDB809',
            bgColor: '#555'
        };
    },

    getInitialState: function() {
        return {
            isUploading: false,
            uploadPercentage: 0,
        };
    },

    render: function() {
        var self = this;

        var componentConfig = {
            postUrl: this.props.uploadUrl,
        };

        var eventHandlers = {
            addedfile: function() {
                self.setState({ isUploading: true });
            },
            uploadprogress: function(file, progress, bytesSent) {
                self.setState({ uploadPercentage: progress });
            },
            complete: function() {
                self.setState({ isUploading: false  });
            },
        }

        var djsConfig = {
            previewTemplate: ReactDOMServer.renderToStaticMarkup(React.createElement('div')),
            maxFiles: 1,
            dictDefaultMessage: this.props.displayMessage,
        };

        var progress = this.state.isUploading ? (
            React.createElement(LoaderProgress, {
                percent: this.state.uploadPercentage,
                fillColor: this.props.fillColor,
                bgColor: this.props.bgColor
            })
        ) : null;

        return React.createElement(
            'div',
            {className: 'file-uploader'},
            React.createElement(DropzoneComponent, {
                config: componentConfig,
                eventHandlers: eventHandlers,
                djsConfig: djsConfig
            }),
            progress
        );
    }
});
