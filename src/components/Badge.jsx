import './Badge.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'medium',
    icon,
    dot = false
}) => {
    return (
        <span className={`badge badge-${variant} badge-${size}`}>
            {dot && <span className="badge-dot"></span>}
            {icon && <span className="badge-icon">{icon}</span>}
            <span className="badge-text">{children}</span>
        </span>
    );
};

export default Badge;
