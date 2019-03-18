import React from 'react';
import PropTypes from 'prop-types';


const Checkbox = (props) => {
    function handleToggle() {
        props.setChecked(!props.checked);
    }
    return (
        <div
            className={`Checkbox ${ props.checked ? 'checked' : '' }`}
            onClick={handleToggle}>
            <div className="box"></div>
            <div className="check"></div>
        </div>
    );
}
Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    setChecked: PropTypes.func.isRequired
};

export default Checkbox;