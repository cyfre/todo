import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Textbox extends Component {
    constructor(props) {
        super(props);
        this.state = { value: props.value };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

        this.input = React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value });
        }
    }

    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                e.target.blur();
                break;
            case 'Escape':
                this.reset();
                e.target.blur();
                break;
            default:
                break;
        }
    }

    handleBlur(e) {
        if (e.target.value !== this.props.value) {
            this.props.setValue(e.target.value);
        }
    }

    focus() {
        this.input.current.focus();
    }

    reset() {
        this.input.current.value = this.props.value;
        this.setState({value: this.props.value});
    }

    render() {
        return (
            <input
                type="text" className="Textbox" value={this.state.value} spellCheck={false}
                ref={this.input}
                onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} onChange={(e) => {
                    this.setState({value: e.target.value});
                }}/>
        );
    }
}
Textbox.propTypes = {
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired
};

export default Textbox;