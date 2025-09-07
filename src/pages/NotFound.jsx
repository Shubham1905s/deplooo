import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="page_404">
      <div className="four_zero_four_bg">
        <h1>404</h1>
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="404 illustration"
        />
      </div>

      <div className="contant_box_404">
        <h3>Looks like you're lost</h3>
        <p>The page you are looking for is not available!</p>
        <Link to="/" className="link_404">Go to Home</Link>
      </div>
    </section>
  );
}
