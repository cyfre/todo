import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { api } from 'utils';
import { open } from 'loader';

import Textbox from './Textbox';
import Item from './Item';


class ItemAdd extends Item {
    loadData() {}

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value });
        }
    }

    updateItem() {}

    setCompletedValue() {}

    setTextValue(newValue) {
        if (newValue) {
            this.props.createItem({ text: newValue })
            this.focus(); // iOS will only keep keyboard open if already focused on input
        }
    }

    reset() {
        this.textInput.current.reset();
        this.setState({ item: { text: '' }});
    }
}
Item.propTypes = {};

class List extends Component {
    constructor(props) {
        super(props);
        this.state = { list: props.data.list, focusNew: false, newItemText: '', showCompleted: false };

        this.id = props.match.params.id;
        this.createItem = this.createItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setNameValue = this.setNameValue.bind(this);

        this.newItem = React.createRef();
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillUnmount() {
        if (this.state.list.items.length === 0 && !this.state.list.name) {
            this.deleteList(this.id);
        }
    }

    componentDidUpdate() {
        if (this.state.focusNew) {
            this.newItem.current.focus();
        }
    }

    loadData() {
        api.read(`/lists/${this.id}`, list => this.setState({ list }));
    }

    updateList() {
        api.update(`/lists/${this.id}`, this.state.list);
    }

    deleteList() {
        api.delete(`/lists/${this.id}`);
    }

    createItem(params) {
        params.list = this.id;
        api.create('/items', params, item => {
            this.newItem.current.reset();
            this.state.list.items.push(item._id);
            this.setState({ list: this.state.list, focusNew: true, newItemText: item.text });
            this.updateList();
        });
    }

    deleteItem(id) {
        let list = this.state.list;
        list.items = this.state.list.items.filter(item => item !== id);
        list.completed = this.state.list.completed.filter(item => item !== id);
        this.setState({ list: list, focusNew: false });
        api.delete(`/items/${id}`);
    }

    setNameValue(newValue) {
        let list = this.state.list;
        if (list.name !== newValue) {
            list.name = newValue;
            this.setState({ list, focusNew: list.items.length === 0 });
            this.updateList();
        }
    }

    render() {
        const itemRows = this.state.list.items.map((id, i) => 
            <Item
                key={id} id={id} item={this.props.data.items[i]}
                deleteItem={this.deleteItem}
                text={i === this.state.list.items.length-1 ? this.state.newItemText : ''}
                showCompleted={this.state.showCompleted}
            />
        )
        return (
            <div className={this.state.showCompleted ? "List" : "List hide-completed"}>
                <div className="header">
                    <div className="back" onClick={() => { open('/', this.props.history) }}></div>
                    <Textbox value={this.state.list.name || "New List"} setValue={this.setNameValue}/>
                </div>
                <div className="body">
                    <div className="ItemTable">
                        {itemRows}
                        <ItemAdd createItem={this.createItem} ref={this.newItem}/>
                    </div>
                    {this.state.list.completed.length
                        ?
                        <div className="toggle-completed">
                            <span className="text" onClick={() => { this.setState({showCompleted: !this.state.showCompleted, focusNew: false}) }}>
                                {this.state.showCompleted ? 'Hide' : 'Show'} Completed
                            </span>
                        </div>
                        :
                        ''
                    }
                </div>
            </div>
        );
    }
}
List.propTypes = {
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.object
};

List.load = (match, setData) => {
    api.read(`/lists/${match.params.id}`, list => {
        let loadData = { list, items: [] }
        let itemIds = loadData.list.items;
        if (itemIds.length > 0) {
            let numLoading = itemIds.length;
            itemIds.forEach((id, i) => {
                Item.load(id, ({ item }) => {
                    loadData.items[i] = item;
                    numLoading--;
                    if (numLoading === 0) {
                        setData(loadData);
                    }
                })
            })
        } else {
            setData(loadData);
        }
    })
}
export default List;