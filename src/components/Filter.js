import React from 'react';

const Filter = ({ filters, onFilterChange, isMobile }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            onFilterChange({
                ...filters,
                [name]: checked ? [...filters[name], value] : filters[name].filter(item => item !== value)
            });
        } else {
            onFilterChange({ ...filters, [name]: value });
        }
    };

    return (
        <div className={`${isMobile && 'mobile'} filter`}>
            <fieldset>
                <legend>Departure Time:</legend>
                <label>
                    <input type="checkbox" name="departureTime" value="morning" onChange={handleChange} />
                    Morning
                </label>
                <label>
                    <input type="checkbox" name="departureTime" value="afternoon" onChange={handleChange} />
                    Afternoon
                </label>
                <label>
                    <input type="checkbox" name="departureTime" value="evening" onChange={handleChange} />
                    Evening
                </label>
            </fieldset>
            <fieldset>
                <legend>Arrival Time:</legend>
                <label>
                    <input type="checkbox" name="arrivalTime" value="morning" onChange={handleChange} />
                    Morning
                </label>
                <label>
                    <input type="checkbox" name="arrivalTime" value="afternoon" onChange={handleChange} />
                    Afternoon
                </label>
                <label>
                    <input type="checkbox" name="arrivalTime" value="evening" onChange={handleChange} />
                    Evening
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Airlines:
                    <input type="text" name="airlines" value={filters.airlines} onChange={handleChange} />
                </label>
            </fieldset>
            <fieldset>
                <label>
                    Price Range:
                    <input type="range" name="priceRange" min="0" max="10000" step="100" value={filters.priceRange} onChange={handleChange} />
                    <span>₹{filters.priceRange}</span>
                </label>
            </fieldset>
        </div>
    );
};

export default Filter;