import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-xl font-semibold text-gray-700 h-full" aria-label="Breadcrumb">
      <ol className="list-reset flex">
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {isLast ? (
                <span className="text-gray-700 capitalize">{decodeURIComponent(value)}</span>
              ) : (
                <Link to={to} className="text-blue-600 hover:underline capitalize">
                  {decodeURIComponent(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
