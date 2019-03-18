import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { api } from 'utils';
import { open } from 'loader';


const ListRow = (props) => {
    function handleOpen() {
        props.openList(props.list._id);
    }

    function handleDelete(e) {
        e.stopPropagation();
        props.deleteList(props.list._id);
    }

    return (
        <div className="ListRow" onClick={handleOpen}>
            <span className="name">{props.list.name || 'New List'} <span className="count">({props.list.items.length})</span></span>
            <span className="delete">
                <div className="target" onClick={handleDelete}></div>
                <div className="cross down"></div>
                <div className="cross up"></div>
            </span>
        </div>
    );
};
ListRow.propTypes = {
    list: PropTypes.object.isRequired,
    openList: PropTypes.func.isRequired,
    deleteList: PropTypes.func.isRequired,
};

const ListAdd = (props) => {
    return (
        <div className="ListAdd" onClick={() => props.createList({})}>
            <div className="label">New List</div>
            <div className="plus">
                <div className="v"></div>
                <div className="h"></div>
            </div>
        </div>
    );
};
ListAdd.propTypes = {
    createList: PropTypes.func.isRequired,
};

class Collection extends Component {
    constructor(props) {
        super(props);
        this.state = { lists: props.data.lists };

        this.createList = this.createList.bind(this);
        this.openList = this.openList.bind(this);
        this.deleteList = this.deleteList.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        api.read('/lists', lists => this.setState({ lists }));
    }

    createList(params) {
        api.create('/lists', params, newList => {
            this.openList(newList._id);
        });
    }

    openList(id) {
        open(`/lists/${id}`, this.props.history);
    }

    deleteList(id) {
        api.delete(`/lists/${id}`, () => {
            this.loadData();
        })
    }

    render() {
        const listRows = this.state.lists
            .filter(list => list.items.length || list.name)
            .map(list => (
                <CSSTransition
                        key={list._id}
                        timeout={{enter: 0, exit: 200}}
                        in={true}
                        classNames="list-item">
                    <ListRow key={list._id} list={list} openList={this.openList} deleteList={this.deleteList} />
                </CSSTransition>
            ));
        return (
            <div className="Collection">
                {listRows.length
                    ?   <div className="ListTable">
                            <TransitionGroup component={null}>{listRows}</TransitionGroup>
                        </div>
                    :   <div className="ListTablePlaceholder">EMPTY</div>
                }
                <ListAdd createList={this.createList} />
            </div>
        );
    }
}
Collection.propTypes = {
    data: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    router: PropTypes.object
};

Collection.load = (match, setData) => {
    api.read('/lists', lists => setData({ lists }));
}
export default Collection;