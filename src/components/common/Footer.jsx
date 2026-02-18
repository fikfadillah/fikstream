import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--text-primary)',
            marginTop: 'auto',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-color)'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ marginBottom: '12px' }}>
                    <Link to="/disclaimer" style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'color 0.3s'
                    }}>
                        Disclaimer
                    </Link>
                </p>
                <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                }}>
                    &copy; {new Date().getFullYear()} FikStream. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
