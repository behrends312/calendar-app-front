import React from 'react';

function Card({ title, children }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div>{children}</div>
        </div>
    );
}

export default Card;