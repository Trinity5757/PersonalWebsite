// This is the navigation for the entire website.


//Using link allows for the entire application to not be reloaded
import { Link } from 'react-router-dom';

export default function Navigation() {
    return (
        <nav className="bg-[var(--highlightColor)] text-[var(--background)] shadow-lg/20 ">
            <ul className="flex justify-between items-center p-4 w-full text-shadow-lg">
                <li className="font-headingFont font-bold text-xl">Trinity Stallworth</li>
                <div className="flex space-x-4">
                    <li className="hover:text-[var(--surfaceColor)]">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="hover:text-[var(--surfaceColor)]">
                        <Link to="/projects">Projects</Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
}

