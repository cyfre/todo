import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { api } from 'utils';

import Checkbox from './Checkbox';
import Textbox from './Textbox';


class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item || {text: props.text || ''},
            everIncomplete: (props.item ? !props.item.isCompleted : true)
        };

        this.setCompletedValue = this.setCompletedValue.bind(this);
        this.setTextValue = this.setTextValue.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        api.read(`/items/${this.props.id}`, item => this.setState({ item }));
    }

    updateItem() {
        api.update(`/items/${this.props.id}`, this.state.item);
    }

    handleDelete(e) {
        e.stopPropagation();
        this.props.deleteItem(this.props.id);
    }

    setCompletedValue(value) {
        let item = this.state.item;
        item.isCompleted = value;
        this.setState({ item, everIncomplete: !item.isCompleted || this.state.everIncomplete });
        this.updateItem();
    }

    setTextValue(newValue) {
        if (newValue.trim() === '') {
            this.props.deleteItem(this.props.id);
        } else {
            let item = this.state.item;
            if (item.text !== newValue) {
                item.text = newValue;
                this.setState({ item });
                this.updateItem();
            }
        }
    }

    focus() {
        this.textInput.current.focus();
    }

    render() {
        return (
            <div className={this.state.everIncomplete ? 'Item incomplete' : 'Item completed'}>
                <Checkbox checked={this.state.item.isCompleted || false} setChecked={this.setCompletedValue}/>
                <Textbox
                    value={(this.state.item || {text: ''}).text}
                    setValue={this.setTextValue}
                    ref={this.textInput} />
                <span className="delete">
                    <div className="target" onClick={this.handleDelete}></div>
                    <div className="cross down"></div>
                    <div className="cross up"></div>
                </span>
            </div>
        );
    }
}
Item.propTypes = {
    store: PropTypes.object.isRequired,
    id: PropTypes.any.isRequired
};

Item.load = (id, setData) => {
    api.read(`/items/${id}`, item => setData({ item }));
}
export default Item;