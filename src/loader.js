import React, { Component, Fragment } from "react";
import { matchPath, withRouter } from 'react-router';
import Collection from "lists/Collection";
import List from "lists/List";


const store = {};
const paths = [
    { path: '/', exact: true, load: Collection.load },
    { path: '/lists/:id', load: List.load }
];

let loadedUrl = undefined;
let loadedData = undefined;

document.store = store;

const open = (url, history) => {
    let props = paths.find(props => matchPath(url, props));
    if (props) {
        let match = matchPath(url, props);
        props.load(match, data => {
            // store[props.path] = data;
            loadedUrl = url;
            loadedData = data;
            document.loadedData = loadedData;
            history.push(url);
        });
    } else {
        history.push(url);
    }
}

class Loader extends Component {
    constructor(props) {
        super(props);
        // this.state = { isLoaded: Boolean(store[props.path]) }
        this.state = { isLoaded: props.match.url === loadedUrl  }

        if (!this.state.isLoaded) {
            props.component.load(this.props.match, data => {
                // store[props.path] = data;
                loadedUrl = props.match.url;
                loadedData = data;
                this.setState({ isLoaded: true });
            });
        }
    }

    render() {
        // store[this.props.path]
        let LoadedComponent = this.props.component;
        return (
            <Fragment>
                { this.state.isLoaded
                    ? <LoadedComponent {...this.props.props} data={loadedData} />
                    : <div>Loading</div>
                }
            </Fragment>
        )
    }
}
Loader = withRouter(Loader);

const withLoader = (Component) => {
    return (props) => (
        <Loader component={withRouter(Component)} props={props} />
    )
}

export {
    open,
    withLoader
};
