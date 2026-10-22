import { Link, useLocation, useNavigate } from 'react-router';
import type { FromCatalogState } from '../returnPosition';

/** "← All agents" — does the same as the browser back button when the catalog is the previous page. */
export function BackLink() {
  const navigate = useNavigate();
  const fromCatalog = (useLocation().state as FromCatalogState | null)?.fromCatalog === true;

  return (
    <Link
      to="/"
      className="back"
      onClick={(ev) => {
        if (fromCatalog) {
          ev.preventDefault();
          navigate(-1);
        }
      }}
    >
      ← All agents
    </Link>
  );
}
