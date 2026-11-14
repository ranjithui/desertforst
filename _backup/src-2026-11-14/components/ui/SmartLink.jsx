import { Link } from 'react-router-dom';
import { isExternal, normaliseUrl } from '../../lib/format';

/** Router link for internal paths, new-tab anchor for external URLs (as the original does). */
export default function SmartLink({ to, children, ...rest }) {
  if (!to) return <span {...rest}>{children}</span>;
  if (isExternal(to)) {
    return (
      <a href={normaliseUrl(to)} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return <Link to={to} {...rest}>{children}</Link>;
}
