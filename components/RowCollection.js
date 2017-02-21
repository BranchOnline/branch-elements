var React        = require('react'),
    ReactDOM     = require('react-dom'),
    InstanceRow  = require('./InstanceRow'),
    $            = require('jquery'),
    sweetAlert   = require('sweetalert'),
    SortableList = require('./SortableList');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            rows: this.props.rows,
            selectedRow: null
        };
    },
    getNestedData: function(row) {
        var self = this;
        var index = self.state.rows.indexOf(row);
        var rows = self.state.rows;
        var row = rows[index];

        $.ajax({
            type: 'GET',
            url: self.props.subsetUrl,
            data: {id: row.id},
            success: function(resp) {
                row.subset = resp;
                row.subview = self.props.renderSubview(row.subset, self.props.nestLevel, row.id, row.language_id || self.props.language_id);
                self.setState({rows: rows});
            }
        });
    },
    clearSubview: function(row) {
        var index = this.state.rows.indexOf(row);
        if (index != -1) {
            var rows  = this.state.rows;
            var row   = rows[index];
            row.subview = null;
            this.setState({ rows: rows });
        }
    },
    onClick: function(row) {
        if (this.state.selectedRow === row) {
            this.clearSubview(row);
            this.setState({ selectedRow: null });
            return;
        }

        this.setState({ selectedRow: row });

        if (typeof this.props.click !== 'undefined' && this.props.click !== null) {
            this.renderForm(this.props.click.form, row.id, null, row, true, row.language_id || this.props.language_id);
        } else if (typeof this.props.subsetUrl !== 'undefined' && this.props.subsetUrl !== null) {
            this.getNestedData(row);
        } else if (typeof this.props.rowClicked === 'function') {
            this.props.rowClicked(row);
        }
    },
    onDataSaved: function(data, row, s) {
        var rows  = this.state.rows;
        var index = rows.indexOf(row);

        if (index !== -1) {
            rows[index].title = data.title;
            rows[index].language_id = data.language_id;
        } else if (typeof row === 'undefined' || row === null) {
            var row = {
                id: data.id,
                title: data.title,
                language_id: data.language_id,
            }
            rows.push(row);
            if (typeof this.props.edit !== 'undefined') {
                this.renderForm(this.props.edit.form, row.id, null, row, false, data.language_id);
            } else {
                s.setState({ row: row });
            }
        }
        this.setState({ rows: rows });
    },
    renderForm: function(form, id, parentId, row, unmount, language_id) {
        var unmount = unmount === false ? false : true;
        var right_column = document.getElementById('right-column');
        if (unmount) {
            ReactDOM.unmountComponentAtNode(right_column);
        }
        ReactDOM.render(
            React.createElement(form, {id: id, parentId: this.props.parentId, row: row, onDataSaved: this.onDataSaved, language_id: language_id}),
            right_column
        );
    },
    onEdit: function(row) {
        this.renderForm(this.props.edit.form, row.id, null, row, true, row.language_id || this.props.language_id);
    },
    onDelete: function(row) {
        var self = this;
        var index = self.state.rows.indexOf(row);
        var recordId = row.id;

        var onDeleteConfirmed = function() {
            if (index === -1) {
                return;
            }

            var rows = self.state.rows;
            var row  = rows[index];
            var newRows = rows.slice(0);
            newRows.splice(index, 1);
            self.setState({ rows: newRows });

            if (typeof self.props.del.restUrl === 'undefined') {
                $.ajax({
                    type: 'GET',
                    data: {id: recordId},
                    url: self.props.del.url,
                    success: function(result) {
                        if (result.status !== 'success') {
                            self.setState({ rows: rows });
                        }
                    },
                    error: function() {
                        self.setState({ rows: rows });
                    }
                });
            } else {
                $.ajax({
                    type: 'DELETE',
                    url: self.props.del.restUrl + '/' + recordId,
                    success: function(result, textStatus, jqXHR) {
                        if (jqXHR.status != 204) {
                            self.setState({ rows: rows });
                        }
                    },
                    error: function() {
                        self.setState({ rows: rows });
                    }
                });
            }
        }

        sweetAlert({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            showCancelButton: true
        }, onDeleteConfirmed);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(nextProps);
    },
    onCreate: function(item, e) {
        if (typeof item.onCreate === 'function') {
            item.onCreate(this.props.parentId, e);
        } else {
            this.renderForm(item.form, null, null, null, true, this.props.language_id);
        }
    },
    sortUpdated: function(newItems) {
        this.setState({rows: newItems});
    },
    render: function() {
        var self = this;
        var editClicked = null;
        if (typeof this.props.edit !== 'undefined' && this.props.edit !== null) {
            editClicked = this.onEdit;
        }
        var deleteClicked = null;
        if (typeof this.props.del !== 'undefined' && this.props.del !== null) {
            deleteClicked = this.onDelete;
        }

        var rowCollection = this.state.rows.map(function(row) {
            return React.createElement(
                InstanceRow,
                {key: row.id, row: row, editClicked: editClicked, deleteClicked: deleteClicked, rowClicked: self.onClick}
            );
        });

        if (this.props.sortable) {
            rowCollection = React.createElement(
                SortableList,
                {sortUpdated: this.sortUpdated, saveUrl: this.props.sortable},
                rowCollection
            );
        }

        var addButtons = this.props.addButtons.map(function(item, index) {
            return React.createElement(
                'span',
                {key: index, className: 'add-x', onClick: self.onCreate.bind(self, item)},
                item.title
            );
        });

        return React.createElement(
            'div',
            {className: 'row-collection'},
            rowCollection,
            React.createElement(
                'div',
                {className: 'row-footer'},
                addButtons
            )
        );
    }
});
