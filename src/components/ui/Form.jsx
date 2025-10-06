import React from 'react';
import '../../styles/form.css';

export const Field = ({ label, children, error }) => (
    <div className="form-field">
        {label && <label className="label">{label}</label>}
        {children}
        {error && <div className="error-text">{error}</div>}
    </div>
);

export const Row = ({ children }) => <div className="form-row">{children}</div>;
