import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { api } from 'utils';

import Checkbox from './Checkbox';
import Textbox from './Textbox';


class Item extends Component {
    constructor(props) {
        super(props);
        this.state = { item: props.item || {text: props.text || ''} };

        this.setCompletedValue = this.setCompletedValue.bind(this);
        this.setTextValue = this.setTextValue.bind(this);

        this.textInput = React.createRef();
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        if (this.state.item.isCompleted) {
            this.props.deleteItem(this.props.id);
        }
    }

    loadData() {
        api.read(`/items/${this.props.id}`, item => this.setState({ item }));
    }

    updateItem() {
        api.update(`/items/${this.props.id}`, this.state.item);
    }

    setCompletedValue(value) {
        let item = this.state.item;
        item.isCompleted = value;
        this.setState({ item });
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
            <div className="Item">
                <Checkbox checked={this.state.item.isCompleted || false} setChecked={this.setCompletedValue}/>
                <Textbox
                    value={(this.state.item || {text: ''}).text}
                    setValue={this.setTextValue}
                    ref={this.textInput} />
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